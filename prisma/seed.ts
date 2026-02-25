import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ─── Helpers ────────────────────────────────────────────────────────────────

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Users ──────────────────────────────────────────────────────────────────

async function createUsers() {
  console.log("Creating users...");

  const hashedPassword = await bcrypt.hash("password123", 12);

  const users = [];

  // Super Admin
  users.push(
    await prisma.user.create({
      data: {
        email: "superadmin@fleet.com",
        password: hashedPassword,
        name: "Super Admin",
        phone: "+971500000001",
        role: "SUPER_ADMIN",
        status: "ACTIVE",
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
    }),
  );

  // Admin
  users.push(
    await prisma.user.create({
      data: {
        email: "admin@fleet.com",
        password: hashedPassword,
        name: "Fleet Admin",
        phone: "+971500000002",
        role: "ADMIN",
        status: "ACTIVE",
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
    }),
  );

  // 3 Managers
  for (let i = 0; i < 3; i++) {
    users.push(
      await prisma.user.create({
        data: {
          email: `manager${i + 1}@fleet.com`,
          password: hashedPassword,
          name: faker.person.fullName(),
          phone: `+97150000${String(10 + i).padStart(4, "0")}`,
          role: "MANAGER",
          status: "ACTIVE",
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
    );
  }

  console.log(`✅ Created ${users.length} non-driver users`);
  return users;
}

// ─── Driver Users ────────────────────────────────────────────────────────────

async function createDriverUsers() {
  console.log("Creating driver users...");

  const hashedPassword = await bcrypt.hash("password123", 12);
  const driverStatuses = ["AVAILABLE", "ON_TRIP", "OFF_DUTY"] as const;
  const driverUsers = [];

  for (let i = 0; i < 10; i++) {
    driverUsers.push(
      await prisma.user.create({
        data: {
          email: `driver${i + 1}@fleet.com`,
          password: hashedPassword,
          name: faker.person.fullName(),
          phone: `+97155${String(1000000 + i).slice(1)}`,
          role: "DRIVER",
          status: "ACTIVE",
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
    );
  }

  console.log(`✅ Created ${driverUsers.length} driver users`);
  return driverUsers;
}

// ─── Vehicles ────────────────────────────────────────────────────────────────

async function createVehicles() {
  console.log("Creating vehicles...");

  const vehicleModels = [
    "Toyota Coaster",
    "Mercedes Sprinter",
    "Ford Transit",
    "Nissan Urvan",
    "Hyundai H350",
  ];
  const vehicleStatuses = ["AVAILABLE", "IN_USE", "MAINTENANCE"] as const;
  const vehicles = [];

  for (let i = 0; i < 10; i++) {
    vehicles.push(
      await prisma.vehicle.create({
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
          owner: faker.helpers.arrayElement(["Company", "Leased", "Partner"]),
          lastMaintenance: faker.date.past({ years: 1 }),
          nextMaintenanceDate: faker.date.future({ years: 1 }),
        },
      }),
    );
  }

  console.log(`✅ Created ${vehicles.length} vehicles`);
  return vehicles;
}

// ─── Agencies ────────────────────────────────────────────────────────────────

async function createAgencies() {
  console.log("Creating agencies...");

  const agencyNames = [
    "Emirates Travel",
    "Dubai Tours",
    "Gulf Hospitality",
    "Desert Adventures",
    "Oasis Transport",
  ];

  const agencies = [];

  for (let i = 0; i < 5; i++) {
    agencies.push(
      await prisma.agency.create({
        data: {
          name: `${agencyNames[i]} ${faker.string.alphanumeric(4).toUpperCase()}`,
          contactPerson: faker.person.fullName(),
          phone: `+9714${faker.number.int({ min: 1000000, max: 9999999 })}`,
          email: faker.internet.email(),
          address: faker.location.streetAddress(),
          city: faker.helpers.arrayElement([
            "Dubai",
            "Abu Dhabi",
            "Sharjah",
            "Ajman",
          ]),
          totalTrips: faker.number.int({ min: 10, max: 500 }),
          totalPassengers: faker.number.int({ min: 50, max: 5000 }),
          totalRevenue: parseFloat(
            faker.number
              .float({ min: 5000, max: 500000, fractionDigits: 2 })
              .toFixed(2),
          ),
        },
      }),
    );
  }

  console.log(`✅ Created ${agencies.length} agencies`);
  return agencies;
}

// ─── Hotels ──────────────────────────────────────────────────────────────────

async function createHotels() {
  console.log("Creating hotels...");

  const hotelNames = [
    "Burj Al Arab",
    "Atlantis The Palm",
    "Jumeirah Beach Hotel",
    "Address Downtown",
    "Sofitel Dubai",
  ];

  const hotels = [];

  for (let i = 0; i < 5; i++) {
    hotels.push(
      await prisma.hotel.create({
        data: {
          name: `${hotelNames[i]} ${faker.string.alphanumeric(4).toUpperCase()}`,
          address: faker.location.streetAddress(),
          city: faker.helpers.arrayElement(["Dubai", "Abu Dhabi", "Sharjah"]),
          phone: `+9714${faker.number.int({ min: 1000000, max: 9999999 })}`,
          email: faker.internet.email(),
          totalTrips: faker.number.int({ min: 5, max: 300 }),
          totalPassengers: faker.number.int({ min: 20, max: 3000 }),
        },
      }),
    );
  }

  console.log(`✅ Created ${hotels.length} hotels`);
  return hotels;
}

// ─── Vehicle Assignments ─────────────────────────────────────────────────────

async function createVehicleAssignments(drivers: any[], vehicles: any[]) {
  console.log("Creating vehicle assignments...");

  let count = 0;
  for (let i = 0; i < Math.min(drivers.length, vehicles.length); i++) {
    const driver = await prisma.driver.findUnique({
      where: { userId: drivers[i].id },
    });
    if (!driver) continue;

    await prisma.vehicleAssignment.create({
      data: {
        vehicleId: vehicles[i].id,
        driverId: driver.id,
        assignedAt: faker.date.past({ years: 1 }),
        isActive: true,
      },
    });
    count++;
  }

  console.log(`✅ Created ${count} vehicle assignments`);
}

// ─── Trips ───────────────────────────────────────────────────────────────────

async function createTrips(
  drivers: any[],
  vehicles: any[],
  agencies: any[],
  hotels: any[],
  managers: any[],
) {
  console.log("Creating trips...");

  const uaeLocations = [
    "Dubai International Airport",
    "Abu Dhabi Airport",
    "Palm Jumeirah",
    "Dubai Mall",
    "Burj Khalifa",
    "Marina Walk",
    "Gold Souk",
    "Dubai Frame",
    "Deira City Centre",
    "Ibn Battuta Mall",
  ];

  const tripStatuses = [
    "SCHEDULED",
    "ASSIGNED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
  ] as const;

  const trips = [];

  for (let i = 0; i < 50; i++) {
    const driver = await prisma.driver.findUnique({
      where: { userId: drivers[i % drivers.length].id },
    });
    if (!driver) continue;

    const kmStart = faker.number.int({ min: 1000, max: 100000 });
    const kmEnd = kmStart + faker.number.int({ min: 10, max: 300 });
    const status = tripStatuses[i % tripStatuses.length];

    const trip = await prisma.trip.create({
      data: {
        tripDate: faker.date.between({ from: "2024-01-01", to: "2025-12-31" }),
        departureTime: `${String(faker.number.int({ min: 6, max: 22 })).padStart(2, "0")}:${faker.helpers.arrayElement(["00", "15", "30", "45"])}`,
        estimatedArrivalTime: `${String(faker.number.int({ min: 6, max: 23 })).padStart(2, "0")}:${faker.helpers.arrayElement(["00", "15", "30", "45"])}`,
        actualArrivalTime:
          status === "COMPLETED"
            ? `${String(faker.number.int({ min: 6, max: 23 })).padStart(2, "0")}:${faker.helpers.arrayElement(["00", "15", "30", "45"])}`
            : null,
        pickupLocation: randomElement(uaeLocations),
        dropoffLocation: randomElement(uaeLocations),
        destination: faker.location.city(),
        type: faker.helpers.arrayElement(["OUT", "IN"]) as "OUT" | "IN",
        status: status,
        passengersCount: faker.number.int({ min: 1, max: 30 }),
        notes: faker.datatype.boolean() ? faker.lorem.sentence() : null,
        kmStart: kmStart,
        kmEnd: status === "COMPLETED" ? kmEnd : null,
        distanceTravelled: status === "COMPLETED" ? kmEnd - kmStart : null,
        tripPrice: parseFloat(
          faker.number
            .float({ min: 50, max: 2000, fractionDigits: 2 })
            .toFixed(2),
        ),
        actualCost:
          status === "COMPLETED"
            ? parseFloat(
                faker.number
                  .float({ min: 30, max: 1500, fractionDigits: 2 })
                  .toFixed(2),
              )
            : null,
        agencyId: agencies[i % agencies.length].id,
        hotelId: hotels[i % hotels.length].id,
        vehicleId: vehicles[i % vehicles.length].id,
        driverId: driver.id,
      },
    });

    // Trip Assignment
    if (status !== "SCHEDULED") {
      await prisma.tripAssignment.create({
        data: {
          tripId: trip.id,
          assignedByUserId: managers[i % managers.length].id,
          assignedAt: faker.date.past({ years: 1 }),
          notes: faker.datatype.boolean() ? faker.lorem.sentence() : null,
        },
      });
    }

    // Trip Images for completed trips
    if (status === "COMPLETED") {
      const imageTypes = ["BEFORE", "AFTER"] as const;
      for (const imgType of imageTypes) {
        await prisma.tripImage.create({
          data: {
            tripId: trip.id,
            imageUrl: faker.image.url(),
            imageType: imgType,
            caption: faker.lorem.words(3),
            fileSize: faker.number.int({ min: 100000, max: 5000000 }),
          },
        });
      }
    }

    trips.push(trip);

    if ((i + 1) % 10 === 0) {
      console.log(`  Created ${i + 1}/50 trips...`);
    }
  }

  console.log(`✅ Created ${trips.length} trips`);
  return trips;
}

// ─── Maintenance Records ─────────────────────────────────────────────────────

async function createMaintenanceRecords(vehicles: any[]) {
  console.log("Creating maintenance records...");

  const maintenanceTypes = [
    "OIL_CHANGE",
    "INSPECTION",
    "REPAIR",
    "SERVICE",
    "TIRE_REPLACEMENT",
    "BRAKE_SERVICE",
  ] as const;

  const maintenanceStatuses = [
    "SCHEDULED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
  ] as const;

  let count = 0;

  for (const vehicle of vehicles) {
    const recordCount = faker.number.int({ min: 1, max: 4 });

    for (let i = 0; i < recordCount; i++) {
      const mType = maintenanceTypes[i % maintenanceTypes.length];
      const mStatus = maintenanceStatuses[i % maintenanceStatuses.length];

      await prisma.maintenanceRecord.create({
        data: {
          vehicleId: vehicle.id,
          maintenanceType: mType,
          status: mStatus,
          description: `${mType.replace(/_/g, " ")} for vehicle ${vehicle.plate}`,
          notes: faker.datatype.boolean() ? faker.lorem.sentence() : null,
          scheduledDate: faker.date.between({
            from: "2024-01-01",
            to: "2025-12-31",
          }),
          completedDate:
            mStatus === "COMPLETED" ? faker.date.past({ years: 1 }) : null,
          nextDueDate: faker.date.future({ years: 1 }),
          estimatedCost: parseFloat(
            faker.number
              .float({ min: 100, max: 5000, fractionDigits: 2 })
              .toFixed(2),
          ),
          actualCost:
            mStatus === "COMPLETED"
              ? parseFloat(
                  faker.number
                    .float({ min: 80, max: 4500, fractionDigits: 2 })
                    .toFixed(2),
                )
              : null,
          supplier: faker.company.name(),
          invoiceNumber: `INV-${faker.string.alphanumeric(8).toUpperCase()}`,
          performedBy: faker.person.fullName(),
        },
      });
      count++;
    }
  }

  console.log(`✅ Created ${count} maintenance records`);
}

// ─── Calendar Events ─────────────────────────────────────────────────────────

async function createCalendarEvents(trips: any[]) {
  console.log("Creating calendar events...");

  let count = 0;
  for (const trip of trips) {
    // Check no existing calendar event for this trip
    const existing = await prisma.calendarEvent.findUnique({
      where: { tripId: trip.id },
    });
    if (existing) continue;

    const start = new Date(trip.tripDate);
    const end = new Date(start);
    end.setHours(end.getHours() + faker.number.int({ min: 1, max: 8 }));

    await prisma.calendarEvent.create({
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
    count++;
  }

  console.log(`✅ Created ${count} calendar events`);
}

// ─── Notifications ───────────────────────────────────────────────────────────

async function createNotifications(allUsers: any[]) {
  console.log("Creating notifications...");

  const notifTypes = [
    "trip_assigned",
    "maintenance_due",
    "vehicle_available",
    "trip_completed",
    "license_expiry",
  ];

  const notifTitles = [
    "New Trip Assigned",
    "Maintenance Due",
    "Vehicle Available",
    "Trip Completed",
    "License Expiry Warning",
  ];

  let count = 0;
  for (const user of allUsers) {
    const notifCount = faker.number.int({ min: 2, max: 5 });

    for (let i = 0; i < notifCount; i++) {
      const isRead = faker.datatype.boolean();
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: randomElement(notifTitles),
          message: faker.lorem.sentence(),
          notificationType: randomElement(notifTypes),
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
      count++;
    }
  }

  console.log(`✅ Created ${count} notifications`);
}

// ─── Audit Logs ──────────────────────────────────────────────────────────────

async function createAuditLogs(
  allUsers: any[],
  superAdmin: any,
  admin: any,
  drivers: any[],
  trips: any[],
) {
  console.log("Creating audit logs...");

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

  const driverRecords = await prisma.driver.findMany();

  for (let i = 0; i < 50; i++) {
    await prisma.auditLog.create({
      data: {
        userId: allUsers[i % allUsers.length].id,
        createdByUserId: [superAdmin.id, admin.id][i % 2],
        driverId:
          i % 3 === 0 ? driverRecords[i % driverRecords.length]?.id : null,
        tripId: i % 4 === 0 ? trips[i % trips.length]?.id : null,
        action: randomElement(actions),
        entityType: randomElement(entityTypes),
        entityId: faker.string.cuid(),
        changes: JSON.stringify({
          before: faker.lorem.words(3),
          after: faker.lorem.words(3),
        }),
        ipAddress: faker.internet.ip(),
        userAgent: faker.internet.userAgent(),
      },
    });
  }

  console.log("✅ Created 50 audit logs");
}

// ─── Export Logs ─────────────────────────────────────────────────────────────

async function createExportLogs(adminUsers: any[]) {
  console.log("Creating export logs...");

  const exportTypes = [
    "trips",
    "drivers",
    "vehicles",
    "revenue",
    "maintenance",
  ];
  const formats = ["excel", "pdf", "csv"];

  let count = 0;
  for (const user of adminUsers) {
    const exportCount = faker.number.int({ min: 1, max: 3 });

    for (let i = 0; i < exportCount; i++) {
      await prisma.exportLog.create({
        data: {
          userId: user.id,
          exportType: randomElement(exportTypes),
          format: randomElement(formats),
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
      });
      count++;
    }
  }

  console.log(`✅ Created ${count} export logs`);
}

// ─── Reports ─────────────────────────────────────────────────────────────────

async function createReports(superAdminId: string, adminId: string) {
  console.log("Creating reports...");

  const reportTypes = ["daily", "weekly", "monthly", "custom"];

  for (let i = 0; i < 8; i++) {
    const start = faker.date.past({ years: 1 });
    const end = new Date(start);
    end.setDate(end.getDate() + faker.number.int({ min: 7, max: 30 }));

    const rType = reportTypes[i % reportTypes.length];

    await prisma.report.create({
      data: {
        reportType: rType,
        title: `${rType.charAt(0).toUpperCase() + rType.slice(1)} Report - ${faker.date.month()}`,
        description: faker.lorem.sentence(),
        reportStartDate: start,
        reportEndDate: end,
        data: JSON.stringify({
          totalTrips: faker.number.int({ min: 10, max: 500 }),
          totalRevenue: parseFloat(
            faker.number
              .float({ min: 5000, max: 200000, fractionDigits: 2 })
              .toFixed(2),
          ),
          totalKm: faker.number.int({ min: 500, max: 50000 }),
        }),
        generatedBy: [superAdminId, adminId][i % 2],
        generatedAt: faker.date.recent({ days: 30 }),
      },
    });
  }

  console.log("✅ Created 8 reports");
}

// ─── Locations ───────────────────────────────────────────────────────────────

async function createLocations() {
  console.log("Creating locations...");

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

  for (const loc of locationData) {
    await prisma.location.create({
      data: {
        ...loc,
        address: faker.location.streetAddress(),
        isActive: true,
      },
    });
  }

  console.log("✅ Created 5 locations");
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  try {
    console.log("🌱 Starting seed...");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // ─── Clean DB ─────────────────────────────────────────────────────────────
    console.log("\n🗑️  Clearing existing data...");
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
    console.log("✅ Cleared existing data");

    console.log("\n📊 Creating data...");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Create all data
    const allUsers = await createUsers();
    const superAdmin = allUsers[0];
    const admin = allUsers[1];
    const managers = allUsers.slice(2);

    const driverUsers = await createDriverUsers();
    const vehicles = await createVehicles();
    const agencies = await createAgencies();
    const hotels = await createHotels();

    await createVehicleAssignments(driverUsers, vehicles);

    const trips = await createTrips(driverUsers, vehicles, agencies, hotels, [
      ...allUsers,
      ...managers,
    ]);

    await createMaintenanceRecords(vehicles);
    await createCalendarEvents(trips);

    const everyone = [...allUsers, ...driverUsers];
    await createNotifications(everyone);
    await createAuditLogs(everyone, superAdmin, admin, driverUsers, trips);
    await createExportLogs([superAdmin, admin, ...managers]);
    await createReports(superAdmin.id, admin.id);
    await createLocations();

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🎉 Seed complete!\n");
    console.log("📧 Test credentials:");
    console.log("   superadmin@fleet.com / password123");
    console.log("   admin@fleet.com      / password123");
    console.log("   manager1@fleet.com   / password123");
    console.log("   driver1@fleet.com    / password123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
