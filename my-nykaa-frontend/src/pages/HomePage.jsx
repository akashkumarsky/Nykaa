import React, { useState, useEffect } from 'react';
import { api } from '../api';
import ProductCard from '../components/ProductCard.jsx';
import Pagination from '../components/ui/Pagination.jsx'; // Import the Pagination component

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

    // NEW: State for pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // UPDATED: Fetch products based on the current page
                const data = await api.get(`/products?page=${currentPage}&size=8`);
                if (data && data.content) {
                    setProducts(data.content);
                    setTotalPages(data.totalPages);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [currentPage]); // Re-run this effect when the currentPage changes

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (error) return <div className="text-center py-12 text-red-500">Error: {error}</div>;

    return (
        <div className="bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-gray-800">Our Bestsellers</h2>
                {loading ? (
                    <div className="text-center">Loading products...</div>
                ) : products.length === 0 ? (
                    <div className="text-center">No products found.</div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                        {/* NEW: Render the Pagination component */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
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
