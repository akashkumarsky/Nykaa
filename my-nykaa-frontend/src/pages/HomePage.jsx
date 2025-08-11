// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../api';
// FIXED: Corrected the import path to go up two directories.
import ProductCard from '../ProductCard.jsx';

const PromoBanner = () => (
    <div className="bg-pink-50 p-4 sm:p-8">
        <div className="container mx-auto">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img src="https://placehold.co/1200x400/f8bbd0/e91e63?text=FREEDOM+SALE" alt="Freedom Sale Banner" className="w-full h-auto" />
            </div>
        </div>
    </div>
);

const ProductSection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await api.get('/products');
                setProducts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) return <div className="text-center py-12">Loading products...</div>;
    if (error) return <div className="text-center py-12 text-red-500">Error: {error}</div>;
    if (products.length === 0) return <div className="text-center py-12">No products found.</div>;

    return (
        <div className="bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-gray-800">Our Bestsellers</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};


const HomePage = () => {
    return (
        <>
            <PromoBanner />
            <ProductSection />
        </>
    );
};

export default HomePage;
