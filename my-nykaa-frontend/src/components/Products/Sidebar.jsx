import React from 'react';
import { ChevronDown } from 'lucide-react';

// A reusable component for each collapsible filter section
const FilterSection = ({ title, options, selected, onChange, type = 'checkbox' }) => (
    <details className="border-b border-pink-200 py-2">
        <summary className="font-semibold cursor-pointer flex justify-between items-center py-2 text-black">
            {title}
            <ChevronDown className="h-5 w-5 transition-transform details-open:rotate-180" />
        </summary>
        <ul className="pt-2 space-y-1">
            {options.map(option => {
                const isObject = typeof option === 'object' && option !== null;
                const key = isObject ? option.id || option.value || option.name : option;
                const value = isObject ? option.value || option.name : option;
                const label = isObject ? option.label || option.name : option;

                return (
                    <li key={key} className="flex items-center">
                        <input
                            type={type}
                            id={`${title}-${value}`}
                            name={title}
                            value={value}
                            checked={selected.includes(value)}
                            onChange={() => onChange(value)}
                            className={`h-4 w-4 border-pink-400 accent-pink-600 focus:ring-pink-500 ${type === 'radio' ? 'rounded-full' : 'rounded'}`}
                        />
                        <label
                            htmlFor={`${title}-${value}`}
                            className="ml-3 text-sm text-black"
                        >
                            {label}
                        </label>
                    </li>
                );
            })}
        </ul>
    </details>
);

const Sidebar = ({
    filters,
    selectedCategories, onCategoryChange,
    selectedBrands, onBrandChange,
    selectedPrice, onPriceChange
}) => {
    // Define the fixed price ranges
    const priceOptions = [
        { label: 'Any Price', value: 'any' },
        { label: 'Rs. 0 - Rs. 499', value: '0-499' },
        { label: 'Rs. 500 - Rs. 999', value: '500-999' },
        { label: 'Rs. 1000 - Rs. 1999', value: '1000-1999' },
        { label: 'Rs. 2000 & Above', value: '2000-Infinity' },
    ];

    return (
        <div className="bg-pink-50 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-bold text-black border-b border-pink-200 pb-2">
                Filters
            </h2>
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
