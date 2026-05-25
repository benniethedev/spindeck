"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/libs/pressbase/client";
import toast from "react-hot-toast";

export default function UserManagement({ onStatsUpdate }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");

  const pb = createClient();

  useEffect(() => {
    fetchUsers();
  }, [sortBy]);

  const fetchUsers = async () => {
    try {
      // First get auth users to get email addresses
      const { data: profiles, error } = await pb
        .from("profiles")
        .select(`
          *,
          plans (
            name,
            price
          )
        `)
        .order(sortBy, { ascending: false });

      if (error) throw error;

      // Get auth user emails
      const usersWithEmails = await Promise.all(
        profiles.map(async (profile) => {
          try {
            const { data: authUser } = await pb.auth.admin.getUserById(profile.id);
            return {
              ...profile,
              email: authUser?.user?.email || "Unknown",
            };
          } catch {
            return {
              ...profile,
              email: "Unknown",
            };
          }
        })
      );

      setUsers(usersWithEmails);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const { error } = await pb
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;

      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));

      toast.success(`User role updated to ${newRole}`);
      if (onStatsUpdate) onStatsUpdate();
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role");
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      // Delete user profile (this should cascade delete related data due to foreign key constraints)
      const { error } = await pb
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (error) throw error;

      // Note: In production, you'd also want to delete the auth user
      // This requires admin privileges and should be done carefully

      setUsers(users.filter(user => user.id !== userId));
      toast.success("User deleted successfully");
      if (onStatsUpdate) onStatsUpdate();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      case "dj":
        return "text-green-500 bg-green-500/10 border-green-500/20";
      case "artist":
      default:
        return "text-blue-500 bg-blue-500/10 border-blue-500/20";
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return "👑";
      case "dj":
        return "🎧";
      case "artist":
      default:
        return "🎤";
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-6">User Management</h2>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-spindeck-dark rounded-lg p-6 border border-gray-800 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-600 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-600 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-600 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-semibold">User Management</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search */}
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 bg-spindeck-dark border border-gray-600 rounded-lg text-white placeholder-spindeck-gray focus:outline-none focus:border-spindeck-red"
          />
          
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-spindeck-dark border border-gray-600 rounded-lg text-white focus:outline-none focus:border-spindeck-red"
          >
            <option value="all">All Roles</option>
            <option value="artist">Artists</option>
            <option value="dj">DJs</option>
            <option value="admin">Admins</option>
          </select>
          
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-spindeck-dark border border-gray-600 rounded-lg text-white focus:outline-none focus:border-spindeck-red"
          >
            <option value="created_at">Newest First</option>
            <option value="full_name">Name A-Z</option>
            <option value="role">Role</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-spindeck-dark rounded-lg p-4 border border-gray-800">
          <p className="text-sm text-spindeck-gray">Total Users</p>
          <p className="text-2xl font-bold">{filteredUsers.length}</p>
        </div>
        <div className="bg-spindeck-dark rounded-lg p-4 border border-gray-800">
          <p className="text-sm text-spindeck-gray">Artists</p>
          <p className="text-2xl font-bold text-blue-500">
            {filteredUsers.filter(u => u.role === "artist").length}
          </p>
        </div>
        <div className="bg-spindeck-dark rounded-lg p-4 border border-gray-800">
          <p className="text-sm text-spindeck-gray">DJs</p>
          <p className="text-2xl font-bold text-green-500">
            {filteredUsers.filter(u => u.role === "dj").length}
          </p>
        </div>
        <div className="bg-spindeck-dark rounded-lg p-4 border border-gray-800">
          <p className="text-sm text-spindeck-gray">Admins</p>
          <p className="text-2xl font-bold text-red-500">
            {filteredUsers.filter(u => u.role === "admin").length}
          </p>
        </div>
      </div>

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <div className="bg-spindeck-dark rounded-lg p-12 text-center border border-gray-800">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold mb-2">No users found</h3>
          <p className="text-spindeck-gray">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="bg-spindeck-dark rounded-lg border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-spindeck-gray uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-spindeck-gray uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-spindeck-gray uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-spindeck-gray uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-spindeck-gray uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-800/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-spindeck-red rounded-full flex items-center justify-center text-white font-medium">
                          {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">
                            {user.full_name || "No name set"}
                          </div>
                          <div className="text-sm text-spindeck-gray">
                            {user.email}
                          </div>
                          {user.username && (
                            <div className="text-xs text-spindeck-gray">
                              @{user.username}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-medium border bg-transparent ${getRoleColor(user.role)}`}
                      >
                        <option value="artist">🎤 Artist</option>
                        <option value="dj">🎧 DJ</option>
                        <option value="admin">👑 Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-spindeck-gray">
                      {user.plans ? (
                        <div>
                          <div className="font-medium text-white">{user.plans.name}</div>
                          <div className="text-xs">${user.plans.price}/month</div>
                        </div>
                      ) : (
                        "No plan"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-spindeck-gray">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-red-500 hover:text-red-400 ml-3"
                        title="Delete user"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}