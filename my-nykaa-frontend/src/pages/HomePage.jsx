import React, { useState, useEffect } from 'react';
import { api } from '../api';
import ProductGrid from '../components/Products/ProductGrid.jsx'; // Updated path
import Pagination from '../components/ui/Pagination.jsx';

const PromoBanner = () => (
    <div className="bg-pink-50 p-4 sm:p-8">
        <div className="container mx-auto">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img src="https://placehold.co/1200x400/f8bbd0/e91e63?text=FREEDOM+SALE" alt="Freedom Sale Banner" className="w-full h-auto" />
            </div>
        </div>
    </div>
);

// UPDATED: ProductSection now accepts onPreview and onProductSelect props
const ProductSection = ({ onPreview, onProductSelect }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
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
    }, [currentPage]);

    if (error) return <div className="text-center py-12 text-red-500">Error: {error}</div>;

    return (
        <div className="bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-gray-800">Our Bestsellers</h2>
                {loading ? (
                    <div className="text-center">Loading products...</div>
                ) : (
                    <>
                        {/* UPDATED: Pass the functions down to the ProductGrid */}
                        <ProductGrid 
                            products={products} 
                            onPreview={onPreview} 
                            onProductSelect={onProductSelect} 
                        />
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

// UPDATED: HomePage now accepts and passes down the necessary props
const HomePage = ({ setPage, setSelectedProductId }) => {
    const [previewProduct, setPreviewProduct] = useState(null); // State for the modal

    const handleProductSelect = (id) => {
        setSelectedProductId(id);
        setPage('productDetail');
    };

    return (
        <>
            <PromoBanner />
            <ProductSection 
                onPreview={setPreviewProduct} 
                onProductSelect={handleProductSelect} 
            />
            {/* We can add the ProductPreviewModal here if needed on the homepage */}
        </>
    );
};

export default HomePage;