import { prisma } from '@/lib/prisma';
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { createLoginHistory, loginService } from './app/api/_services/auth/login';
import { logger } from './lib/logger';


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
        response_type: "code"
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
      let user = null;

      const { email, password } = credentials;

      if (!email || !password) {
        return null;
      }


     const result= await loginService(
        email as string,
        password as string,
        undefined,
        undefined,

      ) as any;

      const userData = result.data;

      console.log("userData", userData);



      return userData ? {
        id: userData.userId,
        name: userData.firstName + " " + userData.lastName,
        email: userData.email,
        role: userData.role,
        image: userData.avatarUrl,
      } : null;


  }

  })


],

  callbacks: {

    async signIn({
      user,
      account,
      profile,
    }) {

      // Custom sign-in logic
      logger.log({
        user,
        account,
        profile,
      })


      if (account?.provider === "google") {
        const email = user.email;

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
              role: "STUDENT",
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
            userAgent: undefined,
            ipAddress: undefined,
            attempt: "SUCCESS",
           })

           return true;
        }



      }

      return true;

    },


    async jwt({
      token,
      user,
    }){

      // logger.debug("JWT callback", {
      //   token,
      // })

      //  token = {
      //   ...token,
      //   role: user?.role || token.role || "STUDENT",
      //   image: user?.image || token.image,
      // }



      return token;
    },

    async session({
      session,
      token,

    }){



      return session;
    }

  }
})
