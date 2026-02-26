import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { LocationsContainer } from '@/components/locations/LocationsContainer'

export const metadata = {
  title: 'Locations - TransitHub',
  description: 'Manage agencies and hotels',
}

export default async function LocationsPage() {
  const session = await auth()

  // Redirect if not authenticated
  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  // Only authenticated users can access locations
  return <LocationsContainer />
}
  };

  // Hotel handlers
  const handleCreateHotel = () => {
    setHotelForm(null);
    hotelActions.openCreateDrawer();
  };

  const handleEditHotel = (hotel: Hotel) => {
    setHotelForm({ ...hotel });
    hotelActions.openEditDrawer(hotel);
  };

  const handleViewHotel = (hotel: Hotel) => {
    setHotelForm(hotel);
    hotelActions.openViewDrawer(hotel);
  };

  const handleSaveHotel = () => {
    if (!hotelForm) return;
    if (hotelState.mode === "create") {
      const newHotel: Hotel = {
        ...hotelForm,
        id: String(Date.now()),
      };
      hotelActions.createItem(newHotel);
    } else {
      hotelActions.updateItem(hotelForm);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Locations Management
          </h1>
          <p className="text-gray-600 mt-1">Manage agencies and hotels</p>
        </div>
        <button
          onClick={() => {
            if (activeTab === "agencies") {
              handleCreateAgency();
            } else {
              handleCreateHotel();
            }
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Add {activeTab === "agencies" ? "Agency" : "Hotel"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 bg-white rounded-lg border border-gray-200 p-1">
        <button
          onClick={() => setActiveTab("agencies")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === "agencies"
              ? "bg-blue-100 text-blue-600"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Building2 className="w-5 h-5" />
          Agencies
        </button>
        <button
          onClick={() => setActiveTab("hotels")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === "hotels"
              ? "bg-blue-100 text-blue-600"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <HotelIcon className="w-5 h-5" />
          Hotels
        </button>
      </div>

      {/* Agencies Tab */}
      {activeTab === "agencies" && (
        <div className="space-y-6">
          {agencyState.items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agencyState.items.map((agency) => (
                <div
                  key={agency.id}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {agency.name}
                    </h3>
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>

                  <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Contact:</span>{" "}
                      {agency.contact}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Phone:</span> {agency.phone}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {agency.totalTrips}
                      </p>
                      <p className="text-xs text-gray-600">Trips</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {agency.totalPax}
                      </p>
                      <p className="text-xs text-gray-600">Passengers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        ${agency.revenue}
                      </p>
                      <p className="text-xs text-gray-600">Revenue</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewAgency(agency)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => handleEditAgency(agency)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-green-300 text-green-600 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => agencyActions.openDeleteDialog(agency)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 py-12 text-center">
              <p className="text-gray-500">No agencies found.</p>
            </div>
          )}
        </div>
      )}

      {/* Hotels Tab */}
      {activeTab === "hotels" && (
        <div className="space-y-6">
          {hotelState.items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotelState.items.map((hotel) => (
                <div
                  key={hotel.id}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {hotel.name}
                    </h3>
                    <HotelIcon className="w-5 h-5 text-orange-600" />
                  </div>

                  <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Address:</span>{" "}
                      {hotel.address}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Phone:</span> {hotel.phone}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {hotel.totalTrips}
                      </p>
                      <p className="text-xs text-gray-600">Trips</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {hotel.totalPax}
                      </p>
                      <p className="text-xs text-gray-600">Passengers</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewHotel(hotel)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => handleEditHotel(hotel)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-green-300 text-green-600 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => hotelActions.openDeleteDialog(hotel)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 py-12 text-center">
              <p className="text-gray-500">No hotels found.</p>
            </div>
          )}
        </div>
      )}

      {/* Agency Drawer */}
      <Drawer
        isOpen={agencyState.isDrawerOpen}
        onClose={agencyActions.closeDrawer}
        title={
          agencyState.mode === "view"
            ? "Agency Details"
            : agencyState.mode === "edit"
              ? "Edit Agency"
              : "Add New Agency"
        }
      >
        {agencyState.mode === "view" && agencyForm ? (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-xl font-bold text-blue-900">
                {agencyForm.name}
              </h3>
            </div>

            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Contact Person
                </label>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {agencyForm.contact}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Phone
                </label>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {agencyForm.phone}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-200">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {agencyForm.totalTrips}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Total Trips</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {agencyForm.totalPax}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Total Passengers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    ${agencyForm.revenue}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Revenue</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveAgency();
            }}
          >
            <FormField
              label="Agency Name"
              value={agencyForm?.name || ""}
              onChange={(val) =>
                setAgencyForm({ ...agencyForm!, name: String(val) })
              }
            />
            <FormField
              label="Contact Person"
              value={agencyForm?.contact || ""}
              onChange={(val) =>
                setAgencyForm({ ...agencyForm!, contact: String(val) })
              }
            />
            <FormField
              label="Phone"
              type="tel"
              value={agencyForm?.phone || ""}
              onChange={(val) =>
                setAgencyForm({ ...agencyForm!, phone: String(val) })
              }
            />
            <FormField
              label="Total Trips"
              type="number"
              value={String(agencyForm?.totalTrips || "")}
              onChange={(val) =>
                setAgencyForm({ ...agencyForm!, totalTrips: Number(val) })
              }
            />
            <FormField
              label="Total Passengers"
              type="number"
              value={String(agencyForm?.totalPax || "")}
              onChange={(val) =>
                setAgencyForm({ ...agencyForm!, totalPax: Number(val) })
              }
            />
            <FormField
              label="Revenue"
              type="number"
              value={String(agencyForm?.revenue || "")}
              onChange={(val) =>
                setAgencyForm({ ...agencyForm!, revenue: Number(val) })
              }
            />
            <div className="flex gap-3 pt-6">
              <button
                type="button"
                onClick={agencyActions.closeDrawer}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {agencyState.mode === "create" ? "Add Agency" : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </Drawer>

      {/* Hotel Drawer */}
      <Drawer
        isOpen={hotelState.isDrawerOpen}
        onClose={hotelActions.closeDrawer}
        title={
          hotelState.mode === "view"
            ? "Hotel Details"
            : hotelState.mode === "edit"
              ? "Edit Hotel"
              : "Add New Hotel"
        }
      >
        {hotelState.mode === "view" && hotelForm ? (
          <div className="space-y-6">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="text-xl font-bold text-orange-900">
                {hotelForm.name}
              </h3>
            </div>

            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Address
                </label>
                <p className="text-gray-900 mt-1 font-medium">
                  {hotelForm.address}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Phone
                </label>
                <p className="text-gray-900 mt-1 font-medium">
                  {hotelForm.phone}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-200">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {hotelForm.totalTrips}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Total Trips</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {hotelForm.totalPax}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Total Passengers</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveHotel();
            }}
          >
            <FormField
              label="Hotel Name"
              value={hotelForm?.name || ""}
              onChange={(val) =>
                setHotelForm({ ...hotelForm!, name: String(val) })
              }
            />
            <FormField
              label="Address"
              value={hotelForm?.address || ""}
              onChange={(val) =>
                setHotelForm({ ...hotelForm!, address: String(val) })
              }
            />
            <FormField
              label="Phone"
              type="tel"
              value={hotelForm?.phone || ""}
              onChange={(val) =>
                setHotelForm({ ...hotelForm!, phone: String(val) })
              }
            />
            <FormField
              label="Total Trips"
              type="number"
              value={String(hotelForm?.totalTrips || "")}
              onChange={(val) =>
                setHotelForm({ ...hotelForm!, totalTrips: Number(val) })
              }
            />
            <FormField
              label="Total Passengers"
              type="number"
              value={String(hotelForm?.totalPax || "")}
              onChange={(val) =>
                setHotelForm({ ...hotelForm!, totalPax: Number(val) })
              }
            />
            <div className="flex gap-3 pt-6">
              <button
                type="button"
                onClick={hotelActions.closeDrawer}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {hotelState.mode === "create" ? "Add Hotel" : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </Drawer>

      {/* Delete Dialogs */}
      <ConfirmDialog
        isOpen={agencyState.isDeleteDialogOpen}
        title="Delete Agency"
        message="Are you sure you want to delete this agency? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive
        onConfirm={() =>
          agencyState.deleteTarget &&
          agencyActions.deleteItem(agencyState.deleteTarget)
        }
        onCancel={agencyActions.closeDeleteDialog}
      />

      <ConfirmDialog
        isOpen={hotelState.isDeleteDialogOpen}
        title="Delete Hotel"
        message="Are you sure you want to delete this hotel? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive
        onConfirm={() =>
          hotelState.deleteTarget &&
          hotelActions.deleteItem(hotelState.deleteTarget)
        }
        onCancel={hotelActions.closeDeleteDialog}
      />
    </div>
  );
}
