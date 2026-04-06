"use client";

import {
  Home,
  LogOutIcon,
  StethoscopeIcon,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const navItemsByRole: Record<
  string,
  ReadonlyArray<{ href: string; label: string; icon: LucideIcon }>
> = {
  ADMIN: [{ href: "/dashboard/admin", label: "Home", icon: Home }],
  RECEPTIONIST: [
    { href: "/dashboard/receptionist", label: "Home", icon: Users },
    {
      href: "/dashboard/receptionist/patients",
      label: "Patients",
      icon: Users,
    },
    {
      href: "/dashboard/receptionist/appointments",
      label: "Appointments",
      icon: StethoscopeIcon,
    },
  ],
  DOCTOR: [
    { href: "/dashboard/doctor", label: "Home", icon: Home },
    { href: "/dashboard/doctor/patients", label: "Patients", icon: Users },
    {
      href: "/dashboard/doctor/appointments",
      label: "Appointments",
      icon: StethoscopeIcon,
    },
  ],
};

function getStoredUserType() {
  if (typeof window === "undefined") return null;

  const localUserType = localStorage.getItem("user_type");
  if (localUserType) return localUserType.toUpperCase();

  const match = document.cookie.match(/(?:^|;\s*)user_type=([^;]+)/);
  return match ? decodeURIComponent(match[1]).toUpperCase() : null;
}

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const normalizedPathname = pathname?.replace(/\/$/, "") ?? "";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setMounted(true);
    });
  }, []);

  const userType = useMemo(() => {
    if (!mounted) return null;
    const _pathname = pathname;
    return getStoredUserType();
  }, [mounted, pathname]);

  const navItems = useMemo(
    () => (userType ? (navItemsByRole[userType] ?? []) : []),
    [userType],
  );

  const homeHref = useMemo(
    () => navItems[0]?.href ?? "/auth/signin",
    [navItems],
  );

  function clearCookie(name: string) {
    if (typeof document === "undefined") return;
    document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
  }

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

  const activeItem = navItems
    .slice()
    .sort((a, b) => b.href.length - a.href.length)
    .find(
      (item) =>
        normalizedPathname === item.href ||
        normalizedPathname.startsWith(`${item.href}/`),
    );

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex h-[31] items-center px-2 text-sm font-semibold">
          <Link href={homeHref} className="text-primary truncate text-3xl">
            ClinicO
          </Link>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = item.href === activeItem?.href;
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className={`text-primary! ${isActive ? "bg-primary/10!" : ""}`}
                    >
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* <SidebarSeparator /> */}
      <SidebarFooter>
        <div className="px-2 pb-2">
          <Button
            variant="danger"
            size="sm"
            className="w-full cursor-pointer justify-center gap-2 rounded-lg text-sm font-semibold"
            onClick={handleLogout}
          >
            <LogOutIcon className="size-4" />
            Logout
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
