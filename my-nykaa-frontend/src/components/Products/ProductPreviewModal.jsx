// src/components/products/ProductPreviewModal.jsx
import React from 'react';
import { X } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const ProductPreviewModal = ({ product, onClose }) => {
    const { addToCart, loading } = useCart();

    if (!product) return null;

    const handleAddToCart = () => {
        addToCart(product.id, 1);
    };

    return (
        // Backdrop
        <div
            // FIXED: Updated the background class for better transparency rendering.
            className="fixed inset-0 bg-[rgba(0,0,0,0.6)] z-50 flex justify-center items-center"
            onClick={onClose}
        >
            {/* Modal Content */}
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col md:flex-row overflow-hidden" onClick={e => e.stopPropagation()}>
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-2 right-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200 z-10">
                    <X size={24} />
                </button>

                {/* Product Image */}
                <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-100 flex items-center justify-center">
                    <img src={product.imageUrl || 'https://placehold.co/400x400'} alt={product.name} className="max-h-full max-w-full object-contain" />
                </div>

                {/* Product Details */}
                <div className="w-full md:w-1/2 p-6 flex flex-col overflow-y-auto">
                    <h3 className="text-lg font-bold text-gray-500">{product.brandName}</h3>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">{product.name}</h2>
                    <p className="text-2xl font-bold text-pink-600 mb-4">₹{product.price}</p>
                    <div className="border-t pt-4 text-sm text-gray-600 space-y-2 mb-4">
                        <p>{product.description}</p>
                    </div>
                    <div className="mt-auto">
                        <button
                            onClick={handleAddToCart}
                            disabled={loading}
                            className="w-full bg-pink-500 text-white font-bold py-3 rounded-md hover:bg-pink-600 disabled:bg-pink-300"
                        >
                            {loading ? 'Adding...' : 'Add to Bag'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPreviewModal;
