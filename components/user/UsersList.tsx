"use client";

import { User } from "@prisma/client";
import { Edit2, Trash2 } from "lucide-react";
import { RoleBadge, UserStatusBadge } from "@/components/shared";

interface UsersListProps {
  users: (User & { driver?: any })[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  isLoading?: boolean;
}

export function UsersList({
  users,
  onEdit,
  onDelete,
  isLoading,
}: UsersListProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 py-12 text-center">
        <p className="text-gray-500">Loading users...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 py-12 text-center">
        <p className="text-gray-500">No users found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
            <th className="px-6 py-3 text-left">Name</th>
            <th className="px-6 py-3 text-left">Email</th>
            <th className="px-6 py-3 text-left">Phone</th>
            <th className="px-6 py-3 text-left">Role</th>
            <th className="px-6 py-3 text-left">Status</th>
            <th className="px-6 py-3 text-left">Department</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {user.name}
                  </span>
                </div>
              </td>
              <td className="px-6 py-3 text-gray-600">{user.email}</td>
              <td className="px-6 py-3 text-gray-600 font-mono text-xs">
                {user.phone}
              </td>
              <td className="px-6 py-3">
                <RoleBadge role={user.role} />
              </td>
              <td className="px-6 py-3">
                <UserStatusBadge status={user.status} />
              </td>
              <td className="px-6 py-3 text-gray-600">
                {user.department || "—"}
              </td>
              <td className="px-6 py-3">
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => onEdit(user)}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(user)}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
