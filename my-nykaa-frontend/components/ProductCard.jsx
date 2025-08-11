// src/components/ProductCard.jsx
import React from 'react';
import { Heart } from 'lucide-react';

const ProductCard = ({ product }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-xl group">
            <div className="relative">
                <img src={product.imageUrl || 'https://placehold.co/250x250/fde4e4/e91e63?text=Product'} alt={product.name} className="w-full h-48 object-cover" />
                <button className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md">
                    <Heart size={20} className="text-gray-400 hover:text-pink-500 hover:fill-current" />
                </button>
            </div>
            <div className="p-4">
                <h3 className="font-bold text-gray-800 truncate">{product.brandName}</h3>
                <p className="text-sm text-gray-600 truncate h-10">{product.name}</p>
                <p className="text-lg font-bold text-gray-900 mt-2">₹{product.price}</p>
                <button className="w-full mt-3 bg-pink-500 text-white font-semibold py-2 rounded-md hover:bg-pink-600 transition-colors opacity-0 group-hover:opacity-100">
                    Add to Bag
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
