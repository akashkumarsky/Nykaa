// src/components/products/FilterModal.jsx
import React from 'react';
import { X } from 'lucide-react';

const FilterModal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                // FIXED: Changed the background class for better transparency.
                className={`fixed inset-0 bg-[rgba(0,0,0,0.5)] z-40 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            ></div>
            {/* Modal */}
            <div
                className={`fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white shadow-xl transform transition-transform z-50 md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-lg font-semibold">Filters</h2>
                        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
                            <X size={24} />
                        </button>
                    </div>
                    <div className="flex-grow overflow-y-auto">
                        {children}
                    </div>
                    <div className="p-4 border-t bg-gray-50">
                        <button
                            onClick={onClose}
                            className="w-full bg-pink-500 text-white font-bold py-3 rounded-md hover:bg-pink-600"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FilterModal;
