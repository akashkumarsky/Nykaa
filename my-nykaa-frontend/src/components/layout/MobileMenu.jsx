// src/components/layout/MobileMenu.jsx
import React from 'react';
import { X } from 'lucide-react';

const MobileMenu = ({ isOpen, onClose, setPage, user, onLogout }) => {
    const handleNavigation = (page) => {
        setPage(page);
        onClose(); // Close the menu after navigation
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-[rgba(0,0,0,0.5)] z-40 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            ></div>

            {/* Menu */}
            <div
                className={`fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white shadow-xl transform transition-transform z-50 lg:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex justify-between items-center p-4 border-b">
                    <div className="text-2xl font-bold text-pink-500">NYKAA</div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex flex-col p-4 space-y-4 text-gray-700 font-semibold">
                    <button onClick={() => handleNavigation('products')} className="text-left">All Products</button>

                    {user && (
                        <>
                            <button onClick={() => handleNavigation('orders')} className="text-left">My Orders</button>

                            {/* ✅ Show Admin Panel if user is admin */}
                            {user.role === 'ROLE_ADMIN' && (
                                <button
                                    onClick={() => handleNavigation('admin')}
                                    className="text-left bg-pink-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-pink-600 transition"
                                >
                                    Admin Panel
                                </button>
                            )}

                        </>
                    )}

                    <a href="#" className="text-left">Brands</a>
                    <a href="#" className="text-left">Luxe</a>
                </nav>

                <div className="mt-auto p-4 border-t">
                    {user ? (
                        <div className="flex items-center justify-between">
                            <span>Hi, {user.firstName}</span>
                            <button onClick={onLogout} className="font-semibold text-pink-500">Logout</button>
                        </div>
                    ) : (
                        <button
                            onClick={() => handleNavigation('login')}
                            className="w-full bg-pink-500 text-white font-bold py-2 rounded-md"
                        >
                            Sign In
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default MobileMenu;
