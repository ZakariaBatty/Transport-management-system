'use client'

import React, { useState, useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Loader } from 'lucide-react'
import {
  updateVehicleAction,
  createVehicleAction,
  assignDriverAction,
  unassignDriverAction,
  getAvailableDriversAction,
} from '@/app/vehicles/actions'
import { Badge } from '@/components/ui/badge'

interface Vehicle {
  id?: string
  plate: string
  model: string
  brand?: string
  year?: number
  fuelType?: string
  capacity?: number
  status?: string
  notes?: string
  assignments?: any[]
}

interface Driver {
  id: string
  user: {
    id: string
    name: string
    email: string
  }
}

interface VehiclesFormDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  vehicle?: Vehicle | null
  userRole: string
}

export function VehiclesFormDrawer({
  isOpen,
  onClose,
  onSuccess,
  vehicle,
  userRole,
}: VehiclesFormDrawerProps) {
  const [formData, setFormData] = useState<Vehicle>({
    plate: '',
    model: '',
    brand: '',
    year: new Date().getFullYear(),
    fuelType: 'DIESEL',
    capacity: 4,
    status: 'ACTIVE',
    notes: '',
  })

  const [drivers, setDrivers] = useState<Driver[]>([])
  const [selectedDriver, setSelectedDriver] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)

  const canManage = ['manager', 'admin', 'super_admin'].includes(userRole)

  // Load available drivers
  useEffect(() => {
    if (isOpen && canManage && vehicle?.id) {
      loadAvailableDrivers()
    }
  }, [isOpen, vehicle?.id, canManage])

  // Load vehicle data if editing
  useEffect(() => {
    if (vehicle && isOpen) {
      setFormData({
        plate: vehicle.plate || '',
        model: vehicle.model || '',
        brand: vehicle.brand || '',
        year: vehicle.year,
        fuelType: vehicle.fuelType || 'DIESEL',
        capacity: vehicle.capacity,
        status: vehicle.status || 'ACTIVE',
        notes: vehicle.notes || '',
      })
    } else if (isOpen) {
      setFormData({
        plate: '',
        model: '',
        brand: '',
        year: new Date().getFullYear(),
        fuelType: 'DIESEL',
        capacity: 4,
        status: 'ACTIVE',
        notes: '',
      })
    }
  }, [vehicle, isOpen])

  const loadAvailableDrivers = async () => {
    setIsFetching(true)
    try {
      const result = await getAvailableDriversAction()
      if (result.success) {
        setDrivers(result.data || [])
      }
    } catch (error) {
      console.error('Error loading drivers:', error)
    } finally {
      setIsFetching(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'year' || name === 'capacity' ? parseInt(value) || 0 : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let result

      if (vehicle?.id) {
        // Update existing vehicle
        result = await updateVehicleAction(vehicle.id, formData)
      } else {
        // Create new vehicle
        result = await createVehicleAction(formData)
      }

      if (result.success) {
        onSuccess()
        onClose()
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error saving vehicle:', error)
      alert('Failed to save vehicle')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAssignDriver = async () => {
    if (!selectedDriver || !vehicle?.id) {
      alert('Please select a driver')
      return
    }

    setIsLoading(true)
    try {
      const result = await assignDriverAction(vehicle.id, selectedDriver)
      if (result.success) {
        setSelectedDriver('')
        onSuccess()
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error assigning driver:', error)
      alert('Failed to assign driver')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnassignDriver = async (assignmentId: string) => {
    setIsLoading(true)
    try {
      const result = await unassignDriverAction(assignmentId)
      if (result.success) {
        onSuccess()
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error unassigning driver:', error)
      alert('Failed to unassign driver')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full max-w-md overflow-y-auto sm:max-w-md">
        <SheetHeader className="mb-6">
          <SheetTitle>{vehicle?.id ? 'Edit Vehicle' : 'New Vehicle'}</SheetTitle>
          <SheetDescription>
            {vehicle?.id ? 'Update vehicle information' : 'Create a new vehicle'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Plate */}
          <div>
            <Label htmlFor="plate" className="text-slate-700">
              License Plate *
            </Label>
            <Input
              id="plate"
              name="plate"
              placeholder="ABC1234"
              value={formData.plate}
              onChange={handleInputChange}
              className="mt-2 border-slate-200"
              required
              disabled={!canManage}
            />
          </div>

          {/* Model */}
          <div>
            <Label htmlFor="model" className="text-slate-700">
              Model *
            </Label>
            <Input
              id="model"
              name="model"
              placeholder="Sprinter"
              value={formData.model}
              onChange={handleInputChange}
              className="mt-2 border-slate-200"
              required
              disabled={!canManage}
            />
          </div>

          {/* Brand */}
          <div>
            <Label htmlFor="brand" className="text-slate-700">
              Brand
            </Label>
            <Input
              id="brand"
              name="brand"
              placeholder="Mercedes-Benz"
              value={formData.brand || ''}
              onChange={handleInputChange}
              className="mt-2 border-slate-200"
              disabled={!canManage}
            />
          </div>

          {/* Year & Capacity Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="year" className="text-slate-700">
                Year
              </Label>
              <Input
                id="year"
                name="year"
                type="number"
                placeholder="2024"
                value={formData.year || ''}
                onChange={handleInputChange}
                className="mt-2 border-slate-200"
                disabled={!canManage}
              />
            </div>
            <div>
              <Label htmlFor="capacity" className="text-slate-700">
                Capacity (seats)
              </Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                placeholder="4"
                value={formData.capacity || ''}
                onChange={handleInputChange}
                className="mt-2 border-slate-200"
                disabled={!canManage}
              />
            </div>
          </div>

          {/* Fuel Type */}
          <div>
            <Label htmlFor="fuelType" className="text-slate-700">
              Fuel Type
            </Label>
            <Select
              value={formData.fuelType || 'DIESEL'}
              onValueChange={(value) => handleSelectChange('fuelType', value)}
              disabled={!canManage}
            >
              <SelectTrigger className="mt-2 border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DIESEL">Diesel</SelectItem>
                <SelectItem value="PETROL">Petrol</SelectItem>
                <SelectItem value="ELECTRIC">Electric</SelectItem>
                <SelectItem value="HYBRID">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          {canManage && (
            <div>
              <Label htmlFor="status" className="text-slate-700">
                Status
              </Label>
              <Select
                value={formData.status || 'ACTIVE'}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger className="mt-2 border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Notes */}
          <div>
            <Label htmlFor="notes" className="text-slate-700">
              Notes
            </Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Additional notes..."
              value={formData.notes || ''}
              onChange={handleInputChange}
              className="mt-2 border-slate-200"
              rows={3}
              disabled={!canManage}
            />
          </div>

          {/* Submit Button */}
          {canManage && (
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              {vehicle?.id ? 'Update Vehicle' : 'Create Vehicle'}
            </Button>
          )}
        </form>

        {/* Driver Assignment Section */}
        {canManage && vehicle?.id && (
          <div className="mt-8 border-t border-slate-200 pt-6">
            <h3 className="text-sm font-semibold text-slate-900">Assign Drivers</h3>
            <p className="mt-1 text-xs text-slate-500">
              Manage which drivers can use this vehicle
            </p>

            {/* Current Assignments */}
            {vehicle.assignments && vehicle.assignments.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-medium text-slate-600">Currently Assigned:</p>
                {vehicle.assignments.map((assignment: any) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {assignment.driver?.user?.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {assignment.driver?.user?.email}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleUnassignDriver(assignment.id)}
                      disabled={isLoading}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Assign New Driver */}
            <div className="mt-4 space-y-3">
              <div>
                <Label htmlFor="driver-select" className="text-xs font-medium text-slate-700">
                  Add Driver
                </Label>
                <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                  <SelectTrigger className="mt-2 border-slate-200">
                    <SelectValue
                      placeholder={isFetching ? 'Loading drivers...' : 'Select a driver'}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers.map((driver) => (
                      <SelectItem key={driver.id} value={driver.id}>
                        {driver.user.name} ({driver.user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="button"
                onClick={handleAssignDriver}
                disabled={!selectedDriver || isLoading || isFetching}
                variant="outline"
                className="w-full border-slate-200 hover:bg-slate-50"
              >
                {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                Assign Driver
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
