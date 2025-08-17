import React, { useState, useEffect } from 'react';
import { api } from '../../api';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userRoles = ['ROLE_USER', 'ROLE_ADMIN'];

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const data = await api.get('/users');
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
            const updatedUser = await api.put(`/users/${userId}/role`, { role: newRole });
            setUsers(users.map(user => user.id === userId ? updatedUser : user));
        } catch (err) {
            console.error("Failed to update user role:", err);
        }
    };

    if (loading) {
        return <div>Loading users...</div>;
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Manage Users</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">User ID</th>
                            <th className="py-2 px-4 border-b">Name</th>
                            <th className="py-2 px-4 border-b">Email</th>
                            <th className="py-2 px-4 border-b">Role</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td className="py-2 px-4 border-b text-center">{user.id}</td>
                                    <td className="py-2 px-4 border-b text-center">{`${user.firstName} ${user.lastName}`}</td>
                                    <td className="py-2 px-4 border-b text-center">{user.email}</td>
                                    <td className="py-2 px-4 border-b text-center">{user.role}</td>
                                    <td className="py-2 px-4 border-b text-center">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            className="p-2 border rounded"
                                        >
                                            {userRoles.map(role => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="py-4 px-4 border-b text-center">No users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsers;
