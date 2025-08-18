import React, { useState, useEffect } from 'react';
import { api } from '../../api';

const AdminBrands = () => {
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingBrand, setEditingBrand] = useState(null);
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandImage, setNewBrandImage] = useState('');
  const [formError, setFormError] = useState('');

  const fetchBrands = async () => {
    setIsLoading(true);
    try {
      const data = await api.getBrands();
      setBrands(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');
    if (newBrandName.length > 255) {
      setFormError('Brand name cannot exceed 255 characters.');
      return;
    }
    if (newBrandImage.length > 2048) {
      setFormError('Image URL cannot exceed 2048 characters.');
      return;
    }
    if (!newBrandName.trim()) return;
    try {
      await api.createBrand({ name: newBrandName, image: newBrandImage });
      setNewBrandName('');
      setNewBrandImage('');
      fetchBrands();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdate = async (id) => {
    if (editingBrand.name.length > 255) {
      setError('Brand name cannot exceed 255 characters.');
      return;
    }
    if (editingBrand.image.length > 2048) {
      setError('Image URL cannot exceed 2048 characters.');
      return;
    }
    try {
      await api.updateBrand(id, {
        name: editingBrand.name,
        image: editingBrand.image,
      });
      setEditingBrand(null);
      fetchBrands();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteBrand(id);
      fetchBrands();
    } catch (error) {
      setError(error.message);
    }
  };

  const startEditing = (brand) => {
    setEditingBrand({ ...brand });
  };

  const cancelEditing = () => {
    setEditingBrand(null);
  };

  if (isLoading) return <p className="text-pink-600">Loading brands...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6 bg-pink-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-pink-700">Manage Brands</h2>

      <form
        onSubmit={handleCreate}
        className="mb-6 p-4 border border-pink-200 rounded-lg shadow-md bg-white"
      >
        <h3 className="text-xl font-semibold mb-2 text-pink-700">Add New Brand</h3>
        {formError && <div className="text-red-500 mb-4">{formError}</div>}
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={newBrandName}
            onChange={(e) => setNewBrandName(e.target.value)}
            placeholder="Brand Name"
            className="border border-pink-300 p-2 rounded w-full focus:ring-2 focus:ring-pink-400 outline-none"
            required
          />
          <input
            type="text"
            value={newBrandImage}
            onChange={(e) => setNewBrandImage(e.target.value)}
            placeholder="Brand Image URL"
            className="border border-pink-300 p-2 rounded w-full focus:ring-2 focus:ring-pink-400 outline-none"
          />
          <button
            type="submit"
            className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition"
          >
            Add Brand
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="p-4 border border-pink-200 rounded-lg shadow-md bg-white hover:shadow-lg transition"
          >
            {editingBrand && editingBrand.id === brand.id ? (
              <div>
                <input
                  type="text"
                  value={editingBrand.name}
                  onChange={(e) =>
                    setEditingBrand({ ...editingBrand, name: e.target.value })
                  }
                  className="border border-pink-300 p-2 rounded w-full mb-2 focus:ring-2 focus:ring-pink-400 outline-none"
                />
                <input
                  type="text"
                  value={editingBrand.image}
                  onChange={(e) =>
                    setEditingBrand({ ...editingBrand, image: e.target.value })
                  }
                  className="border border-pink-300 p-2 rounded w-full mb-2 focus:ring-2 focus:ring-pink-400 outline-none"
                />
                <button
                  onClick={() => handleUpdate(brand.id)}
                  className="bg-pink-500 text-white px-3 py-1 rounded mr-2 hover:bg-pink-600 transition"
                >
                  Save
                </button>
                <button
                  onClick={cancelEditing}
                  className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-24 h-24 object-contain mb-2 rounded"
                />
                <p className="font-bold text-lg text-pink-700">{brand.name}</p>
                <div className="mt-2">
                  <button
                    onClick={() => startEditing(brand)}
                    className="bg-pink-400 text-white px-3 py-1 rounded mr-2 hover:bg-pink-500 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(brand.id)}
                    className="bg-red-400 text-white px-3 py-1 rounded hover:bg-red-500 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBrands;
