import React, { useState } from "react";
import AdminProducts from "../components/admin/AdminProducts";
import AdminOrders from "../components/admin/AdminOrders";
import AdminUsers from "../components/admin/AdminUsers";
import AdminCategories from "../components/admin/AdminCategories";
import AdminBrands from "../components/admin/AdminBrands";
import { Menu, X, Package, ShoppingCart, Users, LayoutGrid, Award } from "lucide-react";

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState("products");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const tabs = [
        { key: "products", label: "Products", icon: <Package size={20} /> },
        { key: "orders", label: "Orders", icon: <ShoppingCart size={20} /> },
        { key: "users", label: "Users", icon: <Users size={20} /> },
        { key: "categories", label: "Categories", icon: <LayoutGrid size={20} /> },
        { key: "brands", label: "Brands", icon: <Award size={20} /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "products":
                return <AdminProducts />;
            case "orders":
                return <AdminOrders />;
            case "users":
                return <AdminUsers />;
            case "categories":
                return <AdminCategories />;
            case "brands":
                return <AdminBrands />;
            default:
                return <AdminProducts />;
        }
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-pink-300 flex items-center justify-between bg-pink-600">
                <h1 className="text-xl font-bold text-white">Nykaa Admin</h1>
                <button
                    className="md:hidden text-pink-100 hover:text-white"
                    onClick={() => setSidebarOpen(false)}
                >
                    <X size={22} />
                </button>
            </div>

            {/* Sidebar Tabs */}
            <nav className="flex flex-col mt-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => {
                            setActiveTab(tab.key);
                            setSidebarOpen(false);
                        }}
                        className={`flex items-center gap-3 px-4 py-3 text-left transition-colors rounded-md mx-2 mb-2 ${activeTab === tab.key
                                ? "bg-pink-500 text-white font-semibold shadow-md"
                                : "text-gray-700 hover:bg-pink-100 hover:text-pink-600"
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
        <div className="flex min-h-screen bg-pink-50">
            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <div
                className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-pink-200 shadow-lg transform transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <SidebarContent />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Mobile Navbar */}
                <div className="md:hidden flex items-center justify-between bg-pink-600 text-white shadow px-4 py-3 sticky top-0 z-20">
                    <button onClick={() => setSidebarOpen(true)} className="text-white">
                        <Menu size={24} />
                    </button>
                    <h2 className="text-lg font-semibold">
                        {tabs.find((t) => t.key === activeTab)?.label}
                    </h2>
                    <div className="w-6"></div> {/* Spacer */}
                </div>

                {/* Content Area */}
                <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-white rounded-tl-2xl shadow-inner">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default AdminPage;
