// components/layout/Header.jsx
import React from 'react';
import { ShoppingBag, LogOut } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx'; // Import the custom hook

const MainHeader = ({ setPage, user, onLogout, onCartClick }) => {
    const { itemCount } = useCart();

    return (
        <header className="bg-white shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div onClick={() => setPage('home')} className="text-3xl font-bold text-pink-500 tracking-wider cursor-pointer">NYKAA</div>
                    <nav className="hidden lg:flex items-center space-x-8 font-semibold text-gray-700">
                        <button onClick={() => setPage('products')} className="hover:text-pink-500">All Products</button>
                        <a href="#" className="hover:text-pink-500">Brands</a>
                    </nav>
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <span className="hidden sm:block">Hi, {user.firstName}</span>
                                <button onClick={onLogout} className="p-2 rounded-full hover:bg-gray-200"><LogOut size={20} /></button>
                            </>
                        ) : (
                            <button onClick={() => setPage('login')} className="bg-pink-500 text-white px-4 py-2 rounded-md text-sm font-semibold">Sign in</button>
                        )}
                        {/* UPDATED: Added onClick handler to open the cart sidebar */}
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
