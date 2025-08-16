// src/components/Products/ProductGrid.jsx
import React from 'react';
import ProductCard from '../ProductCard';

const ProductGrid = ({ products, onPreview, onProductSelect }) => {
    // Handle empty or undefined products array
    if (!products || products.length === 0) {
        return <div className="text-center py-16 text-gray-500">No products found.</div>;
    }

    return (
        <div className="px-4 md:px-8 lg:px-16 py-8">
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {products.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onPreview={onPreview}
                        onProductSelect={onProductSelect}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductGrid;
