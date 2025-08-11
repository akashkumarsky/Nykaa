// src/components/products/Sidebar.jsx
import React from 'react';

const FilterSection = ({ title, options, selected, onChange }) => (
  <div className="border-b py-4">
    <h3 className="font-semibold mb-2">{title}</h3>
    <ul>
      {options.map((option) => (
        <li key={option} className="flex items-center mb-1">
          <input
            type="checkbox"
            id={`${title}-${option}`}
            value={option}
            checked={selected.includes(option)}
            onChange={() => onChange(option)}
            className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
          />
          <label
            htmlFor={`${title}-${option}`}
            className="ml-3 text-sm text-gray-600"
          >
            {option}
          </label>
        </li>
      ))}
    </ul>
  </div>
);

const Sidebar = ({
  filters,
  selectedCategories,
  onCategoryChange,
  selectedBrands,
  onBrandChange,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-bold border-b pb-2">Filters</h2>
      <FilterSection
        title="Category"
        options={filters.categories}
        selected={selectedCategories}
        onChange={onCategoryChange}
      />
      <FilterSection
        title="Brand"
        options={filters.brands}
        selected={selectedBrands}
        onChange={onBrandChange}
      />
      {/* Add more filter sections for Price, Discount, etc. here */}
    </div>
  );
};

export default Sidebar;
