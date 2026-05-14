"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AuthForm from "@/components/AuthForm";
import { useAuth } from "@/context/AuthContext";
import { register } from "@/services/authService";
import { saveToken } from "@/services/tokenService";

export default function RegisterPage() {
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

  async function handleRegister() {
    try {
      setErrorMessage("");

      if (!email.includes("@")) {
        setErrorMessage("Please enter a valid email.");
        return;
      }

      if (password.length < 8) {
        setErrorMessage("Password must be at least 8 characters.");
        return;
      }
      const data = await register(email, password);
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
      title="Register"
      buttonText="Create account"
      email={email}
      password={password}
      errorMessage={errorMessage}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleRegister}
    />
  );
}