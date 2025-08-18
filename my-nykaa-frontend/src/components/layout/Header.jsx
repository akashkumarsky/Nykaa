// src/components/layout/Header.jsx
import React from 'react';
import { ShoppingBag, Menu } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import UserDropdown from './UserDropdown.jsx';

const MainHeader = ({ setPage, user, onLogout, onCartClick, onMenuClick, currentPage }) => {
    const { itemCount } = useCart();

    return (
        <header className="bg-white shadow-md sticky top-0 z-30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Left Section */}
                    <div className="flex items-center">
                        <button
                            onClick={onMenuClick}
                            className="lg:hidden mr-4 text-gray-600 hover:text-pink-500 transition duration-200"
                        >
                            <Menu size={24} />
                        </button>
                        <div
                            onClick={() => setPage('home')}
                            className="text-3xl font-bold text-pink-600 tracking-wider cursor-pointer hover:text-pink-700 transition"
                        >
                            NYKAA
                        </div>
                    </div>

                    {/* Nav Links */}
                    <nav className="hidden lg:flex items-center space-x-8 font-semibold text-gray-700">
                        <button
                            onClick={() => setPage('products')}
                            className={`transition duration-200 ${currentPage === 'products'
                                ? 'text-pink-600 border-b-2 border-pink-500 pb-1'
                                : 'hover:text-pink-500'
                                }`}
                        >
                            All Products
                        </button>

                        {/* Show only if user is admin */}
                        {/* Show only if user is admin */}
                        {user?.role?.toUpperCase().includes("ADMIN") && (
                            <button
                                onClick={() => setPage('admin')}
                                className={`transition duration-200 ${currentPage === 'admin'
                                        ? 'text-pink-600 border-b-2 border-pink-500 pb-1'
                                        : 'hover:text-pink-500'
                                    }`}
                            >
                                Admin Panel
                            </button>
                        )}

                    </nav>

                    {/* Right Section */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <div className="hidden sm:block">
                                <UserDropdown user={user} setPage={setPage} onLogout={onLogout} />
                            </div>
                        ) : (
                            <button
                                onClick={() => setPage('login')}
                                className="bg-pink-500 text-white px-4 py-2 rounded-2xl text-sm font-semibold hidden sm:block shadow hover:bg-pink-600 hover:shadow-md transition"
                            >
                                Sign in
                            </button>
                        )}

                        {/* Cart Icon */}
                        <button
                            onClick={onCartClick}
                            className="relative text-gray-600 hover:text-pink-500 transition"
                        >
                            <ShoppingBag size={26} />
                            {itemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                                    {itemCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

const Header = (props) => (
    <>
        {/* <TopHeader /> can be added back if needed */}
        <MainHeader {...props} />
    </>
);

export default Header;
