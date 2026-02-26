import { prisma } from "@/lib/db/client";
import { Prisma } from "@prisma/client";

/**
 * Location Repository
 * Handles all database operations for agencies and hotels using Prisma ORM
 * Provides role-aware queries that filter data based on user permissions
 */

export const locationRepository = {
  // ============ AGENCY OPERATIONS ============

  /**
   * Find agencies for a user based on their role
   * Drivers see all agencies (read-only)
   * Managers/Admins see all agencies (full access)
   */
  async findAgenciesForUser(userRole: string) {
    return prisma.agency.findMany({
      where: { deletedAt: null },
      orderBy: { name: "asc" },
    });
  },

  /**
   * Find a single agency by ID
   */
  async findAgencyById(agencyId: string) {
    return prisma.agency.findUnique({
      where: { id: agencyId },
      include: {
        trips: {
          select: {
            id: true,
            tripDate: true,
            passengersCount: true,
            tripPrice: true,
          },
        },
      },
    });
  },

  /**
   * Create a new agency
   */
  async createAgency(data: Prisma.AgencyCreateInput) {
    return prisma.agency.create({
      data,
    });
  },

  /**
   * Update an existing agency
   */
  async updateAgency(agencyId: string, data: Prisma.AgencyUpdateInput) {
    return prisma.agency.update({
      where: { id: agencyId },
      data,
    });
  },

  /**
   * Soft delete an agency
   */
  async deleteAgency(agencyId: string) {
    return prisma.agency.update({
      where: { id: agencyId },
      data: { deletedAt: new Date() },
    });
  },

  /**
   * Check if agency name already exists
   */
  async agencyNameExists(name: string, excludeId?: string): Promise<boolean> {
    const agency = await prisma.agency.findUnique({
      where: { name },
    });
    if (excludeId && agency?.id === excludeId) return false;
    return !!agency && !agency.deletedAt;
  },

  /**
   * Get agency statistics
   */
  async getAgencyStats() {
    const [totalAgencies, activeAgencies] = await Promise.all([
      prisma.agency.count({ where: { deletedAt: null } }),
      prisma.agency.count({ where: { deletedAt: null } }),
    ]);

    return {
      totalAgencies,
      activeAgencies,
    };
  },

  // ============ HOTEL OPERATIONS ============

  /**
   * Find hotels for a user based on their role
   * Drivers see all hotels (read-only)
   * Managers/Admins see all hotels (full access)
   */
  async findHotelsForUser(userRole: string) {
    return prisma.hotel.findMany({
      where: { deletedAt: null },
      orderBy: { name: "asc" },
    });
  },

  /**
   * Find a single hotel by ID
   */
  async findHotelById(hotelId: string) {
    return prisma.hotel.findUnique({
      where: { id: hotelId },
      include: {
        trips: {
          select: {
            id: true,
            tripDate: true,
            passengersCount: true,
            tripPrice: true,
          },
        },
      },
    });
  },

  /**
   * Create a new hotel
   */
  async createHotel(data: Prisma.HotelCreateInput) {
    return prisma.hotel.create({
      data,
    });
  },

  /**
   * Update an existing hotel
   */
  async updateHotel(hotelId: string, data: Prisma.HotelUpdateInput) {
    return prisma.hotel.update({
      where: { id: hotelId },
      data,
    });
  },

  /**
   * Soft delete a hotel
   */
  async deleteHotel(hotelId: string) {
    return prisma.hotel.update({
      where: { id: hotelId },
      data: { deletedAt: new Date() },
    });
  },

  /**
   * Check if hotel name already exists
   */
  async hotelNameExists(name: string, excludeId?: string): Promise<boolean> {
    const hotel = await prisma.hotel.findUnique({
      where: { name },
    });
    if (excludeId && hotel?.id === excludeId) return false;
    return !!hotel && !hotel.deletedAt;
  },

  /**
   * Get hotel statistics
   */
  async getHotelStats() {
    const [totalHotels, activeHotels] = await Promise.all([
      prisma.hotel.count({ where: { deletedAt: null } }),
      prisma.hotel.count({ where: { deletedAt: null } }),
    ]);

    return {
      totalHotels,
      activeHotels,
    };
  },

  /**
   * Get all active agencies (for dropdowns)
   */
  async getActiveAgencies() {
    return prisma.agency.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
  },

  /**
   * Get all active hotels (for dropdowns)
   */
  async getActiveHotels() {
    return prisma.hotel.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true, city: true },
      orderBy: { name: "asc" },
    });
  },
};
