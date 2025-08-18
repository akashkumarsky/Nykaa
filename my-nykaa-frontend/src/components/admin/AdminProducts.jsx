import React, { useState, useEffect } from "react";
import { api } from "../../api";
import Pagination from "../ui/Pagination";

const AdminProducts = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        stockQuantity: "",
        categoryId: "",
        brandId: "",
    });
    const [editingProduct, setEditingProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [productsPerPage] = useState(10);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productsData, categoriesData, brandsData] = await Promise.all([
                    api.get(`/products?size=1000`),
                    api.get("/products/categories"),
                    api.get("/products/brands"),
                ]);

                const sortedProducts = productsData.content.sort((a, b) => b.id - a.id);
                setAllProducts(sortedProducts);

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
            const createdProduct = await api.post("/products", newProduct);
            setAllProducts([createdProduct, ...allProducts]);
            setNewProduct({
                name: "",
                description: "",
                price: "",
                imageUrl: "",
                stockQuantity: "",
                categoryId: "",
                brandId: "",
            });
        } catch (err) {
            console.error("Failed to add product:", err);
        }
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        try {
            const updatedProduct = await api.put(
                `/products/${editingProduct.id}`,
                editingProduct
            );
            setAllProducts(
                allProducts.map((p) => (p.id === editingProduct.id ? updatedProduct : p))
            );
            setEditingProduct(null);
        } catch (err) {
            console.error("Failed to update product:", err);
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await api.delete(`/products/${productId}`);
            setAllProducts(allProducts.filter((product) => product.id !== productId));
        } catch (err) {
            console.error("Failed to delete product:", err);
        }
    };

    const startEditing = (product) => {
        setEditingProduct({
            ...product,
            categoryId: categories.find((c) => c.name === product.categoryName)?.id || "",
            brandId: brands.find((b) => b.name === product.brandName)?.id || "",
        });
    };

    // Pagination
    const indexOfLastProduct = (currentPage + 1) * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = allProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(allProducts.length / productsPerPage);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-pink-50 p-4 md:p-8">
            {/* Form */}
            <div className="mb-8 bg-white shadow-lg rounded-xl p-4 md:p-6 border border-pink-200">
                <h3 className="text-lg font-bold mb-4 text-pink-700">
                    {editingProduct ? "Edit Product" : "Add New Product"}
                </h3>
                <form
                    onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <input
                        type="text"
                        name="name"
                        value={editingProduct ? editingProduct.name : newProduct.name}
                        onChange={handleInputChange}
                        placeholder="Name"
                        className="p-2 border rounded focus:ring-2 focus:ring-pink-400"
                        required
                    />
                    <input
                        type="text"
                        name="description"
                        value={editingProduct ? editingProduct.description : newProduct.description}
                        onChange={handleInputChange}
                        placeholder="Description"
                        className="p-2 border rounded focus:ring-2 focus:ring-pink-400"
                        required
                    />
                    <input
                        type="number"
                        name="price"
                        value={editingProduct ? editingProduct.price : newProduct.price}
                        onChange={handleInputChange}
                        placeholder="Price"
                        className="p-2 border rounded focus:ring-2 focus:ring-pink-400"
                        required
                    />
                    <input
                        type="text"
                        name="imageUrl"
                        value={editingProduct ? editingProduct.imageUrl : newProduct.imageUrl}
                        onChange={handleInputChange}
                        placeholder="Image URL"
                        className="p-2 border rounded focus:ring-2 focus:ring-pink-400"
                        required
                    />
                    <input
                        type="number"
                        name="stockQuantity"
                        value={
                            editingProduct ? editingProduct.stockQuantity : newProduct.stockQuantity
                        }
                        onChange={handleInputChange}
                        placeholder="Stock Quantity"
                        className="p-2 border rounded focus:ring-2 focus:ring-pink-400"
                        required
                    />
                    <select
                        name="categoryId"
                        value={editingProduct ? editingProduct.categoryId : newProduct.categoryId}
                        onChange={handleInputChange}
                        className="p-2 border rounded focus:ring-2 focus:ring-pink-400"
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                    <select
                        name="brandId"
                        value={editingProduct ? editingProduct.brandId : newProduct.brandId}
                        onChange={handleInputChange}
                        className="p-2 border rounded focus:ring-2 focus:ring-pink-400"
                        required
                    >
                        <option value="">Select Brand</option>
                        {brands.map((b) => (
                            <option key={b.id} value={b.id}>
                                {b.name}
                            </option>
                        ))}
                    </select>
                    <div className="flex gap-2 mt-2">
                        <button
                            type="submit"
                            className="bg-pink-600 text-white p-2 rounded hover:bg-pink-700 transition"
                        >
                            {editingProduct ? "Update Product" : "Add Product"}
                        </button>
                        {editingProduct && (
                            <button
                                onClick={() => setEditingProduct(null)}
                                className="bg-gray-400 text-white p-2 rounded hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Table (desktop) */}
            <div className="hidden md:block overflow-x-auto shadow-lg rounded-xl bg-white border border-pink-200">
                <table className="min-w-full">
                    <thead className="bg-pink-600 text-white">
                        <tr>
                            <th className="py-2 px-4">ID</th>
                            <th className="py-2 px-4">Name</th>
                            <th className="py-2 px-4">Category</th>
                            <th className="py-2 px-4">Brand</th>
                            <th className="py-2 px-4">Price</th>
                            <th className="py-2 px-4">Stock</th>
                            <th className="py-2 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.map((p) => (
                            <tr key={p.id} className="border-b hover:bg-pink-50">
                                <td className="py-3 px-4 font-medium">#{p.id}</td>
                                <td className="py-2 px-4 text-center">{p.name}</td>
                                <td className="py-2 px-4 text-center">{p.categoryName}</td>
                                <td className="py-2 px-4 text-center">{p.brandName}</td>
                                <td className="py-2 px-4 text-center">${p.price.toFixed(2)}</td>
                                <td className="py-2 px-4 text-center">{p.stockQuantity}</td>
                                <td className="py-2 px-4 text-center">
                                    <button
                                        onClick={() => startEditing(p)}
                                        className="bg-pink-400 text-white px-3 py-1 rounded hover:bg-pink-500 mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProduct(p.id)}
                                        className="bg-rose-500 text-white px-3 py-1 rounded hover:bg-rose-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Cards (mobile) */}
            <div className="grid gap-4 md:hidden">
                {currentProducts.map((p) => (
                    <div key={p.id} className="bg-white p-4 shadow-lg rounded-xl border border-pink-200">
                        <p className="text-sm text-gray-500">ID: {p.id}</p>
                        <p className="font-bold text-lg text-pink-700">{p.name}</p>
                        <p className="text-gray-600">{p.categoryName} | {p.brandName}</p>
                        <p className="mt-1 text-gray-800">${p.price.toFixed(2)} | Stock: {p.stockQuantity}</p>
                        <div className="flex gap-2 mt-3">
                            <button
                                onClick={() => startEditing(p)}
                                className="bg-pink-400 text-white flex-1 py-2 rounded hover:bg-pink-500"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="bg-rose-500 text-white flex-1 py-2 rounded hover:bg-rose-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default AdminProducts;
