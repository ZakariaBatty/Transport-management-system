import {
  PrismaClient,
  UserRole,
  UserStatus,
  DriverStatus,
  VehicleStatus,
  TripStatus,
  TripType,
  MaintenanceType,
  MaintenanceStatus,
  TripImageType,
} from "@prisma/client";
import { faker } from "@faker-js/faker";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("🌱 Starting seed...");

    // ─── Clean DB ───────────────────────────────────────────────────────────────
    await prisma.exportLog.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.auditLog.deleteMany();
    await prisma.calendarEvent.deleteMany();
    await prisma.tripImage.deleteMany();
    await prisma.tripAssignment.deleteMany();
    await prisma.trip.deleteMany();
    await prisma.maintenanceRecord.deleteMany();
    await prisma.vehicleAssignment.deleteMany();
    await prisma.driver.deleteMany();
    await prisma.permission.deleteMany();
    await prisma.user.deleteMany();
    await prisma.vehicle.deleteMany();
    await prisma.agency.deleteMany();
    await prisma.hotel.deleteMany();
    await prisma.location.deleteMany();
    await prisma.report.deleteMany();

    console.log("🧹 Cleaned existing data");

    const hashedPassword = await bcrypt.hash("password123", 10);

    // ─── Super Admin ────────────────────────────────────────────────────────────
    const superAdmin = await prisma.user.create({
      data: {
        email: "superadmin@fleet.com",
        password: hashedPassword,
        name: "Super Admin",
        phone: "+971500000001",
        role: UserRole.SUPER_ADMIN,
        status: UserStatus.ACTIVE,
        permissions: {
          create: {
            canAccessDashboard: true,
            canAccessTrips: true,
            canAccessDrivers: true,
            canAccessVehicles: true,
            canAccessMaintenance: true,
            canAccessAgencies: true,
            canAccessHotels: true,
            canAccessReports: true,
            canAccessUsers: true,
            canAccessProfile: true,
            canAccessCalendar: true,
            canManageUsers: true,
            canManageRoles: true,
            canManagePermissions: true,
            canExportData: true,
            canDeleteData: true,
            canViewReports: true,
          },
        },
      },
    });

    // ─── Admin ──────────────────────────────────────────────────────────────────
    const admin = await prisma.user.create({
      data: {
        email: "admin@fleet.com",
        password: hashedPassword,
        name: "Fleet Admin",
        phone: "+971500000002",
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
        permissions: {
          create: {
            canAccessDashboard: true,
            canAccessTrips: true,
            canAccessDrivers: true,
            canAccessVehicles: true,
            canAccessMaintenance: true,
            canAccessAgencies: true,
            canAccessHotels: true,
            canAccessReports: true,
            canAccessUsers: true,
            canAccessProfile: true,
            canAccessCalendar: true,
            canManageUsers: true,
            canManageRoles: false,
            canManagePermissions: false,
            canExportData: true,
            canDeleteData: true,
            canViewReports: true,
          },
        },
      },
    });

    // ─── Managers ───────────────────────────────────────────────────────────────
    const managerUsers = await Promise.all(
      Array.from({ length: 3 }).map((_, i) =>
        prisma.user.create({
          data: {
            email: `manager${i + 1}@fleet.com`,
            password: hashedPassword,
            name: faker.person.fullName(),
            phone: `+97150000${String(10 + i).padStart(4, "0")}`,
            role: UserRole.MANAGER,
            status: UserStatus.ACTIVE,
            department: faker.commerce.department(),
            permissions: {
              create: {
                canAccessDashboard: true,
                canAccessTrips: true,
                canAccessDrivers: true,
                canAccessVehicles: true,
                canAccessMaintenance: true,
                canAccessAgencies: true,
                canAccessHotels: true,
                canAccessReports: true,
                canAccessUsers: false,
                canAccessProfile: true,
                canAccessCalendar: true,
                canManageUsers: false,
                canManageRoles: false,
                canManagePermissions: false,
                canExportData: true,
                canDeleteData: false,
                canViewReports: true,
              },
            },
          },
        }),
      ),
    );

    // ─── Drivers (Users) ────────────────────────────────────────────────────────
    const driverStatuses = [
      DriverStatus.AVAILABLE,
      DriverStatus.ON_TRIP,
      DriverStatus.OFF_DUTY,
    ];

    const driverUsers = await Promise.all(
      Array.from({ length: 10 }).map((_, i) =>
        prisma.user.create({
          data: {
            email: `driver${i + 1}@fleet.com`,
            password: hashedPassword,
            name: faker.person.fullName(),
            phone: `+97155${String(1000000 + i).slice(1)}`,
            role: UserRole.DRIVER,
            status: UserStatus.ACTIVE,
            avatar: faker.image.avatar(),
            permissions: {
              create: {
                canAccessDashboard: false,
                canAccessTrips: true,
                canAccessDrivers: false,
                canAccessVehicles: false,
                canAccessMaintenance: false,
                canAccessAgencies: false,
                canAccessHotels: false,
                canAccessReports: false,
                canAccessUsers: false,
                canAccessProfile: true,
                canAccessCalendar: true,
              },
            },
            driver: {
              create: {
                status: driverStatuses[i % 3],
                rating: parseFloat(
                  faker.number
                    .float({ min: 3, max: 5, fractionDigits: 1 })
                    .toFixed(1),
                ),
                licenseNumber: `UAE-DL-${faker.string.alphanumeric(8).toUpperCase()}`,
                licenseExpiry: faker.date.future({ years: 3 }),
                totalTrips: faker.number.int({ min: 10, max: 300 }),
                totalKm: faker.number.int({ min: 500, max: 50000 }),
                averageRating: parseFloat(
                  faker.number
                    .float({ min: 3.5, max: 5, fractionDigits: 2 })
                    .toFixed(2),
                ),
              },
            },
          },
        }),
      ),
    );

    // ─── Fetch driver records ────────────────────────────────────────────────────
    const drivers = await prisma.driver.findMany();
    console.log(`✅ Created ${drivers.length} drivers`);

    // ─── Vehicles ───────────────────────────────────────────────────────────────
    const vehicleModels = [
      "Toyota Coaster",
      "Mercedes Sprinter",
      "Ford Transit",
      "Nissan Urvan",
      "Hyundai H350",
    ];
    const vehicleStatuses = [
      VehicleStatus.AVAILABLE,
      VehicleStatus.IN_USE,
      VehicleStatus.MAINTENANCE,
    ];

    const vehicles = await Promise.all(
      Array.from({ length: 10 }).map((_, i) =>
        prisma.vehicle.create({
          data: {
            model: vehicleModels[i % vehicleModels.length],
            plate: `DXB-${faker.string.alphanumeric(2).toUpperCase()}-${faker.number.int({ min: 1000, max: 9999 })}`,
            vin: faker.vehicle.vin(),
            registrationExpiry: faker.date.future({ years: 2 }),
            capacity: faker.helpers.arrayElement([8, 12, 15, 20, 30]),
            kmUsage: faker.number.int({ min: 5000, max: 150000 }),
            status: vehicleStatuses[i % 3],
            monthlyRent: parseFloat(
              faker.number
                .float({ min: 2000, max: 8000, fractionDigits: 2 })
                .toFixed(2),
            ),
            salik: parseFloat(
              faker.number
                .float({ min: 0, max: 500, fractionDigits: 2 })
                .toFixed(2),
            ),
            owner: faker.helpers.arrayElement([
              "Company",
              "Leased",
              faker.person.fullName(),
            ]),
            lastMaintenance: faker.date.past({ years: 1 }),
            nextMaintenanceDate: faker.date.future({ years: 1 }),
          },
        }),
      ),
    );

    console.log(`✅ Created ${vehicles.length} vehicles`);

    // ─── Vehicle Assignments ─────────────────────────────────────────────────────
    await Promise.all(
      drivers.slice(0, 8).map((driver, i) =>
        prisma.vehicleAssignment.create({
          data: {
            vehicleId: vehicles[i % vehicles.length].id,
            driverId: driver.id,
            assignedAt: faker.date.past({ years: 1 }),
            isActive: true,
          },
        }),
      ),
    );

    // ─── Agencies ───────────────────────────────────────────────────────────────
    const agencies = await Promise.all(
      Array.from({ length: 6 }).map(() =>
        prisma.agency.create({
          data: {
            name: `${faker.company.name()} Travel`,
            contactPerson: faker.person.fullName(),
            phone: `+97142${faker.number.int({ min: 100000, max: 999999 })}`,
            email: faker.internet.email(),
            address: faker.location.streetAddress(),
            city: faker.helpers.arrayElement([
              "Dubai",
              "Abu Dhabi",
              "Sharjah",
              "Ajman",
            ]),
            totalTrips: faker.number.int({ min: 5, max: 200 }),
            totalPassengers: faker.number.int({ min: 50, max: 5000 }),
            totalRevenue: parseFloat(
              faker.number
                .float({ min: 10000, max: 500000, fractionDigits: 2 })
                .toFixed(2),
            ),
          },
        }),
      ),
    );

    console.log(`✅ Created ${agencies.length} agencies`);

    // ─── Hotels ─────────────────────────────────────────────────────────────────
    const hotelNames = [
      "Burj Al Arab",
      "Atlantis The Palm",
      "Jumeirah Beach Hotel",
      "Marriott Downtown",
      "Hilton Dubai Creek",
      "Four Seasons DIFC",
    ];

    const hotels = await Promise.all(
      hotelNames.map((name, i) =>
        prisma.hotel.create({
          data: {
            name,
            address: faker.location.streetAddress(),
            city: faker.helpers.arrayElement(["Dubai", "Abu Dhabi", "Sharjah"]),
            phone: `+97144${String(100000 + i).slice(1)}`,
            email: faker.internet.email(),
            totalTrips: faker.number.int({ min: 10, max: 300 }),
            totalPassengers: faker.number.int({ min: 100, max: 10000 }),
          },
        }),
      ),
    );

    console.log(`✅ Created ${hotels.length} hotels`);

    // ─── Trips ──────────────────────────────────────────────────────────────────
    const tripStatuses = [
      TripStatus.SCHEDULED,
      TripStatus.ASSIGNED,
      TripStatus.IN_PROGRESS,
      TripStatus.COMPLETED,
      TripStatus.CANCELLED,
    ];
    const tripTypes = [TripType.OUT, TripType.IN];
    const locations = [
      "Dubai International Airport",
      "Abu Dhabi Airport",
      "Palm Jumeirah",
      "Dubai Mall",
      "Downtown Dubai",
      "JBR Beach",
      "Marina Walk",
    ];

    const trips = await Promise.all(
      Array.from({ length: 30 }).map((_, i) => {
        const status = tripStatuses[i % tripStatuses.length];
        const kmStart = faker.number.int({ min: 1000, max: 100000 });
        const kmEnd =
          status === TripStatus.COMPLETED
            ? kmStart + faker.number.int({ min: 10, max: 300 })
            : null;

        return prisma.trip.create({
          data: {
            tripDate: faker.date.between({
              from: new Date("2024-01-01"),
              to: new Date("2025-06-30"),
            }),
            departureTime: `${String(faker.number.int({ min: 5, max: 22 })).padStart(2, "0")}:${faker.helpers.arrayElement(["00", "15", "30", "45"])}`,
            estimatedArrivalTime: `${String(faker.number.int({ min: 6, max: 23 })).padStart(2, "0")}:${faker.helpers.arrayElement(["00", "15", "30", "45"])}`,
            actualArrivalTime:
              status === TripStatus.COMPLETED
                ? `${String(faker.number.int({ min: 6, max: 23 })).padStart(2, "0")}:30`
                : null,
            pickupLocation: faker.helpers.arrayElement(locations),
            dropoffLocation: faker.helpers.arrayElement(locations),
            destination: faker.helpers.arrayElement(locations),
            type: tripTypes[i % 2],
            status,
            passengersCount: faker.number.int({ min: 1, max: 20 }),
            notes: faker.helpers.maybe(() => faker.lorem.sentence(), {
              probability: 0.5,
            }),
            kmStart,
            kmEnd,
            distanceTravelled: kmEnd ? kmEnd - kmStart : null,
            tripPrice: parseFloat(
              faker.number
                .float({ min: 50, max: 1000, fractionDigits: 2 })
                .toFixed(2),
            ),
            actualCost:
              status === TripStatus.COMPLETED
                ? parseFloat(
                    faker.number
                      .float({ min: 40, max: 900, fractionDigits: 2 })
                      .toFixed(2),
                  )
                : null,
            agencyId: agencies[i % agencies.length].id,
            hotelId: hotels[i % hotels.length].id,
            vehicleId: vehicles[i % vehicles.length].id,
            driverId: drivers[i % drivers.length].id,
          },
        });
      }),
    );

    console.log(`✅ Created ${trips.length} trips`);

    // ─── Trip Assignments ────────────────────────────────────────────────────────
    await Promise.all(
      trips.slice(0, 20).map((trip) =>
        prisma.tripAssignment.create({
          data: {
            tripId: trip.id,
            assignedByUserId:
              managerUsers[
                faker.number.int({ min: 0, max: managerUsers.length - 1 })
              ].id,
            assignedAt: faker.date.recent({ days: 30 }),
            notes: faker.helpers.maybe(() => faker.lorem.sentence(), {
              probability: 0.3,
            }),
          },
        }),
      ),
    );

    // ─── Trip Images ─────────────────────────────────────────────────────────────
    const imageTypes = [
      TripImageType.BEFORE,
      TripImageType.AFTER,
      TripImageType.DURING,
      TripImageType.DOCUMENTATION,
    ];

    await Promise.all(
      trips.slice(0, 15).flatMap((trip) =>
        Array.from({ length: faker.number.int({ min: 1, max: 3 }) }).map(() =>
          prisma.tripImage.create({
            data: {
              tripId: trip.id,
              imageUrl: faker.image.url(),
              imageType: faker.helpers.arrayElement(imageTypes),
              caption: faker.helpers.maybe(() => faker.lorem.words(5), {
                probability: 0.5,
              }),
              fileSize: faker.number.int({ min: 100000, max: 5000000 }),
            },
          }),
        ),
      ),
    );

    // ─── Maintenance Records ─────────────────────────────────────────────────────
    const maintenanceTypes = Object.values(MaintenanceType);
    const maintenanceStatuses = Object.values(MaintenanceStatus);

    await Promise.all(
      vehicles.flatMap((vehicle, vi) =>
        Array.from({ length: faker.number.int({ min: 1, max: 3 }) }).map(
          (_, mi) =>
            prisma.maintenanceRecord.create({
              data: {
                vehicleId: vehicle.id,
                maintenanceType:
                  maintenanceTypes[(vi + mi) % maintenanceTypes.length],
                status: maintenanceStatuses[mi % maintenanceStatuses.length],
                description: faker.lorem.sentence(),
                notes: faker.helpers.maybe(() => faker.lorem.sentence(), {
                  probability: 0.4,
                }),
                scheduledDate: faker.date.between({
                  from: new Date("2024-01-01"),
                  to: new Date("2025-12-31"),
                }),
                completedDate: faker.helpers.maybe(
                  () => faker.date.past({ years: 1 }),
                  { probability: 0.5 },
                ),
                nextDueDate: faker.date.future({ years: 1 }),
                estimatedCost: parseFloat(
                  faker.number
                    .float({ min: 200, max: 5000, fractionDigits: 2 })
                    .toFixed(2),
                ),
                actualCost: faker.helpers.maybe(
                  () =>
                    parseFloat(
                      faker.number
                        .float({ min: 150, max: 4500, fractionDigits: 2 })
                        .toFixed(2),
                    ),
                  { probability: 0.5 },
                ),
                supplier: faker.company.name(),
                invoiceNumber: `INV-${faker.string.alphanumeric(8).toUpperCase()}`,
                performedBy: faker.person.fullName(),
              },
            }),
        ),
      ),
    );

    console.log("✅ Created maintenance records");

    // ─── Calendar Events ─────────────────────────────────────────────────────────
    await Promise.all(
      trips.slice(0, 20).map((trip) => {
        const start = new Date(trip.tripDate);
        const end = new Date(start);
        end.setHours(end.getHours() + faker.number.int({ min: 1, max: 8 }));
        return prisma.calendarEvent.create({
          data: {
            title: `Trip - ${trip.pickupLocation} → ${trip.dropoffLocation}`,
            description: faker.lorem.sentence(),
            eventType: "trip",
            startDateTime: start,
            endDateTime: end,
            tripId: trip.id,
            reminderMinutes: faker.helpers.arrayElement([15, 30, 60, 120]),
          },
        });
      }),
    );

    // ─── Notifications ───────────────────────────────────────────────────────────
    const allUsers = [superAdmin, admin, ...managerUsers, ...driverUsers];
    const notifTypes = [
      "trip_assigned",
      "maintenance_due",
      "vehicle_available",
      "trip_completed",
      "license_expiry",
    ];

    await Promise.all(
      allUsers.flatMap((user) =>
        Array.from({ length: faker.number.int({ min: 2, max: 5 }) }).map(() => {
          const isRead = faker.datatype.boolean();
          return prisma.notification.create({
            data: {
              userId: user.id,
              title: faker.helpers.arrayElement([
                "New Trip Assigned",
                "Maintenance Due",
                "Vehicle Available",
                "Trip Completed",
                "License Expiry Warning",
              ]),
              message: faker.lorem.sentence(),
              notificationType: faker.helpers.arrayElement(notifTypes),
              isRead,
              readAt: isRead ? faker.date.recent({ days: 7 }) : null,
              relatedEntityType: faker.helpers.arrayElement([
                "Trip",
                "Vehicle",
                "Driver",
                null,
              ]),
              relatedEntityId: faker.string.cuid(),
            },
          });
        }),
      ),
    );

    console.log("✅ Created notifications");

    // ─── Audit Logs ──────────────────────────────────────────────────────────────
    const actions = [
      "CREATE",
      "UPDATE",
      "DELETE",
      "VIEW",
      "EXPORT",
      "LOGIN",
      "LOGOUT",
    ];
    const entityTypes = [
      "User",
      "Driver",
      "Trip",
      "Vehicle",
      "MaintenanceRecord",
      "Agency",
    ];

    await Promise.all(
      Array.from({ length: 50 }).map((_, i) =>
        prisma.auditLog.create({
          data: {
            userId: allUsers[i % allUsers.length].id,
            createdByUserId: [superAdmin.id, admin.id][i % 2],
            driverId: i % 3 === 0 ? drivers[i % drivers.length].id : null,
            tripId: i % 4 === 0 ? trips[i % trips.length].id : null,
            action: faker.helpers.arrayElement(actions),
            entityType: faker.helpers.arrayElement(entityTypes),
            entityId: faker.string.cuid(),
            changes: JSON.stringify({
              before: faker.lorem.words(3),
              after: faker.lorem.words(3),
            }),
            ipAddress: faker.internet.ip(),
            userAgent: faker.internet.userAgent(),
          },
        }),
      ),
    );

    console.log("✅ Created audit logs");

    // ─── Export Logs ─────────────────────────────────────────────────────────────
    const exportTypes = [
      "trips",
      "drivers",
      "vehicles",
      "revenue",
      "maintenance",
    ];
    const formats = ["excel", "pdf", "csv"];

    await Promise.all(
      [superAdmin, admin, ...managerUsers].flatMap((user) =>
        Array.from({ length: faker.number.int({ min: 1, max: 3 }) }).map(() =>
          prisma.exportLog.create({
            data: {
              userId: user.id,
              exportType: faker.helpers.arrayElement(exportTypes),
              format: faker.helpers.arrayElement(formats),
              fileName: `export_${faker.string.alphanumeric(8)}.xlsx`,
              fileUrl: faker.internet.url(),
              filtersCriteria: JSON.stringify({
                startDate: "2024-01-01",
                endDate: "2024-12-31",
              }),
              recordsExported: faker.number.int({ min: 10, max: 1000 }),
              fileSize: faker.number.int({ min: 10000, max: 5000000 }),
              expiresAt: faker.date.future({ years: 1 }),
            },
          }),
        ),
      ),
    );

    // ─── Reports ─────────────────────────────────────────────────────────────────
    const reportTypes = ["daily", "weekly", "monthly", "custom"];
    await Promise.all(
      Array.from({ length: 8 }).map((_, i) => {
        const start = faker.date.past({ years: 1 });
        const end = new Date(start);
        end.setDate(end.getDate() + faker.number.int({ min: 7, max: 30 }));
        return prisma.report.create({
          data: {
            reportType: reportTypes[i % reportTypes.length],
            title: `${reportTypes[i % reportTypes.length].charAt(0).toUpperCase() + reportTypes[i % reportTypes.length].slice(1)} Report - ${faker.date.month()}`,
            description: faker.lorem.sentence(),
            reportStartDate: start,
            reportEndDate: end,
            data: JSON.stringify({
              totalTrips: faker.number.int({ min: 10, max: 500 }),
              totalRevenue: faker.number.float({
                min: 5000,
                max: 200000,
                fractionDigits: 2,
              }),
              totalKm: faker.number.int({ min: 500, max: 50000 }),
            }),
            generatedBy: [superAdmin.id, admin.id][i % 2],
            generatedAt: faker.date.recent({ days: 30 }),
          },
        });
      }),
    );

    // ─── Locations ───────────────────────────────────────────────────────────────
    const locationData = [
      {
        name: "Dubai International Airport",
        city: "Dubai",
        country: "UAE",
        latitude: 25.2532,
        longitude: 55.3657,
      },
      {
        name: "Abu Dhabi International Airport",
        city: "Abu Dhabi",
        country: "UAE",
        latitude: 24.433,
        longitude: 54.6511,
      },
      {
        name: "Palm Jumeirah",
        city: "Dubai",
        country: "UAE",
        latitude: 25.1124,
        longitude: 55.139,
      },
      {
        name: "Dubai Mall",
        city: "Dubai",
        country: "UAE",
        latitude: 25.1985,
        longitude: 55.2796,
      },
      {
        name: "Burj Khalifa",
        city: "Dubai",
        country: "UAE",
        latitude: 25.1972,
        longitude: 55.2744,
      },
    ];

    await Promise.all(
      locationData.map((loc) =>
        prisma.location.create({
          data: {
            ...loc,
            address: faker.location.streetAddress(),
            isActive: true,
          },
        }),
      ),
    );

    console.log("✅ Created locations, reports, export logs");
    console.log("\n🎉 Seed complete!\n");
    console.log("📧 Test credentials:");
    console.log("   superadmin@fleet.com / password123");
    console.log("   admin@fleet.com      / password123");
    console.log("   manager1@fleet.com   / password123");
    console.log("   driver1@fleet.com    / password123");
  } catch (error) {
    console.error("❌ An error occurred during seeding:", error);
    throw error; // ← add this line
  }
}

main()
  .catch((e: any) => {
    console.error("❌ Seed failed:");
    console.error("Message:", e?.message ?? String(e));
    console.error("Code:", e?.code);
    console.error("Meta:", JSON.stringify(e?.meta, null, 2));
    console.error("Stack:", e?.stack);
    try {
      console.error(
        "Full:",
        JSON.stringify(e, Object.getOwnPropertyNames(e), 2),
      );
    } catch {
      console.error("Full (non-serializable):", e);
    }
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
