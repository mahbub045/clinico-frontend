"use client";

import {
  BriefcaseMedical,
  Files,
  Home,
  NotebookPen,
  StethoscopeIcon,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navItemsByRole: Record<
  string,
  ReadonlyArray<{ href: string; label: string; icon: LucideIcon }>
> = {
  ADMIN: [
    { href: "/dashboard/admin", label: "Home", icon: Home },
    {
      href: "/dashboard/admin/doctors",
      label: "Doctors",
      icon: StethoscopeIcon,
    },
    {
      href: "/dashboard/admin/receptionists",
      label: "Receptionists",
      icon: Users,
    },
    {
      href: "/dashboard/admin/prescriptions",
      label: "Prescriptions",
      icon: NotebookPen,
    },
    {
      href: "/dashboard/admin/medical-records",
      label: "Medical Records",
      icon: Files,
    },
  ],

  RECEPTIONIST: [
    { href: "/dashboard/receptionist", label: "Home", icon: Home },
    {
      href: "/dashboard/receptionist/doctors",
      label: "Doctors",
      icon: StethoscopeIcon,
    },
    {
      href: "/dashboard/receptionist/patients",
      label: "Patients",
      icon: Users,
    },
    {
      href: "/dashboard/receptionist/appointments",
      label: "Appointments",
      icon: BriefcaseMedical,
    },
    {
      href: "/dashboard/receptionist/prescriptions",
      label: "Prescriptions",
      icon: NotebookPen,
    },
    {
      href: "/dashboard/receptionist/medical-records",
      label: "Medical Records",
      icon: Files,
    },
  ],

  DOCTOR: [
    { href: "/dashboard/doctor", label: "Home", icon: Home },
    {
      href: "/dashboard/doctor/doctors",
      label: "Doctors",
      icon: StethoscopeIcon,
    },
    { href: "/dashboard/doctor/patients", label: "Patients", icon: Users },
    {
      href: "/dashboard/doctor/appointments",
      label: "Appointments",
      icon: BriefcaseMedical,
    },
    {
      href: "/dashboard/doctor/prescriptions",
      label: "Prescriptions",
      icon: NotebookPen,
    },
    {
      href: "/dashboard/doctor/medical-records",
      label: "Medical Records",
      icon: Files,
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
        <div className="flex h-[31] items-center justify-between px-2 text-sm font-semibold">
          <Link href={homeHref} className="text-primary truncate text-3xl">
            ClinicO
          </Link>
          <SidebarTrigger className="cursor-pointer md:hidden" />
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
        <div className="flex flex-col items-center justify-center px-2 pb-2">
          <small className="text-muted-foreground">Powered by</small>
          <span className="text-primary text-2xl">ClinicO</span>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
