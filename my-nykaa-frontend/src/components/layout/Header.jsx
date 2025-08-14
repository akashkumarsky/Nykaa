// src/components/layout/Header.jsx
import React from 'react';
import { ShoppingBag, Menu } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import UserDropdown from './UserDropdown.jsx'; // Import the new component

const MainHeader = ({ setPage, user, onLogout, onCartClick, onMenuClick }) => {
    const { itemCount } = useCart();

    return (
        <header className="bg-white shadow-md sticky top-0 z-30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center">
                        <button onClick={onMenuClick} className="lg:hidden mr-4 text-gray-600">
                            <Menu size={24} />
                        </button>
                        <div onClick={() => setPage('home')} className="text-3xl font-bold text-pink-500 tracking-wider cursor-pointer">NYKAA</div>
                    </div>
                    <nav className="hidden lg:flex items-center space-x-8 font-semibold text-gray-700">
                        <button onClick={() => setPage('products')} className="hover:text-pink-500">All Products</button>
                        <a href="#" className="hover:text-pink-500">Brands</a>
                    </nav>
                    <div className="flex items-center space-x-4">
                        {/* UPDATED: Replaced the simple text with the new UserDropdown component */}
                        {user ? (
                            <div className="hidden sm:block">
                                <UserDropdown user={user} setPage={setPage} onLogout={onLogout} />
                            </div>
                        ) : (
                            <button onClick={() => setPage('login')} className="bg-pink-500 text-white px-4 py-2 rounded-md text-sm font-semibold hidden sm:block">Sign in</button>
                        )}
                        <button onClick={onCartClick} className="relative text-gray-600 hover:text-pink-500">
                            <ShoppingBag size={24} />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
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