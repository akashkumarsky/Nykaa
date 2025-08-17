import React, { useState } from 'react';
import AdminProducts from '../components/admin/AdminProducts';
import AdminOrders from '../components/admin/AdminOrders';
import AdminUsers from '../components/admin/AdminUsers';

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('products');

    const renderContent = () => {
        switch (activeTab) {
            case 'products':
                return <AdminProducts />;
            case 'orders':
                return <AdminOrders />;
            case 'users':
                return <AdminUsers />;
            default:
                return <AdminProducts />;
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
            <div className="flex border-b mb-4">
                <button
                    onClick={() => setActiveTab('products')}
                    className={`py-2 px-4 ${activeTab === 'products' ? 'border-b-2 border-blue-500' : ''}`}
                >
                    Manage Products
                </button>
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`py-2 px-4 ${activeTab === 'orders' ? 'border-b-2 border-blue-500' : ''}`}
                >
                    Manage Orders
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`py-2 px-4 ${activeTab === 'users' ? 'border-b-2 border-blue-500' : ''}`}
                >
                    Manage Users
                </button>
            </div>
            <div>{renderContent()}</div>
        </div>
    );
};

export default AdminPage;
