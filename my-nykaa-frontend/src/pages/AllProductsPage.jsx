import React, { useState, useEffect } from 'react';
import { api } from '../api';
import Sidebar from '../components/Products/Sidebar.jsx';
import ProductGrid from '../components/Products/ProductGrid.jsx';
import Pagination from '../components/ui/Pagination.jsx';
import ProductPreviewModal from '../components/products/ProductPreviewModal.jsx';
import FilterModal from '../components/products/FilterModal.jsx';
import { Filter } from 'lucide-react';

const AllProductsPage = ({ setPage, setSelectedProductId }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedCategories, setSelectedCategories] = useState(() => {
        const storedCategory = window.localStorage.getItem("selectedCategory");
        return storedCategory ? [storedCategory] : [];
    });
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedPrice, setSelectedPrice] = useState('any');
    const [filterOptions, setFilterOptions] = useState({ categories: [], brands: [] });
    const [previewProduct, setPreviewProduct] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // ✅ On mount, check if user clicked a category from HomePage
    useEffect(() => {
        const storedCategory = window.localStorage.getItem("selectedCategory");
        if (storedCategory) {
            setSelectedCategories([storedCategory]); // preselect category
            window.localStorage.removeItem("selectedCategory"); // optional clear
        }
    }, []);


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
                const params = new URLSearchParams({ page: currentPage, size: 15 });
                if (selectedCategories.length > 0) params.append('categories', selectedCategories.join(','));
                if (selectedBrands.length > 0) params.append('brands', selectedBrands.join(','));
                if (selectedPrice !== 'any') {
                    const [min, max] = selectedPrice.split('-');
                    if (min !== '0') params.append('minPrice', min);
                    if (max !== 'Infinity') params.append('maxPrice', max);
                }
                console.log("Fetching products with params:", params.toString());
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

    const handleProductSelect = (id) => {
        setSelectedProductId(id);
        setPage('productDetail');
    };

    const handlePageChange = (page) => setCurrentPage(page);

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

    const handlePriceChange = (priceRange) => {
        setSelectedPrice(priceRange);
        setCurrentPage(0);
    };

    if (error) return <div className="text-center py-12 text-red-500">Error: {error}</div>;

    const sidebarContent = (
        <Sidebar
            filters={filterOptions}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
            selectedBrands={selectedBrands}
            onBrandChange={handleBrandChange}
            selectedPrice={selectedPrice}
            onPriceChange={handlePriceChange}
        />
    );

    return (
        <>
            <div className="container mx-auto flex flex-col md:flex-row gap-8 px-4 py-8">
                {/* Sidebar for Desktop */}
                <aside className="hidden md:block w-full md:w-1/4 lg:w-1/5">
                    {sidebarContent}
                </aside>

                <main className="w-full md:w-3/4 lg:w-4/5">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold">
                            {selectedCategories.length > 0
                                ? `${selectedCategories[0]} Products`
                                : "All Products"}
                        </h1>
                        <button
                            onClick={() => setIsFilterOpen(true)}
                            className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border rounded-md shadow-sm"
                        >
                            <Filter size={16} />
                            <span>Filters</span>
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">Loading...</div>
                    ) : (
                        <>
                            <ProductGrid
                                products={products}
                                onPreview={setPreviewProduct}
                                onProductSelect={handleProductSelect}
                            />
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </>
                    )}
                </main>
            </div>

            <ProductPreviewModal product={previewProduct} onClose={() => setPreviewProduct(null)} />

            <FilterModal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
                {sidebarContent}
            </FilterModal>
        </>
    );
};

export default AllProductsPage;
