import React from 'react';
import { ChevronDown } from 'lucide-react';

// A reusable component for each collapsible filter section
const FilterSection = ({ title, options, selected, onChange, type = 'checkbox' }) => (
    <details className="border-b py-2" open>
        <summary className="font-semibold cursor-pointer flex justify-between items-center py-2">
            {title}
            <ChevronDown className="h-5 w-5 transition-transform details-open:rotate-180" />
        </summary>
        <ul className="pt-2 space-y-1">
            {options.map(option => (
                <li key={option.value || option} className="flex items-center">
                    <input
                        type={type}
                        id={`${title}-${option.value || option}`}
                        name={title} // Name is important for radio buttons
                        value={option.value || option}
                        checked={selected.includes(option.value || option)}
                        onChange={() => onChange(option.value || option)}
                        className={`h-4 w-4 border-gray-300 text-pink-600 focus:ring-pink-500 ${type === 'radio' ? 'rounded-full' : 'rounded'}`}
                    />
                    <label htmlFor={`${title}-${option.value || option}`} className="ml-3 text-sm text-gray-600">
                        {option.label || option}
                    </label>
                </li>
            ))}
        </ul>
    </details>
);

const Sidebar = ({
    filters,
    selectedCategories, onCategoryChange,
    selectedBrands, onBrandChange,
    selectedPrice, onPriceChange
}) => {
    // Define the fixed price ranges as seen in the image
    const priceOptions = [
        { label: 'Any Price', value: 'any' },
        { label: 'Rs. 0 - Rs. 499', value: '0-499' },
        { label: 'Rs. 500 - Rs. 999', value: '500-999' },
        { label: 'Rs. 1000 - Rs. 1999', value: '1000-1999' },
        { label: 'Rs. 2000 & Above', value: '2000-Infinity' },
    ];

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-bold border-b pb-2">Filters</h2>
            <FilterSection
                title="Price"
                options={priceOptions}
                selected={[selectedPrice]} // Radio buttons only have one selected value
                onChange={onPriceChange}
                type="radio"
            />
            <FilterSection
                title="Category"
                options={filters.categories}
                selected={selectedCategories}
                onChange={onCategoryChange}
                type="checkbox"
            />
            <FilterSection
                title="Brand"
                options={filters.brands}
                selected={selectedBrands}
                onChange={onBrandChange}
                type="checkbox"
            />
        </div>
    );
};

export default Sidebar;