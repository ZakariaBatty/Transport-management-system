-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('DRIVER', 'MANAGER', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "public"."DriverStatus" AS ENUM ('AVAILABLE', 'ON_TRIP', 'OFF_DUTY');

-- CreateEnum
CREATE TYPE "public"."VehicleStatus" AS ENUM ('AVAILABLE', 'IN_USE', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "public"."TripStatus" AS ENUM ('SCHEDULED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."TripType" AS ENUM ('OUT', 'IN');

-- CreateEnum
CREATE TYPE "public"."MaintenanceType" AS ENUM ('OIL_CHANGE', 'INSPECTION', 'REPAIR', 'SERVICE', 'TIRE_REPLACEMENT', 'BRAKE_SERVICE');

-- CreateEnum
CREATE TYPE "public"."TripImageType" AS ENUM ('BEFORE', 'AFTER', 'DURING', 'DOCUMENTATION');

-- CreateEnum
CREATE TYPE "public"."MaintenanceStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL,
    "status" "public"."UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "avatar" TEXT,
    "department" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLogin" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Permission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "canAccessDashboard" BOOLEAN NOT NULL DEFAULT false,
    "canAccessTrips" BOOLEAN NOT NULL DEFAULT false,
    "canAccessDrivers" BOOLEAN NOT NULL DEFAULT false,
    "canAccessVehicles" BOOLEAN NOT NULL DEFAULT false,
    "canAccessMaintenance" BOOLEAN NOT NULL DEFAULT false,
    "canAccessAgencies" BOOLEAN NOT NULL DEFAULT false,
    "canAccessHotels" BOOLEAN NOT NULL DEFAULT false,
    "canAccessReports" BOOLEAN NOT NULL DEFAULT false,
    "canAccessUsers" BOOLEAN NOT NULL DEFAULT false,
    "canAccessProfile" BOOLEAN NOT NULL DEFAULT false,
    "canAccessCalendar" BOOLEAN NOT NULL DEFAULT false,
    "canManageUsers" BOOLEAN NOT NULL DEFAULT false,
    "canManageRoles" BOOLEAN NOT NULL DEFAULT false,
    "canManagePermissions" BOOLEAN NOT NULL DEFAULT false,
    "canExportData" BOOLEAN NOT NULL DEFAULT false,
    "canDeleteData" BOOLEAN NOT NULL DEFAULT false,
    "canViewReports" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Driver" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "public"."DriverStatus" NOT NULL DEFAULT 'AVAILABLE',
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "licenseNumber" TEXT NOT NULL,
    "licenseExpiry" TIMESTAMP(3) NOT NULL,
    "totalTrips" INTEGER NOT NULL DEFAULT 0,
    "totalKm" INTEGER NOT NULL DEFAULT 0,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Vehicle" (
    "id" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "plate" TEXT NOT NULL,
    "vin" TEXT NOT NULL,
    "registrationExpiry" TIMESTAMP(3) NOT NULL,
    "capacity" INTEGER NOT NULL,
    "kmUsage" INTEGER NOT NULL DEFAULT 0,
    "status" "public"."VehicleStatus" NOT NULL DEFAULT 'AVAILABLE',
    "monthlyRent" DOUBLE PRECISION NOT NULL,
    "salik" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "owner" TEXT,
    "lastMaintenance" TIMESTAMP(3),
    "nextMaintenanceDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VehicleAssignment" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unassignedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Agency" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contactPerson" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT,
    "city" TEXT,
    "totalTrips" INTEGER NOT NULL DEFAULT 0,
    "totalPassengers" INTEGER NOT NULL DEFAULT 0,
    "totalRevenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Agency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Hotel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "totalTrips" INTEGER NOT NULL DEFAULT 0,
    "totalPassengers" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Hotel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Trip" (
    "id" TEXT NOT NULL,
    "tripDate" TIMESTAMP(3) NOT NULL,
    "departureTime" TEXT NOT NULL,
    "estimatedArrivalTime" TEXT,
    "actualArrivalTime" TEXT,
    "pickupLocation" TEXT NOT NULL,
    "dropoffLocation" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "type" "public"."TripType" NOT NULL,
    "status" "public"."TripStatus" NOT NULL DEFAULT 'SCHEDULED',
    "passengersCount" INTEGER NOT NULL,
    "notes" TEXT,
    "kmStart" INTEGER NOT NULL,
    "kmEnd" INTEGER,
    "distanceTravelled" INTEGER,
    "tripPrice" DOUBLE PRECISION,
    "actualCost" DOUBLE PRECISION,
    "agencyId" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TripAssignment" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "assignedByUserId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TripAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TripImage" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imageType" "public"."TripImageType" NOT NULL,
    "caption" TEXT,
    "fileSize" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "TripImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MaintenanceRecord" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "maintenanceType" "public"."MaintenanceType" NOT NULL,
    "status" "public"."MaintenanceStatus" NOT NULL DEFAULT 'SCHEDULED',
    "description" TEXT NOT NULL,
    "notes" TEXT,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "completedDate" TIMESTAMP(3),
    "nextDueDate" TIMESTAMP(3),
    "estimatedCost" DOUBLE PRECISION,
    "actualCost" DOUBLE PRECISION,
    "supplier" TEXT,
    "invoiceNumber" TEXT,
    "performedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "MaintenanceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "createdByUserId" TEXT,
    "driverId" TEXT,
    "tripId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "changes" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CalendarEvent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "eventType" TEXT NOT NULL,
    "startDateTime" TIMESTAMP(3) NOT NULL,
    "endDateTime" TIMESTAMP(3) NOT NULL,
    "tripId" TEXT,
    "reminderMinutes" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CalendarEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Report" (
    "id" TEXT NOT NULL,
    "reportType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "reportStartDate" TIMESTAMP(3) NOT NULL,
    "reportEndDate" TIMESTAMP(3) NOT NULL,
    "data" TEXT NOT NULL,
    "generatedBy" TEXT,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "notificationType" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "relatedEntityType" TEXT,
    "relatedEntityId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "address" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ExportLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "exportType" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT,
    "filtersCriteria" TEXT,
    "recordsExported" INTEGER NOT NULL,
    "fileSize" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "ExportLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "public"."User"("phone");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "public"."User"("role");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "public"."User"("status");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "Permission_userId_idx" ON "public"."Permission"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_userId_key" ON "public"."Permission"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_userId_key" ON "public"."Driver"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_licenseNumber_key" ON "public"."Driver"("licenseNumber");

-- CreateIndex
CREATE INDEX "Driver_userId_idx" ON "public"."Driver"("userId");

-- CreateIndex
CREATE INDEX "Driver_status_idx" ON "public"."Driver"("status");

-- CreateIndex
CREATE INDEX "Driver_licenseExpiry_idx" ON "public"."Driver"("licenseExpiry");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_plate_key" ON "public"."Vehicle"("plate");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_vin_key" ON "public"."Vehicle"("vin");

-- CreateIndex
CREATE INDEX "Vehicle_plate_idx" ON "public"."Vehicle"("plate");

-- CreateIndex
CREATE INDEX "Vehicle_status_idx" ON "public"."Vehicle"("status");

-- CreateIndex
CREATE INDEX "Vehicle_registrationExpiry_idx" ON "public"."Vehicle"("registrationExpiry");

-- CreateIndex
CREATE INDEX "Vehicle_kmUsage_idx" ON "public"."Vehicle"("kmUsage");

-- CreateIndex
CREATE INDEX "VehicleAssignment_vehicleId_idx" ON "public"."VehicleAssignment"("vehicleId");

-- CreateIndex
CREATE INDEX "VehicleAssignment_driverId_idx" ON "public"."VehicleAssignment"("driverId");

-- CreateIndex
CREATE INDEX "VehicleAssignment_isActive_idx" ON "public"."VehicleAssignment"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleAssignment_vehicleId_driverId_unassignedAt_key" ON "public"."VehicleAssignment"("vehicleId", "driverId", "unassignedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Agency_name_key" ON "public"."Agency"("name");

-- CreateIndex
CREATE INDEX "Agency_name_idx" ON "public"."Agency"("name");

-- CreateIndex
CREATE INDEX "Agency_city_idx" ON "public"."Agency"("city");

-- CreateIndex
CREATE UNIQUE INDEX "Hotel_name_key" ON "public"."Hotel"("name");

-- CreateIndex
CREATE INDEX "Hotel_name_idx" ON "public"."Hotel"("name");

-- CreateIndex
CREATE INDEX "Hotel_city_idx" ON "public"."Hotel"("city");

-- CreateIndex
CREATE INDEX "Trip_tripDate_idx" ON "public"."Trip"("tripDate");

-- CreateIndex
CREATE INDEX "Trip_driverId_idx" ON "public"."Trip"("driverId");

-- CreateIndex
CREATE INDEX "Trip_vehicleId_idx" ON "public"."Trip"("vehicleId");

-- CreateIndex
CREATE INDEX "Trip_agencyId_idx" ON "public"."Trip"("agencyId");

-- CreateIndex
CREATE INDEX "Trip_hotelId_idx" ON "public"."Trip"("hotelId");

-- CreateIndex
CREATE INDEX "Trip_status_idx" ON "public"."Trip"("status");

-- CreateIndex
CREATE INDEX "Trip_type_idx" ON "public"."Trip"("type");

-- CreateIndex
CREATE INDEX "TripAssignment_tripId_idx" ON "public"."TripAssignment"("tripId");

-- CreateIndex
CREATE INDEX "TripAssignment_assignedByUserId_idx" ON "public"."TripAssignment"("assignedByUserId");

-- CreateIndex
CREATE UNIQUE INDEX "TripAssignment_tripId_key" ON "public"."TripAssignment"("tripId");

-- CreateIndex
CREATE INDEX "TripImage_tripId_idx" ON "public"."TripImage"("tripId");

-- CreateIndex
CREATE INDEX "TripImage_imageType_idx" ON "public"."TripImage"("imageType");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_vehicleId_idx" ON "public"."MaintenanceRecord"("vehicleId");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_scheduledDate_idx" ON "public"."MaintenanceRecord"("scheduledDate");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_nextDueDate_idx" ON "public"."MaintenanceRecord"("nextDueDate");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_maintenanceType_idx" ON "public"."MaintenanceRecord"("maintenanceType");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_status_idx" ON "public"."MaintenanceRecord"("status");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "public"."AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_createdByUserId_idx" ON "public"."AuditLog"("createdByUserId");

-- CreateIndex
CREATE INDEX "AuditLog_driverId_idx" ON "public"."AuditLog"("driverId");

-- CreateIndex
CREATE INDEX "AuditLog_tripId_idx" ON "public"."AuditLog"("tripId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "public"."AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "public"."AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_idx" ON "public"."AuditLog"("entityType");

-- CreateIndex
CREATE UNIQUE INDEX "CalendarEvent_tripId_key" ON "public"."CalendarEvent"("tripId");

-- CreateIndex
CREATE INDEX "CalendarEvent_startDateTime_idx" ON "public"."CalendarEvent"("startDateTime");

-- CreateIndex
CREATE INDEX "CalendarEvent_endDateTime_idx" ON "public"."CalendarEvent"("endDateTime");

-- CreateIndex
CREATE INDEX "CalendarEvent_eventType_idx" ON "public"."CalendarEvent"("eventType");

-- CreateIndex
CREATE INDEX "Report_reportType_idx" ON "public"."Report"("reportType");

-- CreateIndex
CREATE INDEX "Report_generatedAt_idx" ON "public"."Report"("generatedAt");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "public"."Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "public"."Notification"("isRead");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "public"."Notification"("createdAt");

-- CreateIndex
CREATE INDEX "Location_city_idx" ON "public"."Location"("city");

-- CreateIndex
CREATE INDEX "Location_country_idx" ON "public"."Location"("country");

-- CreateIndex
CREATE INDEX "Location_isActive_idx" ON "public"."Location"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Location_name_city_country_key" ON "public"."Location"("name", "city", "country");

-- CreateIndex
CREATE INDEX "ExportLog_userId_idx" ON "public"."ExportLog"("userId");

-- CreateIndex
CREATE INDEX "ExportLog_exportType_idx" ON "public"."ExportLog"("exportType");

-- CreateIndex
CREATE INDEX "ExportLog_createdAt_idx" ON "public"."ExportLog"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."Permission" ADD CONSTRAINT "Permission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Driver" ADD CONSTRAINT "Driver_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VehicleAssignment" ADD CONSTRAINT "VehicleAssignment_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "public"."Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VehicleAssignment" ADD CONSTRAINT "VehicleAssignment_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "public"."Driver"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Trip" ADD CONSTRAINT "Trip_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "public"."Agency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Trip" ADD CONSTRAINT "Trip_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "public"."Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Trip" ADD CONSTRAINT "Trip_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "public"."Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Trip" ADD CONSTRAINT "Trip_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "public"."Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TripAssignment" ADD CONSTRAINT "TripAssignment_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "public"."Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TripAssignment" ADD CONSTRAINT "TripAssignment_assignedByUserId_fkey" FOREIGN KEY ("assignedByUserId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TripImage" ADD CONSTRAINT "TripImage_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "public"."Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MaintenanceRecord" ADD CONSTRAINT "MaintenanceRecord_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "public"."Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuditLog" ADD CONSTRAINT "AuditLog_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuditLog" ADD CONSTRAINT "AuditLog_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "public"."Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuditLog" ADD CONSTRAINT "AuditLog_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "public"."Trip"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CalendarEvent" ADD CONSTRAINT "CalendarEvent_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "public"."Trip"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExportLog" ADD CONSTRAINT "ExportLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
