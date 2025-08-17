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

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                <h1 className="text-xl font-bold text-white">Nykaa Admin</h1>
                <button
                    className="md:hidden text-gray-400 hover:text-white"
                    onClick={() => setSidebarOpen(false)}
                >
                    <X size={22} />
                </button>
            </div>
            <nav className="flex flex-col mt-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => {
                            setActiveTab(tab.key);
                            setSidebarOpen(false);
                        }}
                        className={`flex items-center gap-3 px-4 py-3 text-left transition-colors ${activeTab === tab.key
                                ? "bg-blue-600 text-white font-semibold"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white"
                            }`}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <div
                className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-gray-800 shadow-lg transform transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <SidebarContent />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Mobile Navbar */}
                <div className="md:hidden flex items-center justify-between bg-white shadow px-4 py-3 sticky top-0 z-20">
                    <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
                        <Menu size={24} />
                    </button>
                    <h2 className="text-lg font-semibold text-gray-800">
                        {tabs.find(t => t.key === activeTab)?.label}
                    </h2>
                    <div className="w-6"></div> {/* Spacer */}
                </div>

                {/* Content Area */}
                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default AdminPage;
