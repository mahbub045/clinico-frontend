"use client";

import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

function clearCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user_type");
    }

    clearCookie("token");
    clearCookie("user_type");

    router.replace("/auth/signin");
  }

  return (
    <Button
      variant="danger"
      size="lg"
      className="min-w-48 cursor-pointer justify-center gap-2"
      onClick={handleLogout}
    >
      <LogOutIcon className="size-4" />
      Logout
    </Button>
  );
}
