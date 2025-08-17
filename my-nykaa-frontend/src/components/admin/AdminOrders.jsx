import React, { useState, useEffect } from 'react';
import { api } from '../../api';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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


    if (loading) {
        return <div>Loading orders...</div>;
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Manage Orders</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Order ID</th>
                            <th className="py-2 px-4 border-b">Customer Name</th>
                            <th className="py-2 px-4 border-b">Date</th>
                            <th className="py-2 px-4 border-b">Total</th>
                            <th className="py-2 px-4 border-b">Status</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <tr key={order.id}>
                                    <td className="py-2 px-4 border-b text-center">{order.id}</td>
                                    <td className="py-2 px-4 border-b text-center">{`${order.user.firstName} ${order.user.lastName}`}</td>
                                    <td className="py-2 px-4 border-b text-center">{new Date(order.orderDate).toLocaleDateString()}</td>
                                    <td className="py-2 px-4 border-b text-center">${order.totalAmount.toFixed(2)}</td>
                                    <td className="py-2 px-4 border-b text-center">{order.status}</td>
                                    <td className="py-2 px-4 border-b text-center">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className="p-2 border rounded"
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
                                <td colSpan="6" className="py-4 px-4 border-b text-center">No orders found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrders;
