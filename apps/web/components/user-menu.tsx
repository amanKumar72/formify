"use client";

import { LogOut, Settings, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useSignOut } from "~/hooks/api/auth";

type UserMenuUser = {
  fullName: string;
  email: string;
  profileImageUrl: string | null;
};

type UserMenuProps = {
  user: UserMenuUser;
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";

export const UserMenu = ({ user }: UserMenuProps) => {
  const router = useRouter();
  const { signOutAsync } = useSignOut();

  const handleLogout = async () => {
    try {
      await signOutAsync({});
      router.replace("/signin");
      toast.success("Signed out", {
        position: "top-right",
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Logout failed";
      toast.error(message, {
        position: "top-right",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
        <Avatar className="size-10 border border-white/10 bg-surface-container">
          {user.profileImageUrl && <AvatarImage src={user.profileImageUrl} alt={user.fullName} />}
          <AvatarFallback className="bg-primary text-primary-foreground font-heading font-bold">
            {getInitials(user.fullName)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 border-white/10 bg-surface-container">
        <DropdownMenuLabel>
          <span className="block truncate font-heading text-sm text-foreground">
            {user.fullName}
          </span>
          <span className="block truncate font-body text-xs text-on-surface-variant">
            {user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <LayoutDashboard />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} variant="destructive">
          <LogOut />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
