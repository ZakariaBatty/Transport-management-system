import { prisma } from "@/lib/db/client";
import { userRepository } from "../repositories/user.repository";

import { UserRole, UserStatus } from "@prisma/client";

export const userService = {
  async getAllUsers() {
    return userRepository.getAll();
  },

  async getUserById(id: string) {
    return userRepository.getById(id);
  },

  async getUserByEmail(email: string) {
    return userRepository.getByEmail(email);
  },

  async createUser(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
    status?: UserStatus;
    department?: string;
    avatar?: string;
  }) {
    // Check for duplicate email
    const existingUser = await userRepository.getByEmail(data.email);
    if (existingUser) {
      throw new Error("Email already exists");
    }

    // Check for duplicate phone
    const phoneExists = await prisma.user.findFirst({
      where: { phone: data.phone },
    });
    if (phoneExists) {
      throw new Error("Phone number already exists");
    }

    // Create user
    const user = await userRepository.create(data);

    // If role is DRIVER, create Driver record
    if (data.role === "DRIVER") {
      // Set default license expiry to 1 year from now
      const licenseExpiry = new Date();
      licenseExpiry.setFullYear(licenseExpiry.getFullYear() + 1);

      await prisma.driver.create({
        data: {
          userId: user.id,
          licenseNumber: `DL-${user.id.substring(0, 8).toUpperCase()}`,
          licenseExpiry,
          status: "AVAILABLE",
        },
      });
    }

    return userRepository.getById(user.id);
  },

  async updateUser(
    id: string,
    data: {
      name?: string;
      email?: string;
      phone?: string;
      role?: UserRole;
      status?: UserStatus;
      department?: string;
      avatar?: string;
    },
  ) {
    const user = await userRepository.getById(id);
    if (!user) {
      throw new Error("User not found");
    }

    // Check email uniqueness if being changed
    if (data.email && data.email !== user.email) {
      const emailExists = await userRepository.getByEmail(data.email);
      if (emailExists) {
        throw new Error("Email already exists");
      }
    }

    // Check phone uniqueness if being changed
    if (data.phone && data.phone !== user.phone) {
      const phoneExists = await prisma.user.findFirst({
        where: { phone: data.phone },
      });
      if (phoneExists) {
        throw new Error("Phone number already exists");
      }
    }

    // Handle role changes
    if (data.role && data.role !== user.role) {
      if (data.role === "DRIVER") {
        // Create Driver record if not exists
        const driverExists = await prisma.driver.findUnique({
          where: { userId: id },
        });
        if (!driverExists) {
          const licenseExpiry = new Date();
          licenseExpiry.setFullYear(licenseExpiry.getFullYear() + 1);

          await prisma.driver.create({
            data: {
              userId: id,
              licenseNumber: `DL-${id.substring(0, 8).toUpperCase()}`,
              licenseExpiry,
              status: "AVAILABLE",
            },
          });
        }
      } else {
        // Remove Driver record if role is changed from DRIVER
        if (user.role === "DRIVER") {
          await prisma.driver.deleteMany({ where: { userId: id } });
        }
      }
    }

    return userRepository.update(id, data);
  },

  async deleteUser(id: string) {
    // Delete associated Driver record if exists
    await prisma.driver.deleteMany({ where: { userId: id } });

    // Delete user (cascades delete other relations)
    return userRepository.delete(id);
  },

  async getUsersByRole(role: UserRole) {
    return userRepository.getByRole(role);
  },

  async getStatistics() {
    const [totalUsers, activeUsers, driverCount, adminCount] =
      await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { status: "ACTIVE" } }),
        prisma.user.count({ where: { role: "DRIVER" } }),
        prisma.user.count({
          where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } },
        }),
      ]);

    return { totalUsers, activeUsers, driverCount, adminCount };
  },
};
