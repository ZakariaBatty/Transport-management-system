"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import {
  LayoutDashboard,
  MapPin,
  Users,
  Truck,
  BarChart3,
  Calendar,
  Settings,
  LogOut,
  ChevronDown,
  Shield,
  Wrench,
  X,
  Menu,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AppSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  {
    href: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["DRIVER", "MANAGER", "ADMIN", "SUPER_ADMIN"],
  },
  // Driver-only routes
  {
    href: "/driver/trips",
    label: "My Trips",
    icon: MapPin,
    roles: ["DRIVER"],
  },
  {
    href: "/driver/vehicle",
    label: "My Vehicle",
    icon: Truck,
    roles: ["DRIVER"],
  },
  {
    href: "/driver/calendar",
    label: "Calendar",
    icon: Calendar,
    roles: ["DRIVER"],
  },
  // Admin routes
  {
    href: "/trips",
    label: "Trips",
    icon: MapPin,
    roles: ["MANAGER", "ADMIN", "SUPER_ADMIN"],
  },
  {
    href: "/drivers",
    label: "Drivers",
    icon: Users,
    roles: ["MANAGER", "ADMIN", "SUPER_ADMIN"],
  },
  {
    href: "/vehicles",
    label: "Fleet",
    icon: Truck,
    roles: ["MANAGER", "ADMIN", "SUPER_ADMIN"],
  },
  {
    href: "/locations",
    label: "Locations",
    icon: Building2,
    roles: ["MANAGER", "ADMIN", "SUPER_ADMIN"],
  },
  {
    href: "/maintenance",
    label: "Maintenance",
    icon: Wrench,
    roles: ["MANAGER", "ADMIN", "SUPER_ADMIN"],
    dot: true,
  },
  {
    href: "/reports",
    label: "Reports",
    icon: BarChart3,
    roles: ["MANAGER", "ADMIN", "SUPER_ADMIN"],
  },
  {
    href: "/users",
    label: "Users",
    icon: Shield,
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
];

export function AppSidebar({ isOpen = true, onClose }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const filtered = navItems.filter((item) =>
    item.roles.includes(user?.role ?? ""),
  );
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-full w-56 flex-col border-r border-border bg-background transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0",
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Truck className="size-4 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-bold leading-none text-foreground">
                TransitHub
              </p>
              <p className="text-[10px] text-muted-foreground">
                Fleet Operations
              </p>
            </div>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 md:hidden"
              onClick={onClose}
            >
              <X className="size-4" />
            </Button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
          {filtered.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span>{item.label}</span>
                {item.dot && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-border p-3 space-y-2">
          {/* Live clock */}
          <div className="rounded-lg bg-muted/60 px-3 py-2 text-center">
            <p className="font-mono text-base font-bold tabular-nums text-foreground">
              {time.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </p>
            <p className="text-[10px] font-medium text-muted-foreground">
              {time.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-accent">
                <Avatar className="h-7 w-7 text-xs">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                    {user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-foreground">
                    {user?.name}
                  </p>
                  <p className="text-[10px] capitalize text-muted-foreground">
                    {user?.role?.replace("_", " ")}
                  </p>
                </div>
                <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-52">
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center gap-2">
                  <Settings className="size-3.5" />
                  Profile Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="size-3.5" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </>
  );
}
