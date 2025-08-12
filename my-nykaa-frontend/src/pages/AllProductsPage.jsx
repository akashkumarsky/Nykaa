// src/pages/AllProductsPage.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../api';
import Sidebar from '../components/Products/Sidebar.jsx';
import ProductGrid from '../components/Products/ProductGrid.jsx';
import Pagination from '../components/ui/Pagination.jsx'; // Import the new component

const AllProductsPage = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // NEW: State for pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // This effect now runs whenever the currentPage changes
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // UPDATED: Pass page and size parameters to the API call
                const data = await api.get(`/products?page=${currentPage}&size=12`);
                setAllProducts(data.content); // The products are now in the 'content' field
                setTotalPages(data.totalPages); // Get total pages from the response
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [currentPage]); // Re-run the effect when currentPage changes

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (error) return <div className="text-center py-12 text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto flex flex-col md:flex-row gap-8 px-4 py-8">
            <aside className="w-full md:w-1/4 lg:w-1/5">
                {/* Filters sidebar can be added here. For now, focusing on pagination. */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-bold">Filters</h2>
                    {/* Filter content would go here */}
                </div>
            </aside>
            <main className="w-full md:w-3/4 lg:w-4/5">
                <h1 className="text-3xl font-bold mb-6">All Products</h1>
                {loading ? (
                    <div className="text-center py-12">Loading...</div>
                ) : (
                    <>
                        <ProductGrid products={allProducts} />
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
