// src/pages/AllProductsPage.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../api';
import Sidebar from '../components/Products/Sidebar.jsx';
import ProductGrid from '../components/Products/ProductGrid.jsx';
import Pagination from '../components/ui/Pagination.jsx';

const AllProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // UPDATED: State for multi-select checkboxes and single-select radio
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedPrice, setSelectedPrice] = useState('any');

    const [filterOptions, setFilterOptions] = useState({ categories: [], brands: [] });

    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const [categoriesData, brandsData] = await Promise.all([
                    api.get('/products/categories'),
                    api.get('/products/brands')
                ]);
                setFilterOptions({ categories: categoriesData, brands: brandsData });
            } catch (err) {
                console.error("Failed to fetch filter options:", err);
            }
        };
        fetchFilterOptions();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams({ page: currentPage, size: 12 });

                // UPDATED: Append filters correctly for arrays and single values
                if (selectedCategories.length > 0) params.append('categories', selectedCategories.join(','));
                if (selectedBrands.length > 0) params.append('brands', selectedBrands.join(','));
                if (selectedPrice !== 'any') {
                    const [min, max] = selectedPrice.split('-');
                    if (min !== '0') params.append('minPrice', min);
                    if (max !== 'Infinity') params.append('maxPrice', max);
                }

                const data = await api.get(`/products?${params.toString()}`);
                setProducts(data.content);
                setTotalPages(data.totalPages);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [currentPage, selectedCategories, selectedBrands, selectedPrice]);

    const handlePageChange = (page) => setCurrentPage(page);

    // UPDATED: Handlers for multi-select checkboxes
    const handleCategoryChange = (category) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
        setCurrentPage(0);
    };

    const handleBrandChange = (brand) => {
        setSelectedBrands(prev =>
            prev.includes(brand)
                ? prev.filter(b => b !== brand)
                : [...prev, brand]
        );
        setCurrentPage(0);
    };

    // UPDATED: Handler for single-select radio buttons
    const handlePriceChange = (priceRange) => {
        setSelectedPrice(priceRange);
        setCurrentPage(0);
    };

    if (error) return <div className="text-center py-12 text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto flex flex-col md:flex-row gap-8 px-4 py-8">
            <aside className="w-full md:w-1/4 lg:w-1/5">
                <Sidebar
                    filters={filterOptions}
                    selectedCategories={selectedCategories}
                    onCategoryChange={handleCategoryChange}
                    selectedBrands={selectedBrands}
                    onBrandChange={handleBrandChange}
                    selectedPrice={selectedPrice}
                    onPriceChange={handlePriceChange}
                />
            </aside>
            <main className="w-full md:w-3/4 lg:w-4/5">
                <h1 className="text-3xl font-bold mb-6">All Products</h1>
                {loading ? (
                    <div className="text-center py-12">Loading...</div>
                ) : (
                    <>
                        <ProductGrid products={products} />
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </main>
        </div>
    );
};

export default AllProductsPage;
