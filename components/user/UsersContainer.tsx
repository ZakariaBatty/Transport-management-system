"use client";

import { useEffect, useState, useCallback } from "react";
import { User, UserRole, UserStatus } from "@prisma/client";
import {
  fetchUsers,
  fetchUserStatistics,
  createUserAction,
  updateUserAction,
  deleteUserAction,
} from "@/lib/users/actions/user.actions";
import { UsersHeader } from "./UsersHeader";
import { UsersList } from "./UsersList";
import { UsersFormDrawer } from "./UsersFormDrawer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface UsersContainerProps {}

export function UsersContainer({}: UsersContainerProps) {
  const [users, setUsers] = useState<(User & { driver?: any })[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    driverCount: 0,
    adminCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<
    (User & { driver?: any }) | null
  >(null);
  const [deleteConfirm, setDeleteConfirm] = useState<
    (User & { driver?: any }) | null
  >(null);
  const [submitting, setSubmitting] = useState(false);

  // Load users and statistics
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [usersData, statsData] = await Promise.all([
        fetchUsers(),
        fetchUserStatistics(),
      ]);
      setUsers(usersData);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter users
  const filteredUsers = users.filter((u) => {
    if (
      searchTerm &&
      !u.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !u.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (statusFilter !== "all" && u.status !== statusFilter) return false;
    return true;
  });

  // Handle create/edit
  const handleCreateClick = () => {
    setSelectedUser(null);
    setDrawerOpen(true);
  };

  const handleEdit = (user: User & { driver?: any }) => {
    setSelectedUser(user);
    setDrawerOpen(true);
  };

  const handleSubmit = async (formData: any) => {
    try {
      setSubmitting(true);
      if (selectedUser) {
        // Update
        await updateUserAction(selectedUser.id, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          status: formData.status,
          department: formData.department,
        });
      } else {
        // Create
        await createUserAction({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: formData.role,
          status: formData.status,
          department: formData.department,
        });
      }
      setDrawerOpen(false);
      setSelectedUser(null);
      await loadData();
    } catch (error) {
      console.error("Failed to save user:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteUserAction(deleteConfirm.id);
      setDeleteConfirm(null);
      await loadData();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <div className="space-y-6">
      <UsersHeader onCreateClick={handleCreateClick} stats={stats} />

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email..."
              className="pl-9 h-9 text-sm"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="h-9 w-40 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="DRIVER">Driver</SelectItem>
              <SelectItem value="MANAGER">Manager</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-40 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <button
            onClick={() => {
              setSearchTerm("");
              setRoleFilter("all");
              setStatusFilter("all");
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Users List */}
      <UsersList
        users={filteredUsers}
        onEdit={handleEdit}
        onDelete={setDeleteConfirm}
        isLoading={loading}
      />

      {/* Form Drawer */}
      <UsersFormDrawer
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSubmit={handleSubmit}
        isLoading={submitting}
      />

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setDeleteConfirm(null)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 z-50 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
            <p className="text-gray-600 mt-2">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{deleteConfirm.name}</span>? This
              action cannot be undone.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
