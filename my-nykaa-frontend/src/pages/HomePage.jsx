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

    // Categories
    const categories = [
        { name: 'Lipstick', image: 'https://images-static.nykaa.com/uploads/f24fedce-131d-4475-8abe-2fd521f9f285.jpg?tr=cm-pad_resize,w-150' },
        { name: 'Foundation', image: 'https://images-static.nykaa.com/uploads/6190197e-b6eb-4940-bfb6-24798c324ee1.jpg?tr=cm-pad_resize,w-150' },
        { name: 'Compact', image: 'https://images-static.nykaa.com/uploads/ec49b021-8e66-4dd0-80c0-4b9bad94d756.jpg?tr=cm-pad_resize,w-150' },
        { name: 'Concealer', image: 'https://images-static.nykaa.com/uploads/5485d6ba-2ba0-47bb-964e-3222a69919c2.jpg?tr=cm-pad_resize,w-150' },
        { name: 'Eyeliner', image: 'https://images-static.nykaa.com/uploads/033bc735-50f3-42df-9b7b-08a41fd43902.jpg?tr=cm-pad_resize,w-150' },
        { name: 'Kajal', image: 'https://images-static.nykaa.com/uploads/f0952518-e7af-41c1-940d-770d8bce6c48.jpg?tr=cm-pad_resize,w-150' },
        { name: 'Blush', image: 'https://images-static.nykaa.com/uploads/d7927b17-b7a8-4c57-bde5-d6f3eb3ebd04.jpg?tr=cm-pad_resize,w-150' },
        { name: 'Face Primer', image: 'https://images-static.nykaa.com/uploads/7625ce90-e0fe-4385-948c-82f8efbc00b6.jpg?tr=cm-pad_resize,w-150' },
        { name: 'Setting Spray', image: 'https://images-static.nykaa.com/uploads/013441fd-3566-49a2-9c31-7952e8536778.jpg?tr=cm-pad_resize,w-150' },
        { name: 'Eyeshadow', image: 'https://images-static.nykaa.com/uploads/e33c5912-3056-4be4-84ab-bca828fff41f.jpg?tr=cm-pad_resize,w-150' },
        { name: 'Mascara', image: 'https://images-static.nykaa.com/uploads/b50ea736-1006-44fa-bf7d-167abd0c1650.jpg?tr=cm-pad_resize,w-150' },
        { name: 'Eyebrow Enhancer', image: 'https://images-static.nykaa.com/uploads/a06e37f1-f1fd-4150-92ac-d0de4778b4f5.jpg?tr=cm-pad_resize,w-150' },
        { name: 'Nail polish', image: 'https://images-static.nykaa.com/uploads/f2f1c795-61d6-4667-9e9c-de05baae0e0c.jpg?tr=cm-pad_resize,w-150' },
        { name: 'Tool & Brushes', image: 'https://images-static.nykaa.com/uploads/288a4d54-1690-47cd-93a8-96a0968aff49.jpg?tr=cm-pad_resize,w-150' },
        { name: 'New & Viral', image: 'https://images-static.nykaa.com/uploads/f74b232e-72b6-493d-80e4-65c264c1980d.jpg?tr=cm-pad_resize,w-150' },
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
                    console.log("Selected category:", cat);
                    // TODO: redirect to filtered product page
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
