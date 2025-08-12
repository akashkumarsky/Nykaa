import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const handlePrevious = () => {
        if (currentPage > 0) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages - 1) {
            onPageChange(currentPage + 1);
        }
    };

    if (totalPages <= 1) {
        return null; // Don't render pagination if there's only one page
    }

    return (
        <div className="flex items-center justify-center space-x-4 mt-8">
            <button
                onClick={handlePrevious}
                disabled={currentPage === 0}
                className="p-2 rounded-md border bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-medium">
                Page {currentPage + 1} of {totalPages}
            </span>
            <button
                onClick={handleNext}
                disabled={currentPage >= totalPages - 1}
                className="p-2 rounded-md border bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
};

export default Pagination;
