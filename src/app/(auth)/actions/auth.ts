'use server';

import { signIn, signOut } from "@/auth";

export async function doSocialLogin(provider: string) {
  console.log("Attempting social login with:", provider);
  try {
    await signIn("google", { redirectTo: "/" });
  } catch (error) {
    console.error("Social login error:", error);
    throw error;
  }
}


import { redirect } from "next/navigation";

export async function doLogin(email: string, password: string) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    redirect("/");
  } catch (err: any) {
    if (err?.type === "CredentialsSignin") {
      return { error: "Invalid email or password" };
    }

    throw err;
  }
}


export async function doLogout() {
  try {
    await signOut({ redirectTo: "/signin" });
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
    }
}
