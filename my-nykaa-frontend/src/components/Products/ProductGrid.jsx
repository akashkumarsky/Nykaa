// src/components/Products/ProductGrid.jsx
import React from 'react';
import ProductCard from '../ProductCard';

// UPDATED: This component now accepts onPreview and onProductSelect as props
const ProductGrid = ({ products, onPreview, onProductSelect }) => {
    // Added a check to prevent errors if the products array is not available yet
    if (!products || products.length === 0) {
        return <div className="text-center py-12 text-gray-500">No products found.</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
                // UPDATED: The props are now passed down to each ProductCard
                <ProductCard
                    key={product.id}
                    product={product}
                    onPreview={onPreview}
                    onProductSelect={onProductSelect}
                />
            ))}
        </div>
    );
};

export default ProductGrid;
