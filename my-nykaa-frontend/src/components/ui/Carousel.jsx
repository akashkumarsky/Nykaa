import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Carousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const prevSlide = () => {
        const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const nextSlide = () => {
        const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    // Auto-play functionality
    useEffect(() => {
        const interval = setInterval(nextSlide, 5000); // Slide every 5 seconds
        return () => clearInterval(interval);
    }, [currentIndex]);

    if (!images || images.length === 0) return null;

    return (
        <div className="relative w-full h-64 md:h-96 group rounded-lg overflow-hidden">
            {/* Image */}
            <div
                style={{ backgroundImage: `url(${images[currentIndex]})` }}
                className="w-full h-full bg-center bg-cover duration-500"
            ></div>

            {/* Left Arrow */}
            <button
                onClick={prevSlide}
                className="hidden group-hover:flex absolute top-1/2 left-5 -translate-y-1/2 p-2 rounded-full bg-pink-500/30 text-pink-500 hover:bg-pink-500/50 cursor-pointer transition"
            >
                <ChevronLeft size={30} />
            </button>

            {/* Right Arrow */}
            <button
                onClick={nextSlide}
                className="hidden group-hover:flex absolute top-1/2 right-5 -translate-y-1/2 p-2 rounded-full bg-pink-500/30 text-pink-500 hover:bg-pink-500/50 cursor-pointer transition"
            >
                <ChevronRight size={30} />
            </button>

            {/* Indicator Dots */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {images.map((_, index) => (
                    <span
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full cursor-pointer transition-colors ${currentIndex === index ? 'bg-pink-500' : 'bg-pink-200 hover:bg-pink-500'
                            }`}
                    ></span>
                ))}
            </div>
        </div>
    );
};

export default Carousel;
