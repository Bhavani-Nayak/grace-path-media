"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthViewModel } from "@/viewmodels/useAuthViewModel";
import LoginView from "@/components/views/LoginView";

export default function LoginPage() {
  const vm = useAuthViewModel();
  const router = useRouter();

  useEffect(() => {
    if (vm.user) {
      router.push("/account/downloads");
    }
  }, [vm.user, router]);

  return (
    <LoginView
      user={vm.user}
      isLoading={vm.isLoading}
      error={vm.error}
      signInWithGoogle={vm.signInWithGoogle}
      signOut={vm.signOut}
    />
  );
}
