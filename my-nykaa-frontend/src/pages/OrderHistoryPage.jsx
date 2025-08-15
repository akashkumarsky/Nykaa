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
                const sortedOrders = data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
                setOrders(sortedOrders);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusClasses = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
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
                            {/* Order Header */}
                            <div className="flex justify-between items-start border-b pb-3 mb-3">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <p className="font-semibold">Order #{order.id}</p>
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusClasses(order.status)}`}
                                        >
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        Placed on: {new Date(order.orderDate).toLocaleDateString()}
                                    </p>

                                    {order.shippingAddress && (
                                        <div className="mt-2 text-sm border rounded-md p-2 bg-gray-50">
                                            <p className="font-medium text-gray-700">Shipping Address:</p>
                                            <p className="whitespace-pre-line">{order.shippingAddress}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">Total: ₹{order.totalAmount.toFixed(2)}</p>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="space-y-2">
                                {order.orderItems.map(item => (
                                    <div key={item.id} className="flex items-center gap-4 text-sm">
                                        <img
                                            src={item.product.imageUrl}
                                            alt={item.product.name}
                                            className="w-16 h-16 rounded object-cover"
                                        />
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
