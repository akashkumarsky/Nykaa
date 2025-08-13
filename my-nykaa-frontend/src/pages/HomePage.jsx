// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../api';
import ProductGrid from '../components/Products/ProductGrid.jsx';
import Pagination from '../components/ui/Pagination.jsx';
import ProductPreviewModal from '../components/products/ProductPreviewModal.jsx';
import Carousel from '../components/ui/Carousel.jsx'; // Import the new Carousel component

// This component displays the "Our Bestsellers" section with products
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

// This is the main component for the entire homepage
const HomePage = ({ setPage, setSelectedProductId }) => {
    const [previewProduct, setPreviewProduct] = useState(null);

    const handleProductSelect = (id) => {
        setSelectedProductId(id);
        setPage('productDetail');
    };

    // Define the images for your carousel
    const carouselImages = [
        'https://images-static.nykaa.com/uploads/3857fb95-8ca8-4769-8877-0a67c677888f.jpeg?tr=cm-pad_resize,w-1200?text=Summer+Sale',
        'https://images-static.nykaa.com/uploads/1f48e067-4588-4ee1-83db-947e1ee69bd2.png?tr=cm-pad_resize,w-1200?text=New+Arrivals',
        'https://images-static.nykaa.com/uploads/26b5bd30-e525-4a61-9228-374756ee0664.jpg?tr=cm-pad_resize,w-1200?text=Free+Shipping',
        'https://images-static.nykaa.com/uploads/f275a728-0c68-45e5-93f1-a3d51980783c.jpg?tr=cm-pad_resize,w-1200?text=Free+Shipping',

        'https://images-static.nykaa.com/uploads/96e9cbf1-ae8b-485c-a651-4e04f0cae7bb.jpg?tr=cm-pad_resize,w-1200?text=Free+Shipping',

        'https://images-static.nykaa.com/uploads/e8534451-ddad-4e25-a564-04b324215382.jpg?tr=cm-pad_resize,w-1200?text=Free+Shipping',

        'https://images-static.nykaa.com/uploads/cb4fca98-e689-4ddd-94b5-580b6c8108ff.jpg?tr=cm-pad_resize,w-1200?text=Free+Shipping',

        'https://images-static.nykaa.com/uploads/e8534451-ddad-4e25-a564-04b324215382.jpg?tr=cm-pad_resize,w-1200',

    ];

    return (
        <>
            {/* UPDATED: Replaced the old static banner with the new Carousel */}
            <div className="container mx-auto p-4 sm:p-8">
                <Carousel images={carouselImages} />
            </div>

            <ProductSection
                onPreview={setPreviewProduct}
                onProductSelect={handleProductSelect}
            />
            <ProductPreviewModal product={previewProduct} onClose={() => setPreviewProduct(null)} />
        </>
    );
};

export default HomePage;
