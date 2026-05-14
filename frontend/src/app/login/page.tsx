"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AuthForm from "@/components/AuthForm";
import { useAuth } from "@/context/AuthContext";
import { login } from "@/services/authService";
import { saveToken } from "@/services/tokenService";

export default function LoginPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  async function handleLogin() {
    try {
      setErrorMessage("");

      const data = await login(email, password);
      saveToken(data.token);

      await refreshUser();
      router.push("/");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    }
  }

  return (
    <AuthForm
      title="Login"
      buttonText="Login"
      email={email}
      password={password}
      errorMessage={errorMessage}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleLogin}
    />
  );
}