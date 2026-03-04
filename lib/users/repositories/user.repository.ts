import { prisma } from "@/lib/db/client";
import { UserRole, UserStatus } from "@prisma/client";

export const userRepository = {
  async getAll() {
    return prisma.user.findMany({
      include: { driver: true, permissions: true },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { driver: true, permissions: true },
    });
  },

  async getByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: { driver: true, permissions: true },
    });
  },

  async create(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
    status?: UserStatus;
    department?: string;
    avatar?: string;
  }) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: data.role,
        status: data.status || "ACTIVE",
        department: data.department,
        avatar: data.avatar,
      },
      include: { driver: true, permissions: true },
    });
  },

  async update(
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
    return prisma.user.update({
      where: { id },
      data,
      include: { driver: true, permissions: true },
    });
  },

  async delete(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  },

  async getByRole(role: UserRole) {
    return prisma.user.findMany({
      where: { role },
      include: { driver: true, permissions: true },
      orderBy: { createdAt: "desc" },
    });
  },

  async countByStatus(status: UserStatus) {
    return prisma.user.count({ where: { status } });
  },

  async countByRole(role: UserRole) {
    return prisma.user.count({ where: { role } });
  },
};
