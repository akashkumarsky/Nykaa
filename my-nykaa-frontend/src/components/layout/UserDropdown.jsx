import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const UserDropdown = ({ user, onLogout, setPage }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleNavigation = (page) => {
        setPage(page);
        setIsOpen(false); // Close dropdown after navigation
    };

    // This effect handles closing the dropdown if the user clicks outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* The button that shows the user's name and toggles the dropdown */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 p-2 rounded-md hover:bg-gray-100"
            >
                <span>Hi, {user.firstName}</span>
                <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* The dropdown menu, which is only rendered if 'isOpen' is true */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <button
                        onClick={() => handleNavigation('orders')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        My Orders
                    </button>
                    {user.role === 'ROLE_ADMIN' && (
                        <button
                            onClick={() => handleNavigation('admin')}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Admin Panel
                        </button>
                    )}
                    <button
                        onClick={onLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserDropdown;
