// src/components/ProductCard.jsx
import React from 'react';
import { Heart } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

const ProductCard = ({ product, onPreview, onProductSelect }) => {
    const { addToCart, loading } = useCart();

    const handleAddToCart = (e) => {
        e.stopPropagation(); // Prevents the main card click event
        addToCart(product.id, 1);
    };

    const handlePreviewClick = (e) => {
        e.stopPropagation(); // Prevents the main card click event
        onPreview(product);
    };

    return (
        <div
            className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-xl group cursor-pointer"
            onClick={() => onProductSelect(product.id)} // Main click handler for navigation
        >
            <div className="relative">
                <img src={product.imageUrl || 'https://placehold.co/250x250'} alt={product.name} className="w-full h-48 object-cover" />
                <button className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md">
                    <Heart size={20} className="text-gray-400 hover:text-pink-500 hover:fill-current" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={handlePreviewClick}
                        className="text-white text-sm font-semibold"
                    >
                        Quick View
                    </button>
                </div>
            </div>
            <div className="p-4 flex flex-col">
                <h3 className="font-bold text-gray-800 truncate">{product.brandName}</h3>
                <p className="text-sm text-gray-600 truncate h-10">{product.name}</p>
                <p className="text-lg font-bold text-gray-900 mt-2">₹{product.price}</p>
                <button
                    onClick={handleAddToCart}
                    disabled={loading}
                    className="w-full mt-3 bg-pink-500 text-white font-semibold py-2 rounded-md hover:bg-pink-600 disabled:bg-pink-300"
                >
                    {loading ? 'Adding...' : 'Add to Bag'}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
