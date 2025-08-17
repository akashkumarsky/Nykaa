import React, { useEffect } from 'react';
import { useCart } from '../../context/CartContext.jsx';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

const CartSidebar = ({ isOpen, onClose, setPage }) => {
    const { cart, itemCount, loading, updateItemQuantity, removeItem } = useCart();

    const sortedItems = cart?.cartItems?.slice().sort((a, b) => a.id - b.id) || [];

    const subtotal = sortedItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity, 0
    );

    const handleCheckout = () => {
        onClose();
        setPage('checkout');
    };

    useEffect(() => {
        const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-40' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex justify-between items-center p-5 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">Shopping Bag ({itemCount})</h2>
                        <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Body */}
                    {loading && (
                        <div className="flex-grow flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-pink-500 border-t-transparent"></div>
                        </div>
                    )}

                    {!loading && sortedItems.length === 0 ? (
                        <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
                            <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-800">Your bag is empty</h3>
                            <p className="text-gray-500 mt-1">Looks like you haven't added anything yet.</p>
                        </div>
                    ) : (
                        <div className="flex-grow overflow-y-auto p-5 space-y-5">
                            {sortedItems.map(item => (
                                <div key={item.id} className="flex items-start gap-4">
                                    <img
                                        src={item.product.imageUrl || 'https://placehold.co/100x100'}
                                        alt={item.product.name}
                                        className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                                    />
                                    <div className="flex-grow flex flex-col h-24">
                                        <div>
                                            <p className="font-semibold text-gray-800">{item.product.brandName}</p>
                                            <p className="text-sm text-gray-600 line-clamp-2">{item.product.name}</p>
                                        </div>
                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                                    className="p-1.5 bg-gray-200 text-gray-700 font-bold rounded-md hover:bg-gray-300 disabled:opacity-50"
                                                    disabled={item.quantity <= 1 || loading}
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="w-8 text-center font-bold text-gray-800">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                                    className="p-1.5 bg-gray-200 text-gray-700 font-bold rounded-md hover:bg-gray-300 disabled:opacity-50"
                                                    disabled={loading}
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-800">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-red-500 hover:text-red-700 text-xs font-medium mt-1"
                                                    disabled={loading}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Footer */}
                    {sortedItems.length > 0 && (
                        <div className="p-5 border-t border-gray-200 bg-white">
                            <div className="flex justify-between font-semibold mb-4 text-lg text-gray-800">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={loading}
                                className="w-full bg-pink-500 text-white font-bold py-3 rounded-lg hover:bg-pink-600 transition-colors disabled:bg-pink-300"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CartSidebar;
