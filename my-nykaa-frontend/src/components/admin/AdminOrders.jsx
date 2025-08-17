import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import Pagination from '../ui/Pagination';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [ordersPerPage] = useState(12);

    const orderStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const data = await api.get('/orders/all');
                const sortedOrders = data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
                setOrders(sortedOrders);
                setError(null);
            } catch (err) {
                setError(err.message);
                console.error("Failed to fetch orders:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const updatedOrder = await api.put(`/orders/${orderId}/status`, { status: newStatus });
            setOrders(orders.map(order => order.id === orderId ? updatedOrder : order));
        } catch (err) {
            console.error("Failed to update order status:", err);
        }
    };

    const getStatusClasses = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'processing':
                return 'bg-indigo-100 text-indigo-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const indexOfFirstOrder = currentPage * ordersPerPage;
    const indexOfLastOrder = indexOfFirstOrder + ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(orders.length / ordersPerPage);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10 bg-red-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-red-700">An Error Occurred</h3>
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Manage Orders</h2>
            </div>

            {/* Table View (for medium screens and up) */}
            <div className="hidden md:block overflow-x-auto shadow rounded-lg bg-white">
                <table className="min-w-full">
                    <thead className="bg-blue-500 text-white">
                        <tr>
                            <th className="py-3 px-4 text-left">Order ID</th>
                            <th className="py-3 px-4 text-left">Customer</th>
                            <th className="py-3 px-4 text-left">Date</th>
                            <th className="py-3 px-4 text-left">Total</th>
                            <th className="py-3 px-4 text-center">Status</th>
                            <th className="py-3 px-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentOrders.length > 0 ? (
                            currentOrders.map((order, index) => (
                                <tr key={order.id} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                    <td className="py-3 px-4 font-medium">#{order.id}</td>
                                    <td className="py-3 px-4">{`${order.user.firstName} ${order.user.lastName}`}</td>
                                    <td className="py-3 px-4">{new Date(order.orderDate).toLocaleDateString()}</td>
                                    <td className="py-3 px-4">₹{order.totalAmount.toFixed(2)}</td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClasses(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className="p-2 border rounded-md focus:ring-2 focus:ring-blue-400 bg-white"
                                        >
                                            {orderStatuses.map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="py-6 text-center text-gray-500 italic">No orders found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Card View (for small screens) */}
            <div className="grid gap-4 md:hidden">
                {currentOrders.map(order => (
                    <div key={order.id} className="bg-white shadow rounded-lg p-4 border flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="font-bold text-lg">Order #{order.id}</p>
                                <p className="text-sm text-gray-600">{`${order.user.firstName} ${order.user.lastName}`}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClasses(order.status)}`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm">Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                        <p className="text-xl font-semibold my-2">Total: ₹{order.totalAmount.toFixed(2)}</p>
                        <div className="mt-auto">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
                            <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400 bg-white"
                            >
                                {orderStatuses.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
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

export default AdminOrders;
