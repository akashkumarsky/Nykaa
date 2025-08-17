import React, { useState } from "react";
import AdminProducts from "../components/admin/AdminProducts";
import AdminOrders from "../components/admin/AdminOrders";
import AdminUsers from "../components/admin/AdminUsers";
import { Menu, X, Package, ShoppingCart, Users } from "lucide-react";

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState("products");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const tabs = [
        { key: "products", label: "Products", icon: <Package size={20} /> },
        { key: "orders", label: "Orders", icon: <ShoppingCart size={20} /> },
        { key: "users", label: "Users", icon: <Users size={20} /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "products":
                return <AdminProducts />;
            case "orders":
                return <AdminOrders />;
            case "users":
                return <AdminUsers />;
            default:
                return <AdminProducts />;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div
                className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 md:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                {/* Sidebar Header */}
                <div className="p-4 border-b flex items-center justify-between">
                    <h1 className="text-xl font-bold text-blue-600">Admin Panel</h1>
                    <button
                        className="md:hidden text-gray-600"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* Sidebar Links */}
                <nav className="flex flex-col mt-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => {
                                setActiveTab(tab.key);
                                setSidebarOpen(false);
                            }}
                            className={`flex items-center gap-2 px-4 py-3 text-left transition-colors ${activeTab === tab.key
                                    ? "bg-blue-500 text-white font-semibold"
                                    : "text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Mobile Navbar */}
                <div className="md:hidden flex items-center justify-between bg-white shadow px-4 py-3">
                    <button onClick={() => setSidebarOpen(true)}>
                        <Menu size={24} />
                    </button>
                    <h2 className="text-lg font-semibold text-blue-600">Admin Panel</h2>
                </div>

                {/* Content Area */}
                <main className="flex-1 p-4 md:p-6 overflow-y-auto">
                    <div className="bg-white shadow rounded-2xl p-6 min-h-[80vh]">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminPage;
