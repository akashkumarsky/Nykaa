import React, { useState, useEffect } from "react";
import { api } from "../api";
import { ChevronDown, ShoppingBag } from "lucide-react";

const OrderHistoryPage = ({ setPage }) => {   // accept setPage as prop
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openOrderId, setOpenOrderId] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await api.get("/orders");
                const sortedOrders = data.sort(
                    (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
                );
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
            case "pending":
                return "bg-yellow-100 text-yellow-700 border border-yellow-300";
            case "shipped":
                return "bg-pink-100 text-pink-700 border border-pink-300";
            case "delivered":
                return "bg-green-100 text-green-700 border border-green-300";
            case "cancelled":
                return "bg-red-100 text-red-700 border border-red-300";
            default:
                return "bg-gray-100 text-gray-700 border border-gray-300";
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-10">
                <h1 className="text-3xl font-bold mb-6 text-pink-700">My Orders</h1>
                <div className="space-y-4 animate-pulse">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white p-6 rounded-xl shadow-md">
                            <div className="h-6 bg-pink-100 rounded w-1/3 mb-4"></div>
                            <div className="h-4 bg-pink-100 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12 text-red-600 bg-red-50 rounded-lg shadow-md">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="bg-pink-50 min-h-screen">
            <div className="container mx-auto px-4 py-10">
                <h1 className="text-3xl font-bold mb-8 text-pink-700">My Orders</h1>

                {orders.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl shadow-md border">
                        <ShoppingBag className="mx-auto h-12 w-12 text-pink-400" />
                        <h3 className="mt-3 text-lg font-semibold text-gray-800">
                            No orders yet
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            You haven’t placed any orders yet.
                        </p>
                        <button
                            onClick={() => setPage("home")}  // ✅ redirect to HomePage
                            className="mt-6 px-5 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition"
                        >
                            Shop Now
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white rounded-xl shadow-md border hover:shadow-lg transition"
                            >
                                {/* Order Header */}
                                <div
                                    className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 cursor-pointer hover:bg-pink-50"
                                    onClick={() => toggleOrderDetails(order.id)}
                                >
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            Order #{order.id}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Placed on {new Date(order.orderDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <p className="font-semibold text-lg text-pink-700">
                                            ₹{order.totalAmount.toFixed(2)}
                                        </p>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClasses(
                                                order.status
                                            )}`}
                                        >
                                            {order.status}
                                        </span>
                                        <ChevronDown
                                            className={`text-pink-600 transition-transform duration-300 ${openOrderId === order.id ? "rotate-180" : ""
                                                }`}
                                        />
                                    </div>
                                </div>

                                {/* Order Details */}
                                {openOrderId === order.id && (
                                    <div className="border-t border-gray-200 p-6 bg-pink-50">
                                        <div className="mb-6">
                                            <h4 className="font-semibold text-pink-700 mb-1">
                                                Shipping Address
                                            </h4>
                                            <p className="text-sm text-gray-600 whitespace-pre-line">
                                                {order.shippingAddress}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-pink-700 mb-3">Items</h4>
                                            <div className="space-y-4">
                                                {order.orderItems.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex items-center gap-4 bg-white p-3 rounded-lg border"
                                                    >
                                                        <img
                                                            src={item.product.imageUrl}
                                                            alt={item.product.name}
                                                            className="w-16 h-16 rounded-md object-cover border"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="font-medium text-gray-800">
                                                                {item.product.name}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                Qty: {item.quantity}
                                                            </p>
                                                        </div>
                                                        <p className="text-sm font-semibold text-pink-700">
                                                            ₹{item.price.toFixed(2)}
                                                        </p>
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
