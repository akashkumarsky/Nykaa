// src/components/products/ProductGrid.jsx
import React from 'react';
import ProductCard from '../ProductCard'; 

const ProductGrid = ({ products }) => {
    if (products.length === 0) {
        return <div className="text-center py-12 text-gray-500">No products match your filters.</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};

export default ProductGrid;
