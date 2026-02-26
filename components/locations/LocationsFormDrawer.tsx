'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Agency {
  id?: string
  name: string
  contactPerson: string
  phone: string
  email?: string
  address?: string
  city?: string
}

interface Hotel {
  id?: string
  name: string
  address: string
  city: string
  phone: string
  email?: string
}

interface LocationsFormDrawerProps {
  type: 'agency' | 'hotel'
  mode: 'create' | 'edit' | 'view'
  item?: Agency | Hotel
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => Promise<void>
  isLoading?: boolean
}

export function LocationsFormDrawer({
  type,
  mode,
  item,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: LocationsFormDrawerProps) {
  const [formData, setFormData] = useState<Agency | Hotel>(
    item || (type === 'agency' ? {
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      city: '',
    } : {
      name: '',
      address: '',
      city: '',
      phone: '',
      email: '',
    })
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
    setFormData(item || (type === 'agency' ? {
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      city: '',
    } : {
      name: '',
      address: '',
      city: '',
      phone: '',
      email: '',
    }))
    onClose()
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {mode === 'view'
              ? `${type === 'agency' ? 'Agency' : 'Hotel'} Details`
              : mode === 'edit'
              ? `Edit ${type === 'agency' ? 'Agency' : 'Hotel'}`
              : `Add New ${type === 'agency' ? 'Agency' : 'Hotel'}`}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {mode === 'view' ? (
            <ViewMode item={item} type={type} />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {type === 'agency' ? (
                <>
                  <div>
                    <Label htmlFor="name">Agency Name</Label>
                    <Input
                      id="name"
                      value={(formData as Agency).name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Enter agency name"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactPerson">Contact Person</Label>
                    <Input
                      id="contactPerson"
                      value={(formData as Agency).contactPerson}
                      onChange={(e) =>
                        setFormData({ ...formData, contactPerson: e.target.value })
                      }
                      placeholder="Enter contact person name"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={(formData as Agency).phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="Enter phone number"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={(formData as Agency).email || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="Enter email"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Address (Optional)</Label>
                    <Textarea
                      id="address"
                      value={(formData as Agency).address || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      placeholder="Enter address"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">City (Optional)</Label>
                    <Input
                      id="city"
                      value={(formData as Agency).city || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      placeholder="Enter city"
                      disabled={isLoading}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label htmlFor="name">Hotel Name</Label>
                    <Input
                      id="name"
                      value={(formData as Hotel).name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Enter hotel name"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={(formData as Hotel).address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      placeholder="Enter address"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={(formData as Hotel).city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      placeholder="Enter city"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={(formData as Hotel).phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="Enter phone number"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={(formData as Hotel).email || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="Enter email"
                      disabled={isLoading}
                    />
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-6">
                <SheetClose asChild>
                  <Button type="button" variant="outline" disabled={isLoading}>
                    Cancel
                  </Button>
                </SheetClose>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : mode === 'create' ? 'Add' : 'Save'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

function ViewMode({ item, type }: { item?: Agency | Hotel; type: string }) {
  if (!item) return null

  return (
    <div className="space-y-6">
      <div className={`p-4 rounded-lg ${type === 'agency' ? 'bg-blue-50 border border-blue-200' : 'bg-orange-50 border border-orange-200'}`}>
        <h3 className={`text-xl font-bold ${type === 'agency' ? 'text-blue-900' : 'text-orange-900'}`}>
          {item.name}
        </h3>
      </div>

      {type === 'agency' ? (
        <>
          <div>
            <Label className="text-sm font-medium text-gray-600">Contact Person</Label>
            <p className="text-lg font-semibold text-gray-900">
              {(item as Agency).contactPerson}
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Phone</Label>
            <p className="text-lg font-semibold text-gray-900">
              {(item as Agency).phone}
            </p>
          </div>
          {(item as Agency).email && (
            <div>
              <Label className="text-sm font-medium text-gray-600">Email</Label>
              <p className="text-lg font-semibold text-gray-900">
                {(item as Agency).email}
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          <div>
            <Label className="text-sm font-medium text-gray-600">Address</Label>
            <p className="text-lg font-semibold text-gray-900">
              {(item as Hotel).address}
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">City</Label>
            <p className="text-lg font-semibold text-gray-900">
              {(item as Hotel).city}
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Phone</Label>
            <p className="text-lg font-semibold text-gray-900">
              {(item as Hotel).phone}
            </p>
          </div>
        </>
      )}
    </div>
  )
}
