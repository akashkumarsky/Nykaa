// src/components/layout/Header.jsx
import React from 'react';
import { Search, ShoppingBag, Menu, LogOut } from 'lucide-react';

const TopHeader = () => (
    <div className="bg-gray-100 text-gray-600 text-xs py-2 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto flex justify-between items-center">
            <p className="hidden sm:block">OUTSTANDING STEALS | SHOP NOW</p>
            <div className="flex items-center space-x-4">
                <a href="#" className="hover:text-pink-500">Get App</a>
                <span className="text-gray-300">|</span>
                <a href="#" className="hover:text-pink-500">Store & Events</a>
                <span className="text-gray-300">|</span>
                <a href="#" className="hover:text-pink-500">Help</a>
            </div>
        </div>
    </div>
);

const MainHeader = ({ setPage, user, onLogout }) => (
    <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
                <div className="flex items-center">
                    {/* Mobile menu button can be added back here if needed */}
                    <div onClick={() => setPage('home')} className="text-3xl font-bold text-pink-500 tracking-wider cursor-pointer">
                        NYKAA
                    </div>
                </div>
                <nav className="hidden lg:flex items-center space-x-8 font-semibold text-gray-700">
                    <a href="#" className="hover:text-pink-500">Categories</a>
                    <a href="#" className="hover:text-pink-500">Brands</a>
                    <a href="#" className="hover:text-pink-500">Luxe</a>
                </nav>
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <span className="hidden sm:block">Hi, {user.firstName}</span>
                            <button onClick={onLogout} className="bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300">
                                <LogOut size={20} />
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setPage('login')} className="bg-pink-500 text-white px-4 py-2 rounded-md text-sm font-semibold hidden sm:block">Sign in</button>
                    )}
                    <button className="relative text-gray-600 hover:text-pink-500">
                        <ShoppingBag size={24} />
                        <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">0</span>
                    </button>
                </div>
            </div>
        </div>
    </header>
);

const Header = (props) => (
    <>
        <TopHeader />
        <MainHeader {...props} />
    </>
);

export default Header;
