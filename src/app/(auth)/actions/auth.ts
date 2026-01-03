'use server';

import { auth, signIn, signOut } from "@/auth";

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
  const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });


    console.log("Login result:", result);

    const data = await auth();

    const role =  data?.user?.role || "STUDENT";

    // redirect based on role
    if (role === "ADMIN") {
      redirect("/admin/dashboard");
    } else if (role === "TEACHER") {
      redirect("/teacher/dashboard");
    } else {
      redirect("/student/dashboard");
    }

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
