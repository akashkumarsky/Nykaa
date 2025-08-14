// src/pages/OrderHistoryPage.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../api';

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await api.get('/orders');
                setOrders(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="text-center py-12">Loading your orders...</div>;
    if (error) return <div className="text-center py-12 text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">My Orders</h1>
            {orders.length === 0 ? (
                <p className="text-gray-500">You haven't placed any orders yet.</p>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white p-6 rounded-lg shadow">
                            <div className="flex justify-between items-center border-b pb-3 mb-3">
                                <div>
                                    <p className="font-semibold">Order #{order.id}</p>
                                    <p className="text-sm text-gray-500">
                                        Placed on: {new Date(order.orderDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">Total: ₹{order.totalAmount.toFixed(2)}</p>
                                    <p className="text-sm text-gray-500">Status: {order.status}</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                {order.orderItems.map(item => (
                                    <div key={item.id} className="flex items-center gap-4 text-sm">
                                        <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 rounded object-cover" />
                                        <div>
                                            <p className="font-semibold">{item.product.name}</p>
                                            <p className="text-gray-600">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistoryPage;
