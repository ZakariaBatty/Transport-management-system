import { db } from "@/lib/db/client";
import { User, UserRole, UserStatus } from "@prisma/client";

/**
 * User Repository
 * Handles all database operations for users
 * Follows the Single Responsibility Principle - only database access
 */

export class UserRepository {
  /**
   * Create a new user in the database
   */
  async createUser(data: {
    email: string;
    password: string;
    name: string;
    phone: string;
    role: UserRole;
  }): Promise<User> {
    return db.user.create({
      data: {
        email: data.email.toLowerCase(),
        password: data.password,
        name: data.name,
        phone: data.phone,
        role: data.role,
        status: UserStatus.ACTIVE,
      },
    });
  }

  /**
   * Find a user by email address
   */
  async findUserByEmail(email: string): Promise<User | null> {
    return db.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  /**
   * Find a user by ID
   */
  async findUserById(id: string): Promise<User | null> {
    return db.user.findUnique({
      where: { id },
    });
  }

  /**
   * Find a user by email with all relations
   */
  async findUserByEmailWithRelations(email: string): Promise<
    | (User & {
        driver?: any;
        createdAuditLogs?: any[];
      })
    | null
  > {
    return db.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        driver: true,
        createdAuditLogs: {
          take: 5,
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  /**
   * Find a user by ID with all relations
   */
  async findUserByIdWithRelations(id: string): Promise<
    | (User & {
        driver?: any;
        createdAuditLogs?: any[];
      })
    | null
  > {
    return db.user.findUnique({
      where: { id },
      include: {
        driver: true,
        createdAuditLogs: {
          take: 5,
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  /**
   * Update user information
   */
  async updateUser(
    id: string,
    data: Partial<{
      email: string;
      firstName: string;
      lastName: string;
      role: UserRole;
      status: UserStatus;
    }>,
  ): Promise<User> {
    return db.user.update({
      where: { id },
      data: {
        ...(data.email && { email: data.email.toLowerCase() }),
        ...data,
      },
    });
  }

  /**
   * Update user password
   */
  async updateUserPassword(id: string, hashedPassword: string): Promise<User> {
    return db.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  /**
   * Change user status
   */
  async updateUserStatus(id: string, status: UserStatus): Promise<User> {
    return db.user.update({
      where: { id },
      data: { status },
    });
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true },
    });
    return !!user;
  }

  /**
   * Get all users (with pagination)
   */
  async getAllUsers(
    limit: number = 10,
    offset: number = 0,
  ): Promise<{
    users: User[];
    total: number;
  }> {
    const [users, total] = await Promise.all([
      db.user.findMany({
        take: limit,
        skip: offset,
        orderBy: { createdAt: "desc" },
      }),
      db.user.count(),
    ]);

    return { users, total };
  }

  /**
   * Get users by role
   */
  async getUsersByRole(role: UserRole): Promise<User[]> {
    return db.user.findMany({
      where: { role },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Get active users
   */
  async getActiveUsers(): Promise<User[]> {
    return db.user.findMany({
      where: { status: UserStatus.ACTIVE },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Delete a user (soft delete via status)
   */
  async deleteUser(id: string): Promise<User> {
    return db.user.update({
      where: { id },
      data: { status: UserStatus.INACTIVE },
    });
  }
}

// Export singleton instance
export const userRepository = new UserRepository();
