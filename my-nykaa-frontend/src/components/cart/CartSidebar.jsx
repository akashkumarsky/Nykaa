// src/components/cart/CartSidebar.jsx
import React, { useEffect } from 'react';
import { useCart } from '../../context/CartContext.jsx';
import { X, Trash2, Plus, Minus } from 'lucide-react';

const CartSidebar = ({ isOpen, onClose, setPage }) => {
    const { cart, itemCount, loading, updateItemQuantity, removeItem } = useCart();

    // Sort items by ID for stable rendering
    const sortedItems = cart?.cartItems?.slice().sort((a, b) => a.id - b.id) || [];

    const subtotal = sortedItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity, 0
    );

    const handleCheckout = () => {
        onClose();
        setPage('checkout');
    };

    // Close sidebar on ESC key
    useEffect(() => {
        const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-[rgba(0,0,0,0.5)] z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            ></div>

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl transform transition-transform z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-lg font-semibold">Shopping Bag ({itemCount})</h2>
                        <button onClick={onClose}><X size={24} /></button>
                    </div>

                    {/* Body */}
                    {loading && <p className="p-4 text-center">Loading Cart...</p>}

                    {!loading && sortedItems.length === 0 ? (
                        <div className="flex-grow flex flex-col items-center justify-center p-4">
                            <p className="text-gray-500">Your shopping bag is empty.</p>
                        </div>
                    ) : (
                        <div className="flex-grow overflow-y-auto p-4 space-y-4">
                            {sortedItems.map(item => (
                                <div key={item.id} className="flex items-center gap-4">
                                    <img
                                        src={item.product.imageUrl || 'https://placehold.co/100x100'}
                                        alt={item.product.name}
                                        className="w-20 h-20 object-cover rounded-md border"
                                    />
                                    <div className="flex-grow">
                                        <p className="font-semibold text-sm">{item.product.brandName}</p>
                                        <p className="text-sm text-gray-600 truncate">{item.product.name}</p>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-2 mt-1">
                                            <button
                                                onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                                className="px-3 py-1 bg-pink-500 text-white font-bold rounded-md hover:bg-pink-600 disabled:bg-pink-300"
                                                disabled={item.quantity <= 1 || loading}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-8 text-center font-bold text-pink-600">{item.quantity}</span>
                                            <button
                                                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                                className="px-3 py-1 bg-pink-500 text-white font-bold rounded-md hover:bg-pink-600 disabled:bg-pink-300"
                                                disabled={loading}
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Price & Remove */}
                                    <div className="flex flex-col items-end">
                                        <p className="font-semibold text-sm">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-red-500 hover:text-red-700 mt-2"
                                            disabled={loading}
                                            title="Remove item"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Footer */}
                    <div className="p-4 border-t bg-gray-50">
                        <div className="flex justify-between font-semibold mb-4 text-lg">
                            <span>Subtotal</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            disabled={sortedItems.length === 0 || loading}
                            className="w-full bg-pink-500 text-white font-bold py-3 rounded-md hover:bg-pink-600 disabled:bg-pink-300"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartSidebar;
