// src/pages/OrderHistoryPage.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../api';

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openAddressId, setOpenAddressId] = useState(null); // track open address

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

    const formatOrderId = (id) => {
        const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase(); // 4 chars
        return `ORD-${id.toString().padStart(4, '0')}-${randomPart}`; // total length ~ 10
    };

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

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6 text-center">My Orders</h1>
                <div className="space-y-4 animate-pulse">
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="bg-white p-6 rounded-xl shadow">
                            <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) return <div className="text-center py-12 text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">My Orders</h1>
            {orders.length === 0 ? (
                <p className="text-gray-500">You haven't placed any orders yet.</p>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div
                            key={order.id}
                            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all duration-300"
                        >
                            {/* Order Header */}
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b pb-4 mb-4 gap-4">
                                <div className="space-y-1">
                                    <p className="font-semibold text-lg">
                                        Order ID : #{formatOrderId(order.id)}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Placed on: {new Date(order.orderDate).toLocaleDateString()}
                                    </p>

                                    {order.shippingAddress && (
                                        <>
                                            <button
                                                onClick={() =>
                                                    setOpenAddressId(openAddressId === order.id ? null : order.id)
                                                }
                                                className="mt-2 text-blue-600 hover:underline text-sm font-medium"
                                            >
                                                {openAddressId === order.id ? 'Hide Address' : 'View Address'}
                                            </button>

                                            <div
                                                className={`overflow-hidden transition-all duration-300 ease-in-out ${openAddressId === order.id
                                                    ? 'max-h-40 opacity-100 mt-2'
                                                    : 'max-h-0 opacity-0'
                                                    }`}
                                            >
                                                <div className="text-sm p-3 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
                                                    <p className="font-medium text-gray-700 mb-1">Shipping Address</p>
                                                    <p className="whitespace-pre-line text-gray-600 leading-relaxed">
                                                        {order.shippingAddress}
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="text-right space-y-2">
                                    <p className="font-semibold text-xl text-gray-800">₹{order.totalAmount.toFixed(2)}</p>
                                    <span
                                        className={`inline-block px-4 py-1 rounded-full text-xs font-semibold ${getStatusClasses(order.status)}`}
                                    >
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            {/* Items Grid */}
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {order.orderItems.map(item => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg transition"
                                    >
                                        <img
                                            src={item.product.imageUrl}
                                            alt={item.product.name}
                                            className="w-16 h-16 rounded-lg object-cover"
                                        />
                                        <div>
                                            <p className="font-medium text-gray-800">{item.product.name}</p>
                                            <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
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
