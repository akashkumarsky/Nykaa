// src/pages/HomePage.jsx
import React, { useState } from 'react';
import { api } from '../api';
import ProductGrid from '../components/Products/ProductGrid.jsx';
import Pagination from '../components/ui/Pagination.jsx';
import ProductPreviewModal from '../components/products/ProductPreviewModal.jsx';
import Carousel from '../components/ui/Carousel.jsx'; // Banner carousel
import { ChevronLeft, ChevronRight } from "lucide-react";

// ✅ Scrollable Category Carousel with arrows
const CategoryCarousel = ({ categories, onSelectCategory }) => {
    const scrollRef = React.useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="py-8 bg-white relative">
            <div className="container mx-auto px-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
                    Shop by Categories
                </h2>

                <div className="relative">
                    {/* Left arrow */}
                    <button
                        onClick={() => scroll("left")}
                        className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-pink-100 z-10"
                    >
                        <ChevronLeft className="w-5 h-5 text-pink-500" />
                    </button>

                    {/* Scrollable categories */}
                    <div
                        ref={scrollRef}
                        className="flex space-x-6 overflow-x-auto scrollbar-hide scroll-smooth"
                    >
                        {categories.map((cat, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 text-center cursor-pointer group w-24"
                                onClick={() => onSelectCategory(cat.name)}
                            >
                                <div className="w-24 h-24 mx-auto rounded-full border-2 border-pink-200 overflow-hidden group-hover:border-pink-500 transition">
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <p className="mt-2 text-sm font-medium text-gray-700 group-hover:text-pink-500">
                                    {cat.name}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Right arrow */}
                    <button
                        onClick={() => scroll("right")}
                        className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-pink-100 z-10"
                    >
                        <ChevronRight className="w-5 h-5 text-pink-500" />
                    </button>
                </div>
            </div>
        </div>
    );
};


// ✅ Bestseller Products Section
const ProductSection = ({ onPreview, onProductSelect }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    React.useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = await api.get(`/products?page=${currentPage}&size=15`);
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
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-gray-800">
                    Our Bestsellers
                </h2>
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


// ✅ Main HomePage
const HomePage = ({ setPage, setSelectedProductId }) => {
    const [previewProduct, setPreviewProduct] = useState(null);
    const [categories, setCategories] = useState([]);

    React.useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await api.get('/products/categories');
                if (data) {
                    setCategories(data);
                }
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            }
        };
        fetchCategories();
    }, []);

    const handleProductSelect = (id) => {
        setSelectedProductId(id);
        setPage('productDetail');
    };

    // Banner carousel images
    const carouselImages = [
        'https://images-static.nykaa.com/uploads/3857fb95-8ca8-4769-8877-0a67c677888f.jpeg?tr=cm-pad_resize,w-1200',
        'https://images-static.nykaa.com/uploads/1f48e067-4588-4ee1-83db-947e1ee69bd2.png?tr=cm-pad_resize,w-1200',
        'https://images-static.nykaa.com/uploads/26b5bd30-e525-4a61-9228-374756ee0664.jpg?tr=cm-pad_resize,w-1200',
    ];

    return (
        <>
            {/* Banner Carousel */}
            <div className="container mx-auto p-4 sm:p-8">
                <Carousel images={carouselImages} />
            </div>

            {/* Category Carousel (scrollable with arrows) */}
            <CategoryCarousel
                categories={categories}
                onSelectCategory={(cat) => {
                    window.localStorage.setItem("selectedCategory", cat);
                    setPage("products"); // ✅ matches App.jsx
                }}
            />

            {/* Bestsellers */}
            <ProductSection
                onPreview={setPreviewProduct}
                onProductSelect={handleProductSelect}
            />

            {/* Product Preview Modal */}
            <ProductPreviewModal product={previewProduct} onClose={() => setPreviewProduct(null)} />
        </>
    );
};

export default HomePage;