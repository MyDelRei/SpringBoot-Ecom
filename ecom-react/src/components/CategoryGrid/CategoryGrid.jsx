import React from 'react';
import { FaMobileAlt, FaCamera, FaHeadphones, FaDesktop, FaGamepad, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { FaLaptop } from 'react-icons/fa6';
import CategoryCard from './CategoryCard';

const categories = [
    { icon: FaMobileAlt, label: 'Phones' },
    { icon: FaLaptop, label: 'Laptop' },
    { icon: FaCamera, label: 'Cameras' },
    { icon: FaHeadphones, label: 'Headphones' },
    { icon: FaDesktop, label: 'Computers' },
    { icon: FaGamepad, label: 'Gaming' },
];

const CategoryGrid = () => {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Browse By Category</h2>
                    <div className="flex space-x-4">
                        <button className="w-10 h-10 flex items-center justify-center border border-gray-300 text-gray-700 hover:text-gray-900 transition-colors duration-200">
                            <FaChevronLeft />
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center border border-gray-300 text-gray-700 hover:text-gray-900 transition-colors duration-200">
                            <FaChevronRight />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {categories.map((cat, index) => (
                        <CategoryCard key={index} icon={cat.icon} label={cat.label} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryGrid;
