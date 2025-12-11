'use server';

import { signIn } from "@/auth";
import { logger } from '@/lib/logger';

export async function doSocialLogin(provider: string) {
  console.log("Attempting social login with:", provider);
  try {
    await signIn("google", { redirectTo: "/" });
  } catch (error) {
    console.error("Social login error:", error);
    throw error;
  }
}

export async function doLogin(email: string, password: string, rememberMe?: boolean) {
  console.log("Attempting login with:", email, rememberMe);

  try {
    const res = await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    })

    logger.log("Login response:", res);

  } catch (err) {
    logger.error("Login error:", err);
  }

}
