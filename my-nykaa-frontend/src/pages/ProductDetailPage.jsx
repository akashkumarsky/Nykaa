// src/pages/ProductDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { useCart } from '../context/CartContext.jsx';
import { ArrowLeft } from 'lucide-react';

const ProductDetailPage = ({ productId, setPage }) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart, loading: cartLoading } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            if (!productId) return;
            setLoading(true);
            try {
                const data = await api.get(`/products/${productId}`);
                setProduct(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    const handleAddToCart = () => {
        if (product) {
            addToCart(product.id, 1);
        }
    };

    if (loading) return <div className="text-center py-20">Loading Product...</div>;
    if (error) return <div className="text-center py-20 text-red-500">Error: {error}</div>;
    if (!product) return <div className="text-center py-20">Product not found.</div>;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <button onClick={() => setPage('products')} className="flex items-center gap-2 text-sm text-gray-600 hover:text-pink-500 mb-4">
                <ArrowLeft size={16} />
                Back to All Products
            </button>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
                {/* Product Image */}
                <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center p-4">
                    <img src={product.imageUrl || 'https://placehold.co/500x500'} alt={product.name} className="max-h-full max-w-full object-contain" />
                </div>

                {/* Product Details */}
                <div className="w-full md:w-1/2 p-6 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-500">{product.brandName}</h3>
                    <h1 className="text-3xl font-semibold text-gray-800 mb-2">{product.name}</h1>
                    <p className="text-3xl font-bold text-pink-600 mb-4">₹{product.price}</p>
                    <div className="border-t pt-4 text-sm text-gray-700 space-y-2 mb-4">
                        <p>{product.description}</p>
                    </div>
                    <div className="mt-auto">
                        <button
                            onClick={handleAddToCart}
                            disabled={cartLoading}
                            className="w-full bg-pink-500 text-white font-bold py-3 rounded-md hover:bg-pink-600 disabled:bg-pink-300"
                        >
                            {cartLoading ? 'Adding...' : 'Add to Bag'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
