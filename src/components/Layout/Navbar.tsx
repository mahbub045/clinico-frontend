"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useGetUserInfoQuery } from "@/redux/reducers/Common/UserInfo/UserInfoApi";

export function Navbar() {
  const { data: userInfo } = useGetUserInfoQuery(undefined);
  const displayName =
    [userInfo?.title, userInfo?.first_name, userInfo?.last_name]
      .filter(Boolean)
      .join(" ") || "User Name";
  const initials = userInfo
    ? `${userInfo.first_name?.[0] || ""}${userInfo.last_name?.[0] || ""}`.toUpperCase()
    : "UN";
  const avatarSrc = userInfo?.profile_image || "/window.svg";

  return (
    <header className="bg-background sticky top-0 z-40 flex h-12 items-center gap-3 border-b px-4">
      <SidebarTrigger className="cursor-pointer" />

      <div className="ml-auto flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Avatar size="sm">
            <AvatarImage src={avatarSrc} alt={displayName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="text-primary text-sm leading-none font-medium">
            {displayName}
          </div>
        </div>
      </div>
    </header>
  );
}
