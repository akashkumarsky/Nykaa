import React, { useState, useEffect } from "react";
import { api } from "../../api";
import Pagination from "../ui/Pagination";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [usersPerPage] = useState(12);

    const userRoles = ["ROLE_USER", "ROLE_ADMIN"];

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const data = await api.get("/users");
                const sortedUsers = data.sort((a, b) => b.id - a.id);
                setUsers(sortedUsers);
                setError(null);
            } catch (err) {
                setError(err.message);
                console.error("Failed to fetch users:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        try {
            const updatedUser = await api.put(`/users/${userId}/role`, {
                role: newRole,
            });
            setUsers(users.map((user) => (user.id === userId ? updatedUser : user)));
        } catch (err) {
            console.error("Failed to update user role:", err);
        }
    };

    const getRoleClasses = (role) => {
        return role === "ROLE_ADMIN"
            ? "bg-pink-200 text-pink-900"
            : "bg-pink-100 text-pink-700";
    };

    // Pagination Logic
    const indexOfFirstUser = currentPage * usersPerPage;
    const indexOfLastUser = indexOfFirstUser + usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(users.length / usersPerPage);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10 bg-pink-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-pink-700">An Error Occurred</h3>
                <p className="text-pink-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-pink-50 p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <h2 className="text-2xl font-bold text-pink-900">Manage Users</h2>
            </div>

            {/* Table View (for medium screens and up) */}
            <div className="hidden md:block overflow-x-auto shadow rounded-lg bg-white">
                <table className="min-w-full">
                    <thead className="bg-pink-500 text-white">
                        <tr>
                            <th className="py-3 px-4 text-left">User ID</th>
                            <th className="py-3 px-4 text-left">Name</th>
                            <th className="py-3 px-4 text-left">Email</th>
                            <th className="py-3 px-4 text-center">Role</th>
                            <th className="py-3 px-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.length > 0 ? (
                            currentUsers.map((user, index) => (
                                <tr
                                    key={user.id}
                                    className={`hover:bg-pink-50 ${index % 2 === 0 ? "bg-pink-100" : "bg-white"
                                        }`}
                                >
                                    <td className="py-3 px-4 font-medium">#{user.id}</td>
                                    <td className="py-3 px-4">{`${user.firstName} ${user.lastName}`}</td>
                                    <td className="py-3 px-4">{user.email}</td>
                                    <td className="py-3 px-4 text-center">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleClasses(
                                                user.role
                                            )}`}
                                        >
                                            {user.role.replace("ROLE_", "")}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <div className="relative inline-block max-w-[10rem] w-full">
                                            <select
                                                value={user.role}
                                                onChange={(e) =>
                                                    handleRoleChange(user.id, e.target.value)
                                                }
                                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-pink-400 bg-white truncate"
                                            >
                                                {userRoles.map((role) => (
                                                    <option key={role} value={role}>
                                                        {role.replace("ROLE_", "")}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="py-6 text-center text-pink-500 italic"
                                >
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Card View (for small screens) */}
            <div className="grid gap-4 md:hidden">
                {currentUsers.map((user) => (
                    <div
                        key={user.id}
                        className="bg-white shadow rounded-lg p-4 border border-pink-200 flex flex-col"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="font-semibold text-lg text-pink-900">{`${user.firstName} ${user.lastName}`}</p>
                                <p className="text-sm text-pink-500">ID: {user.id}</p>
                            </div>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleClasses(
                                    user.role
                                )}`}
                            >
                                {user.role.replace("ROLE_", "")}
                            </span>
                        </div>
                        <p className="text-pink-700">{user.email}</p>
                        <div className="mt-auto pt-3">
                            <label className="block text-sm font-medium text-pink-700 mb-1">
                                Update Role
                            </label>
                            <div className="relative w-full max-w-full">
                                <select
                                    value={user.role}
                                    onChange={(e) =>
                                        handleRoleChange(user.id, e.target.value)
                                    }
                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-pink-400 bg-white truncate"
                                >
                                    {userRoles.map((role) => (
                                        <option key={role} value={role}>
                                            {role.replace("ROLE_", "")}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default AdminUsers;
