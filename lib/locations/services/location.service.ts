import { Prisma } from '@prisma/client'
import { locationRepository } from '../repositories/location.repository'
import { prisma } from '@/lib/db/client'

/**
 * Location Service
 * Contains business logic for agencies and hotels with role-based authorization
 * All CRUD operations are protected by role checks
 */

// ============ AGENCY INTERFACES ============

interface AgencyCreateData {
  name: string
  contactPerson: string
  phone: string
  email?: string
  address?: string
  city?: string
}

interface AgencyUpdateData {
  name?: string
  contactPerson?: string
  phone?: string
  email?: string
  address?: string
  city?: string
}

// ============ HOTEL INTERFACES ============

interface HotelCreateData {
  name: string
  address: string
  city: string
  phone: string
  email?: string
}

interface HotelUpdateData {
  name?: string
  address?: string
  city?: string
  phone?: string
  email?: string
}

export const locationService = {
  // ============ AGENCY SERVICE METHODS ============

  /**
   * Get all agencies (Manager/Admin only)
   */
  async getAgencies(userRole: string) {
    if (!['manager', 'admin', 'super_admin'].includes(userRole)) {
      throw new Error('Unauthorized: Cannot view agencies')
    }

    return locationRepository.findAgenciesForUser(userRole)
  },

  /**
   * Get a single agency with authorization check
   */
  async getAgency(agencyId: string, userRole: string) {
    const agency = await locationRepository.findAgencyById(agencyId)
    if (!agency) {
      throw new Error('Agency not found')
    }

    // Managers/Admins can view all agencies
    if (!['manager', 'admin', 'super_admin'].includes(userRole)) {
      throw new Error('Unauthorized: Cannot view this agency')
    }

    return agency
  },

  /**
   * Create a new agency (Manager/Admin only)
   */
  async createAgency(userRole: string, agencyData: AgencyCreateData) {
    if (!['manager', 'admin', 'super_admin'].includes(userRole)) {
      throw new Error('Unauthorized: Cannot create agencies')
    }

    // Validate required fields
    if (!agencyData.name || !agencyData.contactPerson || !agencyData.phone) {
      throw new Error('Missing required fields: name, contactPerson, phone')
    }

    // Check if agency name already exists
    const existingName = await locationRepository.agencyNameExists(agencyData.name)
    if (existingName) {
      throw new Error('Agency with this name already exists')
    }

    const createInput: Prisma.AgencyCreateInput = {
      name: agencyData.name,
      contactPerson: agencyData.contactPerson,
      phone: agencyData.phone,
      email: agencyData.email,
      address: agencyData.address,
      city: agencyData.city,
    }

    return locationRepository.createAgency(createInput)
  },

  /**
   * Update an existing agency (Manager/Admin only)
   */
  async updateAgency(
    agencyId: string,
    userRole: string,
    agencyData: AgencyUpdateData,
  ) {
    if (!['manager', 'admin', 'super_admin'].includes(userRole)) {
      throw new Error('Unauthorized: Cannot update agencies')
    }

    const agency = await locationRepository.findAgencyById(agencyId)
    if (!agency) {
      throw new Error('Agency not found')
    }

    // Check if new name is unique (if being changed)
    if (agencyData.name && agencyData.name !== agency.name) {
      const existingName = await locationRepository.agencyNameExists(
        agencyData.name,
        agencyId,
      )
      if (existingName) {
        throw new Error('Agency with this name already exists')
      }
    }

    const updateInput: Prisma.AgencyUpdateInput = {}

    if (agencyData.name) updateInput.name = agencyData.name
    if (agencyData.contactPerson) updateInput.contactPerson = agencyData.contactPerson
    if (agencyData.phone) updateInput.phone = agencyData.phone
    if (agencyData.email !== undefined) updateInput.email = agencyData.email
    if (agencyData.address !== undefined) updateInput.address = agencyData.address
    if (agencyData.city !== undefined) updateInput.city = agencyData.city

    return locationRepository.updateAgency(agencyId, updateInput)
  },

  /**
   * Delete an agency (Manager/Admin only)
   */
  async deleteAgency(agencyId: string, userRole: string) {
    if (!['manager', 'admin', 'super_admin'].includes(userRole)) {
      throw new Error('Unauthorized: Cannot delete agencies')
    }

    const agency = await locationRepository.findAgencyById(agencyId)
    if (!agency) {
      throw new Error('Agency not found')
    }

    return locationRepository.deleteAgency(agencyId)
  },

  // ============ HOTEL SERVICE METHODS ============

  /**
   * Get all hotels (Manager/Admin only)
   */
  async getHotels(userRole: string) {
    if (!['manager', 'admin', 'super_admin'].includes(userRole)) {
      throw new Error('Unauthorized: Cannot view hotels')
    }

    return locationRepository.findHotelsForUser(userRole)
  },

  /**
   * Get a single hotel with authorization check
   */
  async getHotel(hotelId: string, userRole: string) {
    const hotel = await locationRepository.findHotelById(hotelId)
    if (!hotel) {
      throw new Error('Hotel not found')
    }

    // Managers/Admins can view all hotels
    if (!['manager', 'admin', 'super_admin'].includes(userRole)) {
      throw new Error('Unauthorized: Cannot view this hotel')
    }

    return hotel
  },

  /**
   * Create a new hotel (Manager/Admin only)
   */
  async createHotel(userRole: string, hotelData: HotelCreateData) {
    if (!['manager', 'admin', 'super_admin'].includes(userRole)) {
      throw new Error('Unauthorized: Cannot create hotels')
    }

    // Validate required fields
    if (!hotelData.name || !hotelData.address || !hotelData.city || !hotelData.phone) {
      throw new Error(
        'Missing required fields: name, address, city, phone',
      )
    }

    // Check if hotel name already exists
    const existingName = await locationRepository.hotelNameExists(hotelData.name)
    if (existingName) {
      throw new Error('Hotel with this name already exists')
    }

    const createInput: Prisma.HotelCreateInput = {
      name: hotelData.name,
      address: hotelData.address,
      city: hotelData.city,
      phone: hotelData.phone,
      email: hotelData.email,
    }

    return locationRepository.createHotel(createInput)
  },

  /**
   * Update an existing hotel (Manager/Admin only)
   */
  async updateHotel(
    hotelId: string,
    userRole: string,
    hotelData: HotelUpdateData,
  ) {
    if (!['manager', 'admin', 'super_admin'].includes(userRole)) {
      throw new Error('Unauthorized: Cannot update hotels')
    }

    const hotel = await locationRepository.findHotelById(hotelId)
    if (!hotel) {
      throw new Error('Hotel not found')
    }

    // Check if new name is unique (if being changed)
    if (hotelData.name && hotelData.name !== hotel.name) {
      const existingName = await locationRepository.hotelNameExists(
        hotelData.name,
        hotelId,
      )
      if (existingName) {
        throw new Error('Hotel with this name already exists')
      }
    }

    const updateInput: Prisma.HotelUpdateInput = {}

    if (hotelData.name) updateInput.name = hotelData.name
    if (hotelData.address) updateInput.address = hotelData.address
    if (hotelData.city) updateInput.city = hotelData.city
    if (hotelData.phone) updateInput.phone = hotelData.phone
    if (hotelData.email !== undefined) updateInput.email = hotelData.email

    return locationRepository.updateHotel(hotelId, updateInput)
  },

  /**
   * Delete a hotel (Manager/Admin only)
   */
  async deleteHotel(hotelId: string, userRole: string) {
    if (!['manager', 'admin', 'super_admin'].includes(userRole)) {
      throw new Error('Unauthorized: Cannot delete hotels')
    }

    const hotel = await locationRepository.findHotelById(hotelId)
    if (!hotel) {
      throw new Error('Hotel not found')
    }

    return locationRepository.deleteHotel(hotelId)
  },
}
