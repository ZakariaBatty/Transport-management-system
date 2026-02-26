'use client'

import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit2, Trash2, Loader } from 'lucide-react'

interface Vehicle {
  id: string
  plate: string
  model: string
  brand?: string
  year?: number
  fuelType?: string
  capacity?: number
  status: string
  notes?: string
  assignments?: any[]
}

interface VehiclesListProps {
  vehicles: Vehicle[]
  isLoading?: boolean
  userRole: string
  onEdit: (vehicle: Vehicle) => void
  onDelete: (vehicleId: string) => void
}

export function VehiclesList({
  vehicles,
  isLoading = false,
  userRole,
  onEdit,
  onDelete,
}: VehiclesListProps) {
  const canManageVehicles = ['manager', 'admin', 'super_admin'].includes(userRole)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
        <p className="text-slate-500">No vehicles found</p>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string }> = {
      ACTIVE: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
      MAINTENANCE: { bg: 'bg-amber-50', text: 'text-amber-700' },
      INACTIVE: { bg: 'bg-slate-100', text: 'text-slate-700' },
    }
    return statusMap[status] || { bg: 'bg-slate-50', text: 'text-slate-700' }
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-200 bg-slate-50">
            <TableHead className="font-semibold text-slate-900">Plate</TableHead>
            <TableHead className="font-semibold text-slate-900">Model</TableHead>
            <TableHead className="font-semibold text-slate-900">Brand</TableHead>
            <TableHead className="font-semibold text-slate-900">Year</TableHead>
            <TableHead className="font-semibold text-slate-900">Capacity</TableHead>
            <TableHead className="font-semibold text-slate-900">Status</TableHead>
            <TableHead className="font-semibold text-slate-900">Assigned Drivers</TableHead>
            {canManageVehicles && (
              <TableHead className="text-right font-semibold text-slate-900">
                Actions
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.id} className="border-slate-200 hover:bg-slate-50">
              <TableCell className="font-mono font-semibold text-slate-900">
                {vehicle.plate}
              </TableCell>
              <TableCell className="text-slate-600">{vehicle.model}</TableCell>
              <TableCell className="text-slate-600">{vehicle.brand || '-'}</TableCell>
              <TableCell className="text-slate-600">{vehicle.year || '-'}</TableCell>
              <TableCell className="text-slate-600">
                {vehicle.capacity ? `${vehicle.capacity} seats` : '-'}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={`${getStatusColor(vehicle.status).bg} ${getStatusColor(vehicle.status).text} border-0 font-semibold`}
                >
                  {vehicle.status}
                </Badge>
              </TableCell>
              <TableCell className="text-slate-600">
                {vehicle.assignments && vehicle.assignments.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {vehicle.assignments.map((assignment: any) => (
                      <Badge
                        key={assignment.id}
                        variant="secondary"
                        className="text-xs"
                      >
                        {assignment.driver?.user?.name || 'Unknown'}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-400">No drivers</span>
                )}
              </TableCell>
              {canManageVehicles && (
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(vehicle)}
                      className="text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this vehicle?')) {
                          onDelete(vehicle.id)
                        }
                      }}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
