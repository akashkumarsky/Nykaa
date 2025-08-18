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

  if (isLoading) return <p>Loading brands...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Brands</h2>

      <form onSubmit={handleCreate} className="mb-6 p-4 border rounded shadow-md">
        <h3 className="text-xl font-semibold mb-2">Add New Brand</h3>
        {formError && <div className="text-red-500 mb-4">{formError}</div>}
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={newBrandName}
            onChange={(e) => setNewBrandName(e.target.value)}
            placeholder="Brand Name"
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            value={newBrandImage}
            onChange={(e) => setNewBrandImage(e.target.value)}
            placeholder="Brand Image URL"
            className="border p-2 rounded w-full"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Brand
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {brands.map((brand) => (
          <div key={brand.id} className="p-4 border rounded shadow-md">
            {editingBrand && editingBrand.id === brand.id ? (
              <div>
                <input
                  type="text"
                  value={editingBrand.name}
                  onChange={(e) =>
                    setEditingBrand({ ...editingBrand, name: e.target.value })
                  }
                  className="border p-2 rounded w-full mb-2"
                />
                <input
                  type="text"
                  value={editingBrand.image}
                  onChange={(e) =>
                    setEditingBrand({ ...editingBrand, image: e.target.value })
                  }
                  className="border p-2 rounded w-full mb-2"
                />
                <button
                  onClick={() => handleUpdate(brand.id)}
                  className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                >
                  Save
                </button>
                <button
                  onClick={cancelEditing}
                  className="bg-gray-500 text-white px-2 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-24 h-24 object-contain mb-2"
                />
                <p className="font-bold text-lg">{brand.name}</p>
                <div className="mt-2">
                  <button
                    onClick={() => startEditing(brand)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(brand.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
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
