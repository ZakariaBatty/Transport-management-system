import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

// ─── STAT CARD ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "danger" | "purple" | "accent";
  trend?: "up" | "down";
}

const variantStyles = {
  default: { icon: "bg-blue-50 text-blue-600", value: "text-foreground" },
  success: { icon: "bg-emerald-50 text-emerald-600", value: "text-foreground" },
  warning: { icon: "bg-amber-50 text-amber-600", value: "text-foreground" },
  danger: { icon: "bg-red-50 text-red-600", value: "text-foreground" },
  purple: { icon: "bg-violet-50 text-violet-600", value: "text-foreground" },
  accent: { icon: "bg-sky-50 text-sky-600", value: "text-foreground" },
};

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  variant = "default",
  trend,
}: StatCardProps) {
  const styles = variantStyles[variant];
  return (
    <Card className="border-border/60 shadow-sm">
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
            styles.icon,
          )}
        >
          <Icon className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p
            className={cn(
              "mt-0.5 font-mono text-2xl font-bold leading-none",
              styles.value,
            )}
          >
            {value}
          </p>
          {sub && (
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              {trend === "up" && (
                <TrendingUp className="size-3 text-emerald-500" />
              )}
              {trend === "down" && (
                <TrendingDown className="size-3 text-red-500" />
              )}
              {sub}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── PAGE HEADER ──────────────────────────────────────────────────────────────

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

// ─── STATUS BADGES ────────────────────────────────────────────────────────────

import { Badge } from "@/components/ui/badge";
import {
  TripStatus,
  DriverStatus,
  VehicleStatus,
  MaintenanceType,
  UserRole,
  UserStatus,
} from "@/lib/data";

export function TripStatusBadge({ status }: { status: TripStatus }) {
  const map: Record<TripStatus, { label: string; className: string }> = {
    COMPLETED: {
      label: "Completed",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    IN_PROGRESS: {
      label: "In Progress",
      className: "bg-blue-50 text-blue-700 border-blue-200",
    },
    SCHEDULED: {
      label: "Scheduled",
      className: "bg-slate-100 text-slate-600 border-slate-200",
    },
    ASSIGNED: {
      label: "Assigned",
      className: "bg-violet-50 text-violet-700 border-violet-200",
    },
    CANCELLED: {
      label: "Cancelled",
      className: "bg-violet-50 text-violet-700 border-violet-200",
    },
  };
  const { label, className } = map[status] ?? { label: status, className: "" };
  return (
    <Badge variant="outline" className={cn("text-xs font-semibold", className)}>
      {label}
    </Badge>
  );
}

export function DriverStatusBadge({ status }: { status: DriverStatus }) {
  const map: Record<DriverStatus, { label: string; className: string }> = {
    AVAILABLE: {
      label: "Available",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    ON_TRIP: {
      label: "On Trip",
      className: "bg-blue-50 text-blue-700 border-blue-200",
    },
    OFF_DUTY: {
      label: "Off Duty",
      className: "bg-slate-100 text-slate-600 border-slate-200",
    },
  };
  const { label, className } = map[status] ?? { label: status, className: "" };
  return (
    <Badge variant="outline" className={cn("text-xs font-semibold", className)}>
      {label}
    </Badge>
  );
}

export function VehicleStatusBadge({ status }: { status: VehicleStatus }) {
  const map: Record<VehicleStatus, { label: string; className: string }> = {
    AVAILABLE: {
      label: "Available",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    IN_USE: {
      label: "In Use",
      className: "bg-blue-50 text-blue-700 border-blue-200",
    },
    MAINTENANCE: {
      label: "Maintenance",
      className: "bg-amber-50 text-amber-700 border-amber-200",
    },
  };
  const { label, className } = map[status] ?? { label: status, className: "" };
  return (
    <Badge variant="outline" className={cn("text-xs font-semibold", className)}>
      {label}
    </Badge>
  );
}

export function MaintenanceTypeBadge({ type }: { type: MaintenanceType }) {
  const map: Record<MaintenanceType, { label: string; className: string }> = {
    "oil-change": {
      label: "Oil Change",
      className: "bg-blue-50 text-blue-700 border-blue-200",
    },
    inspection: {
      label: "Inspection",
      className: "bg-slate-100 text-slate-600 border-slate-200",
    },
    "tire-replacement": {
      label: "Tires",
      className: "bg-amber-50 text-amber-700 border-amber-200",
    },
    service: {
      label: "Service",
      className: "bg-sky-50 text-sky-700 border-sky-200",
    },
    "brake-service": {
      label: "Brake Service",
      className: "bg-red-50 text-red-700 border-red-200",
    },
    repair: {
      label: "Repair",
      className: "bg-violet-50 text-violet-700 border-violet-200",
    },
  };
  const { label, className } = map[type] ?? { label: type, className: "" };
  return (
    <Badge variant="outline" className={cn("text-xs font-semibold", className)}>
      {label}
    </Badge>
  );
}

export function RoleBadge({ role }: { role: UserRole }) {
  const map: Record<UserRole, { label: string; className: string }> = {
    DRIVER: {
      label: "Driver",
      className: "bg-blue-50 text-blue-700 border-blue-200",
    },
    MANAGER: {
      label: "Manager",
      className: "bg-violet-50 text-violet-700 border-violet-200",
    },
    ADMIN: {
      label: "Admin",
      className: "bg-amber-50 text-amber-700 border-amber-200",
    },
    SUPER_ADMIN: {
      label: "Super Admin",
      className: "bg-red-50 text-red-700 border-red-200",
    },
  };
  const { label, className } = map[role] ?? { label: role, className: "" };
  return (
    <Badge variant="outline" className={cn("text-xs font-semibold", className)}>
      {label}
    </Badge>
  );
}

export function UserStatusBadge({ status }: { status: UserStatus }) {
  const map: Record<UserStatus, { label: string; className: string }> = {
    ACTIVE: {
      label: "ACTIVE",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    INACTIVE: {
      label: "INACTIVE",
      className: "bg-slate-100 text-slate-600 border-slate-200",
    },
    SUSPENDED: {
      label: "SUSPENDED",
      className: "bg-red-50 text-red-700 border-red-200",
    },
  };
  const { label, className } = map[status] ?? { label: status, className: "" };
  return (
    <Badge variant="outline" className={cn("text-xs font-semibold", className)}>
      {label}
    </Badge>
  );
}

export function TripTypeBadge({ type }: { type: "IN" | "OUT" }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs font-bold",
        type === "OUT"
          ? "bg-blue-50 text-blue-700 border-blue-200"
          : "bg-emerald-50 text-emerald-700 border-emerald-200",
      )}
    >
      {type}
    </Badge>
  );
}
