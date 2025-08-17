import React, { useState, useEffect } from 'react';
import { api } from '../../api';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        stockQuantity: '',
        categoryId: '',
        brandId: ''
    });
    const [editingProduct, setEditingProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productsData, categoriesData, brandsData] = await Promise.all([
                    api.get('/products?size=1000'),
                    api.get('/products/categories'),
                    api.get('/products/brands')
                ]);
                setProducts(productsData.content);
                setCategories(categoriesData);
                setBrands(brandsData);
                setError(null);
            } catch (err) {
                setError(err.message);
                console.error("Failed to fetch data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editingProduct) {
            setEditingProduct({ ...editingProduct, [name]: value });
        } else {
            setNewProduct({ ...newProduct, [name]: value });
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const createdProduct = await api.post('/products', newProduct);
            setProducts([createdProduct, ...products]);
            setNewProduct({
                name: '',
                description: '',
                price: '',
                imageUrl: '',
                stockQuantity: '',
                categoryId: '',
                brandId: ''
            });
        } catch (err) {
            console.error("Failed to add product:", err);
        }
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        try {
            const updatedProduct = await api.put(`/products/${editingProduct.id}`, editingProduct);
            setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
            setEditingProduct(null);
        } catch (err) {
            console.error("Failed to update product:", err);
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await api.delete(`/products/${productId}`);
            setProducts(products.filter(product => product.id !== productId));
        } catch (err) {
            console.error("Failed to delete product:", err);
        }
    };

    const startEditing = (product) => {
        setEditingProduct({
            ...product,
            categoryId: categories.find(c => c.name === product.categoryName)?.id || '',
            brandId: brands.find(b => b.name === product.brandName)?.id || ''
        });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Manage Products</h2>
            <div className="mb-8">
                <h3 className="text-lg font-bold mb-2">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="name" value={editingProduct ? editingProduct.name : newProduct.name} onChange={handleInputChange} placeholder="Name" className="p-2 border rounded" required />
                    <input type="text" name="description" value={editingProduct ? editingProduct.description : newProduct.description} onChange={handleInputChange} placeholder="Description" className="p-2 border rounded" required />
                    <input type="number" name="price" value={editingProduct ? editingProduct.price : newProduct.price} onChange={handleInputChange} placeholder="Price" className="p-2 border rounded" required />
                    <input type="text" name="imageUrl" value={editingProduct ? editingProduct.imageUrl : newProduct.imageUrl} onChange={handleInputChange} placeholder="Image URL" className="p-2 border rounded" required />
                    <input type="number" name="stockQuantity" value={editingProduct ? editingProduct.stockQuantity : newProduct.stockQuantity} onChange={handleInputChange} placeholder="Stock Quantity" className="p-2 border rounded" required />
                    <select name="categoryId" value={editingProduct ? editingProduct.categoryId : newProduct.categoryId} onChange={handleInputChange} className="p-2 border rounded" required>
                        <option value="">Select Category</option>
                        {categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
                    </select>
                    <select name="brandId" value={editingProduct ? editingProduct.brandId : newProduct.brandId} onChange={handleInputChange} className="p-2 border rounded" required>
                        <option value="">Select Brand</option>
                        {brands.map(brand => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
                    </select>
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">{editingProduct ? 'Update Product' : 'Add Product'}</button>
                    {editingProduct && <button onClick={() => setEditingProduct(null)} className="bg-gray-500 text-white p-2 rounded">Cancel</button>}
                </form>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">ID</th>
                            <th className="py-2 px-4 border-b">Name</th>
                            <th className="py-2 px-4 border-b">Category</th>
                            <th className="py-2 px-4 border-b">Brand</th>
                            <th className="py-2 px-4 border-b">Price</th>
                            <th className="py-2 px-4 border-b">Stock</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td className="py-2 px-4 border-b text-center">{product.id}</td>
                                <td className="py-2 px-4 border-b text-center">{product.name}</td>
                                <td className="py-2 px-4 border-b text-center">{product.categoryName}</td>
                                <td className="py-2 px-4 border-b text-center">{product.brandName}</td>
                                <td className="py-2 px-4 border-b text-center">${product.price.toFixed(2)}</td>
                                <td className="py-2 px-4 border-b text-center">{product.stockQuantity}</td>
                                <td className="py-2 px-4 border-b text-center">
                                    <button onClick={() => startEditing(product)} className="bg-yellow-500 text-white p-2 rounded mr-2">Edit</button>
                                    <button onClick={() => handleDeleteProduct(product.id)} className="bg-red-500 text-white p-2 rounded">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProducts;
