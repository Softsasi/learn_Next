import { prisma } from '@/lib/prisma';
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { cookies, headers } from 'next/headers';
import { createLoginHistory, loginService } from './app/api/_services/auth/login';
import { logger } from './lib/logger';

// Helper function to get user IP address
function getUserIP(headersList: any): string | undefined {
  const forwarded = headersList.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return headersList.get("x-real-ip") || undefined;
}

// Helper function to get user agent
function getUserAgent(headersList: any): string | undefined {
  return headersList.get("user-agent") || undefined;
}


async function getOAuthRole(): Promise<"STUDENT" | "TEACHER"> {
  const cookieStore = await cookies();
  const role = cookieStore.get("oauth_role")?.value;

  if (role === "teacher" ) return "TEACHER";
  return "STUDENT";
}


export const { handlers, signIn, signOut, auth } = NextAuth({

  trustHost: true,
  pages: {
    error: '/signin',
  },

  session: {
    strategy: 'jwt'
  },

  providers: [

    GoogleProvider({
    clientId: process.env.AUTH_GOOGLE_ID!,
    clientSecret: process.env.AUTH_GOOGLE_SECRET!,

    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
        role: profile.role ?? "STUDENT",
        emailVerified: profile.email_verified,
      }
    },

      authorization:{
      params:{
        prompt: "consent",
        access_type: "offline",
        response_type: "code",
      }
    }
  }),

  Credentials({
    credentials: {
email: {
  label: "Email",
  type: "email",
  placeholder: "Enter your email"
},
password: {
  label: "Password",
  type: "password",
  placeholder: "Enter your password"
}
  },

  authorize: async (credentials)=> {

      const { email, password } = credentials;

      if (!email || !password) {
        return null;
      }

      // Get request headers for tracking
      const headersList = await headers();
      const ipAddress = getUserIP(headersList);
      const userAgent = getUserAgent(headersList);

     const result= await loginService(
        email as string,
        password as string,
        userAgent,
        ipAddress,

      ) as any;

        const user = result?.data
        if (!user) return null

        console.log("[AUTH] User logged in:", user);

         return {
          id: user.userId,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
          image: user.avatarUrl ?? null,
        }
  }

  })


],

  callbacks: {

    async signIn({
      user,
      account,
      profile,
    }) {

      // Get request headers for tracking
      const headersList = await headers();
      const ipAddress = getUserIP(headersList);
      const userAgent = getUserAgent(headersList);

      // Custom sign-in logic
      logger.log({
        user,
        account,
        profile,
        ipAddress,
        userAgent,
      })


      if (account?.provider === "google") {
        const email = user.email;

       const role = await getOAuthRole();

        if (!email) {
          return false;
        }


        // Check if AuthUser already exists
        let authUser = await prisma.authUser.findUnique({
          where: {email: email},
          include: { user: true },
        });

        if (!authUser){
           const [firstName, ...rest] = (user.name ?? "").split(" ");
           const lastName = rest.join(" ");

           authUser = await prisma.authUser.create({
            data: {
              email: email,
              role: role,
              verified: true,
              status: "ACTIVE",
              provider: "google",
              providerId: user.id,
              user: {
                create: {
                  firstName: firstName,
                  lastName: lastName,
                  avatarUrl: user.image ?? undefined,
                }
              }
            },
            include: {
              user: true,
            }
           })

           await createLoginHistory({
            userId: authUser.id,
            userAgent: userAgent,
            ipAddress: ipAddress,
            attempt: "SUCCESS",
           })
        } else {
          // For existing users, also create login history
          await createLoginHistory({
            userId: authUser.id,
            userAgent: userAgent,
            ipAddress: ipAddress,
            attempt: "SUCCESS",
          })
        }

        user.id = authUser.id;
        (user as any).role = authUser.role

        return true;
      }
      return true;

    },


    async jwt({
      token,
      user,
    }){
      // Run when user sign in
       if (user) {
        token.userId = user.id
        token.email = user.email
        token.name = user.name
        token.role = (user as any).role ?? "STUDENT"
        token.picture = user.image
      }

      return token;
    },

    async session({
      session,
      token,
    }){

       if (session.user) {
        session.user.id = token.userId as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.role = token.role as string
        session.user.image = token.picture as string | null
      }

      return session
    }

  }
})
