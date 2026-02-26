import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { VehiclesContainer } from '@/components/vehicles/VehiclesContainer'

export const metadata = {
  title: 'Vehicles - TransitHub',
  description: 'Manage and monitor your fleet',
}

export default async function VehiclesPage() {
  const session = await auth()

  // Redirect if not authenticated
  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  // Only authenticated users can access vehicles
  return <VehiclesContainer />
}
