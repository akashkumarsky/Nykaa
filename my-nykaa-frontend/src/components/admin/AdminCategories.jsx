import React, { useState, useEffect } from 'react';
import { api } from '../../api';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryImage, setNewCategoryImage] = useState('');
    const [formError, setFormError] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            const data = await api.getCategories();
            setCategories(data);
            setError(null);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setFormError('');
        if (newCategoryName.length > 255) {
            setFormError('Category name cannot exceed 255 characters.');
            return;
        }
        if (newCategoryImage.length > 2048) {
            setFormError('Image URL cannot exceed 2048 characters.');
            return;
        }
        try {
            await api.createCategory({ name: newCategoryName, image: newCategoryImage });
            setNewCategoryName('');
            setNewCategoryImage('');
            fetchCategories();
        } catch (error) {
            setError(error.message);
        }
    };

    const handleUpdate = async (id) => {
        if (editingCategory.name.length > 255) {
            setError('Category name cannot exceed 255 characters.');
            return;
        }
        if (editingCategory.image.length > 2048) {
            setError('Image URL cannot exceed 2048 characters.');
            return;
        }
        try {
            await api.updateCategory(id, { name: editingCategory.name, image: editingCategory.image });
            setEditingCategory(null);
            fetchCategories();
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.deleteCategory(id);
            fetchCategories();
        } catch (error) {
            setError(error.message);
        }
    };

    const startEditing = (category) => {
        setEditingCategory({ ...category });
    };

    const cancelEditing = () => {
        setEditingCategory(null);
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div className="text-pink-600">Error: {error}</div>;

    return (
        <div className="p-6 bg-pink-50 min-h-screen">
            <h2 className="text-3xl font-bold mb-6 text-pink-700">Manage Categories</h2>

            <form onSubmit={handleCreate} className="mb-6 p-4 border border-pink-200 rounded-lg shadow-md bg-white">
                <h3 className="text-xl font-semibold mb-2 text-pink-700">Add New Category</h3>
                {formError && <div className="text-red-500 mb-4">{formError}</div>}
                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Category Name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="border border-pink-300 p-2 rounded w-full focus:ring-2 focus:ring-pink-400 outline-none"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Image URL"
                        value={newCategoryImage}
                        onChange={(e) => setNewCategoryImage(e.target.value)}
                        className="border border-pink-300 p-2 rounded w-full focus:ring-2 focus:ring-pink-400 outline-none"
                    />
                    <button
                        type="submit"
                        className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition"
                    >
                        Add Category
                    </button>
                </div>
            </form>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-pink-200 rounded-lg">
                    <thead className="bg-pink-100 text-pink-800">
                        <tr>
                            <th className="py-2 px-4 border-b border-pink-200">ID</th>
                            <th className="py-2 px-4 border-b border-pink-200">Image</th>
                            <th className="py-2 px-4 border-b border-pink-200">Name</th>
                            <th className="py-2 px-4 border-b border-pink-200">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id} className="hover:bg-pink-50 transition">
                                <td className="py-2 px-4 border-b border-pink-200">{category.id}</td>
                                <td className="py-2 px-4 border-b border-pink-200">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="h-12 w-12 object-cover rounded"
                                    />
                                </td>
                                <td className="py-2 px-4 border-b border-pink-200">
                                    {editingCategory && editingCategory.id === category.id ? (
                                        <input
                                            type="text"
                                            value={editingCategory.name}
                                            onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                            className="border border-pink-300 p-1 rounded focus:ring-2 focus:ring-pink-400 outline-none"
                                        />
                                    ) : (
                                        category.name
                                    )}
                                </td>
                                <td className="py-2 px-4 border-b border-pink-200">
                                    {editingCategory && editingCategory.id === category.id ? (
                                        <>
                                            <button
                                                onClick={() => handleUpdate(category.id)}
                                                className="bg-pink-500 text-white px-2 py-1 rounded mr-2 hover:bg-pink-600 transition"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={cancelEditing}
                                                className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500 transition"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => startEditing(category)}
                                                className="bg-pink-400 text-white px-2 py-1 rounded mr-2 hover:bg-pink-500 transition"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category.id)}
                                                className="bg-red-400 text-white px-2 py-1 rounded hover:bg-red-500 transition"
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminCategories;
