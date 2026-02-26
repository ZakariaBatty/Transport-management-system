'use server'

import { auth } from '@/lib/auth'
import { locationService } from '@/lib/locations/services/location.service'

// ============ AGENCY ACTIONS ============

export async function getAgencies() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('Unauthorized')
    }

    const userRole = (session.user as any).role || 'driver'
    return await locationService.getAgencies(userRole)
  } catch (error) {
    console.error('[getAgencies]', error)
    throw error
  }
}

export async function getAgency(agencyId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('Unauthorized')
    }

    const userRole = (session.user as any).role || 'driver'
    return await locationService.getAgency(agencyId, userRole)
  } catch (error) {
    console.error('[getAgency]', error)
    throw error
  }
}

export async function createAgency(data: {
  name: string
  contactPerson: string
  phone: string
  email?: string
  address?: string
  city?: string
}) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('Unauthorized')
    }

    const userRole = (session.user as any).role || 'driver'
    return await locationService.createAgency(userRole, data)
  } catch (error) {
    console.error('[createAgency]', error)
    throw error
  }
}

export async function updateAgency(
  agencyId: string,
  data: {
    name?: string
    contactPerson?: string
    phone?: string
    email?: string
    address?: string
    city?: string
  },
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('Unauthorized')
    }

    const userRole = (session.user as any).role || 'driver'
    return await locationService.updateAgency(agencyId, userRole, data)
  } catch (error) {
    console.error('[updateAgency]', error)
    throw error
  }
}

export async function deleteAgency(agencyId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('Unauthorized')
    }

    const userRole = (session.user as any).role || 'driver'
    return await locationService.deleteAgency(agencyId, userRole)
  } catch (error) {
    console.error('[deleteAgency]', error)
    throw error
  }
}

// ============ HOTEL ACTIONS ============

export async function getHotels() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('Unauthorized')
    }

    const userRole = (session.user as any).role || 'driver'
    return await locationService.getHotels(userRole)
  } catch (error) {
    console.error('[getHotels]', error)
    throw error
  }
}

export async function getHotel(hotelId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('Unauthorized')
    }

    const userRole = (session.user as any).role || 'driver'
    return await locationService.getHotel(hotelId, userRole)
  } catch (error) {
    console.error('[getHotel]', error)
    throw error
  }
}

export async function createHotel(data: {
  name: string
  address: string
  city: string
  phone: string
  email?: string
}) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('Unauthorized')
    }

    const userRole = (session.user as any).role || 'driver'
    return await locationService.createHotel(userRole, data)
  } catch (error) {
    console.error('[createHotel]', error)
    throw error
  }
}

export async function updateHotel(
  hotelId: string,
  data: {
    name?: string
    address?: string
    city?: string
    phone?: string
    email?: string
  },
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('Unauthorized')
    }

    const userRole = (session.user as any).role || 'driver'
    return await locationService.updateHotel(hotelId, userRole, data)
  } catch (error) {
    console.error('[updateHotel]', error)
    throw error
  }
}

export async function deleteHotel(hotelId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('Unauthorized')
    }

    const userRole = (session.user as any).role || 'driver'
    return await locationService.deleteHotel(hotelId, userRole)
  } catch (error) {
    console.error('[deleteHotel]', error)
    throw error
  }
}
