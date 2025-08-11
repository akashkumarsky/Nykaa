// src/pages/AllProductsPage.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../api';
import Sidebar from '../../components/products/Sidebar';
import ProductGrid from '../../components/products/ProductGrid';

const AllProductsPage = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for filters
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);

    // Mock filter data - in a real app, this would come from the API
    const filterOptions = {
        categories: ['Skin Care', 'Makeup', 'Hair Care', 'Fragrance'],
        brands: ['The Ordinary', 'Maybelline', 'L\'Oreal Paris', 'Kay Beauty'],
    };

    // Fetch all products on initial render
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await api.get('/products');
                setAllProducts(data);
                setFilteredProducts(data); // Initially, show all products
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Apply filters whenever products or filter selections change
    useEffect(() => {
        let products = [...allProducts];

        if (selectedCategories.length > 0) {
            products = products.filter(p => selectedCategories.includes(p.categoryName));
        }

        if (selectedBrands.length > 0) {
            products = products.filter(p => selectedBrands.includes(p.brandName));
        }

        setFilteredProducts(products);
    }, [selectedCategories, selectedBrands, allProducts]);

    const handleCategoryChange = (category) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const handleBrandChange = (brand) => {
        setSelectedBrands(prev =>
            prev.includes(brand)
                ? prev.filter(b => b !== brand)
                : [...prev, brand]
        );
    };

    if (loading) return <div className="text-center py-12">Loading...</div>;
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
                <ProductGrid products={filteredProducts} />
            </main>
        </div>
    );
};

export default AllProductsPage;
