// src/components/ProductCard.jsx
import React from 'react';
import { Heart } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

const ProductCard = ({ product, onPreview, onProductSelect }) => {
    const { addToCart, loadingProductId } = useCart();
    const isLoading = loadingProductId === product.id;

    const handleAddToCart = (e) => {
        e.stopPropagation();
        addToCart(product.id, 1);
    };

    const handlePreviewClick = (e) => {
        e.stopPropagation();
        onPreview(product);
    };

    return (
        <div
            className="bg-white rounded-xl shadow-lg overflow-hidden transition transform hover:scale-105 hover:shadow-2xl cursor-pointer group"
            onClick={() => onProductSelect(product.id)}
        >
            <div className="relative">
                <img
                    src={product.imageUrl || 'https://placehold.co/250x250'}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-xl"
                />
                {/* Heart icon */}
                <button className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow hover:bg-pink-50 transition">
                    <Heart
                        size={18}
                        className="text-gray-400 hover:text-pink-500 hover:fill-current transition"
                    />
                </button>
                {/* Quick View overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-40 p-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={handlePreviewClick}
                        className="text-white text-xs font-semibold px-3 py-1 border border-white rounded-md hover:bg-pink-500 hover:border-pink-500 transition"
                    >
                        Quick View
                    </button>
                </div>
            </div>

            <div className="p-3 flex flex-col justify-between">
                <div className="mb-1">
                    <h3 className="font-semibold text-gray-800 text-sm truncate mb-0.5">{product.brandName}</h3>
                    <p className="text-xs text-gray-600 truncate">{product.name}</p>
                </div>
                <div>
                    <p className="text-md font-bold text-gray-900 mt-1">₹{product.price}</p>
                    <button
                        onClick={handleAddToCart}
                        disabled={isLoading}
                        className="w-full mt-2 bg-pink-500 text-white font-semibold py-1.5 rounded-md hover:bg-pink-600 disabled:bg-pink-300 transition"
                    >
                        {isLoading ? 'Adding...' : 'Add to Bag'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
