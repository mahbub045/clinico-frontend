"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Navbar() {
  const name = "Dr. John";
  const initials = "DJ";

  return (
    <header className="sticky top-0 z-40 flex h-12 items-center gap-3 border-b bg-background px-4">
      <SidebarTrigger className="cursor-pointer" />

      <div className="ml-auto flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Avatar size="sm">
            <AvatarImage src="/window.svg" alt={name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="text-sm font-medium leading-none">{name}</div>
        </div>
      </div>
    </header>
  );
}
