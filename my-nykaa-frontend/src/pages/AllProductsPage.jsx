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

    // Filter state
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);

    // UPDATED: filterOptions is now managed by state
    const [filterOptions, setFilterOptions] = useState({ categories: [], brands: [] });

    // NEW: This effect fetches the available filter options when the page loads
    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                // Fetch categories and brands from the new API endpoints concurrently
                const [categoriesData, brandsData] = await Promise.all([
                    api.get('/products/categories'),
                    api.get('/products/brands')
                ]);
                setFilterOptions({ categories: categoriesData, brands: brandsData });
            } catch (err) {
                console.error("Failed to fetch filter options:", err);
                // You could set an error state here as well
            }
        };
        fetchFilterOptions();
    }, []); // Empty array ensures this runs only once on mount

    // This effect re-fetches products when page OR filters change
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Build the query string with pagination and filter parameters
                const params = new URLSearchParams({
                    page: currentPage,
                    size: 12,
                });
                if (selectedCategories.length > 0) {
                    params.append('categories', selectedCategories.join(','));
                }
                if (selectedBrands.length > 0) {
                    params.append('brands', selectedBrands.join(','));
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
    }, [currentPage, selectedCategories, selectedBrands]); // Re-run effect if these change

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
        setCurrentPage(0); // Reset to first page when filters change
    };

    const handleBrandChange = (brand) => {
        setSelectedBrands(prev =>
            prev.includes(brand)
                ? prev.filter(b => b !== brand)
                : [...prev, brand]
        );
        setCurrentPage(0); // Reset to first page when filters change
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
