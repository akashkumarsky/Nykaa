import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { ChevronDown, ShoppingBag } from 'lucide-react';

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openOrderId, setOpenOrderId] = useState(null);

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

    const toggleOrderDetails = (orderId) => {
        setOpenOrderId(openOrderId === orderId ? null : orderId);
    };

    const getStatusClasses = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'shipped': return 'bg-blue-100 text-blue-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">My Orders</h1>
                <div className="space-y-4 animate-pulse">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
                            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="text-center py-12 text-red-500 bg-red-50 rounded-lg">Error: {error}</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">My Orders</h1>
                {orders.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                        <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No orders yet</h3>
                        <p className="mt-1 text-sm text-gray-500">You haven't placed any orders with us.</p>
                        {/* Optional: Add a "Shop Now" button here */}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map(order => (
                            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 cursor-pointer hover:bg-gray-50" onClick={() => toggleOrderDetails(order.id)}>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-800">Order #{order.id}</p>
                                        <p className="text-sm text-gray-500">
                                            Placed on: {new Date(order.orderDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <p className="font-semibold text-lg text-gray-800">₹{order.totalAmount.toFixed(2)}</p>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClasses(order.status)}`}>
                                            {order.status}
                                        </span>
                                        <ChevronDown className={`transition-transform ${openOrderId === order.id ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>

                                {openOrderId === order.id && (
                                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                                        <div className="mb-4">
                                            <h4 className="font-semibold text-gray-700">Shipping Address</h4>
                                            <p className="text-sm text-gray-600 whitespace-pre-line">{order.shippingAddress}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-700 mb-2">Items</h4>
                                            <div className="space-y-3">
                                                {order.orderItems.map(item => (
                                                    <div key={item.id} className="flex items-center gap-4">
                                                        <img
                                                            src={item.product.imageUrl}
                                                            alt={item.product.name}
                                                            className="w-16 h-16 rounded-md object-cover border"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="font-medium text-gray-800">{item.product.name}</p>
                                                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                                        </div>
                                                        <p className="text-sm font-medium text-gray-700">₹{item.price.toFixed(2)}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistoryPage;
