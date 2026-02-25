import { User, users as allUsers } from "@/lib/data/users";

/**
 * User Repository (JSON-based for demo)
 * Handles all database operations for users using the fake JSON DB
 * Follows the Single Responsibility Principle - only data access
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
    role: 'driver' | 'manager' | 'admin' | 'super_admin';
  }): Promise<User> {
    const newUser: User = {
      id: String(Math.max(...allUsers.map(u => parseInt(u.id) || 0)) + 1),
      email: data.email.toLowerCase(),
      password: data.password,
      name: data.name,
      phone: data.phone,
      role: data.role,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: new Date().toISOString().split('T')[0],
    };
    allUsers.push(newUser);
    return newUser;
  }

  /**
   * Find a user by email address
   */
  async findUserByEmail(email: string): Promise<User | null> {
    return allUsers.find(u => u.email === email.toLowerCase()) || null;
  }

  /**
   * Find a user by ID
   */
  async findUserById(id: string): Promise<User | null> {
    return allUsers.find(u => u.id === id) || null;
  }

  /**
   * Find a user by email with all relations
   */
  async findUserByEmailWithRelations(email: string): Promise<User | null> {
    return allUsers.find(u => u.email === email.toLowerCase()) || null;
  }

  /**
   * Find a user by ID with all relations
   */
  async findUserByIdWithRelations(id: string): Promise<User | null> {
    return allUsers.find(u => u.id === id) || null;
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
      role: 'driver' | 'manager' | 'admin' | 'super_admin';
      status: 'active' | 'inactive' | 'suspended';
    }>,
  ): Promise<User> {
    const user = allUsers.find(u => u.id === id);
    if (!user) throw new Error("User not found");

    if (data.email) user.email = data.email.toLowerCase();
    if (data.firstName) user.name = data.firstName;
    if (data.lastName) user.name = data.lastName;
    if (data.role) user.role = data.role;
    if (data.status) user.status = data.status;

    return user;
  }

  /**
   * Update user password
   */
  async updateUserPassword(id: string, hashedPassword: string): Promise<User> {
    const user = allUsers.find(u => u.id === id);
    if (!user) throw new Error("User not found");

    user.password = hashedPassword;
    return user;
  }

  /**
   * Change user status
   */
  async updateUserStatus(
    id: string,
    status: 'active' | 'inactive' | 'suspended',
  ): Promise<User> {
    const user = allUsers.find(u => u.id === id);
    if (!user) throw new Error("User not found");

    user.status = status;
    return user;
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    return allUsers.some(u => u.email === email.toLowerCase());
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
    const sorted = [...allUsers].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const users = sorted.slice(offset, offset + limit);
    return { users, total: allUsers.length };
  }

  /**
   * Get users by role
   */
  async getUsersByRole(
    role: 'driver' | 'manager' | 'admin' | 'super_admin',
  ): Promise<User[]> {
    return allUsers
      .filter(u => u.role === role)
      .sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  /**
   * Get active users
   */
  async getActiveUsers(): Promise<User[]> {
    return allUsers
      .filter(u => u.status === 'active')
      .sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  /**
   * Delete a user (soft delete via status)
   */
  async deleteUser(id: string): Promise<User> {
    const user = allUsers.find(u => u.id === id);
    if (!user) throw new Error("User not found");

    user.status = 'inactive';
    return user;
  }
}

// Export singleton instance
export const userRepository = new UserRepository();
