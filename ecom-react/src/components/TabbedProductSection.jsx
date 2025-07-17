import React, { useState } from 'react';
import ProductCard from './ProductCard';

const tabs = [
    { id: 'new-arrival', label: 'New Arrival' },
    { id: 'bestseller', label: 'Bestseller' },
    { id: 'featured', label: 'Featured Products' },
];

const products = {
    'new-arrival': [
        {
            id: 1,
            name: 'Apple iPhone 14 Pro Max',
            desc: '128GB Deep Purple',
            price: '$900',
            img: 'img6.png', // local asset filename only
        },
        {
            id: 2,
            name: 'Blackmagic Pocket Cinema Camera 6k',
            desc: 'Camera 6k',
            price: '$2535',
            img: 'https://placehold.co/200x200/F6F6F6/000000?text=Camera',
        },
        // ...more
    ],
    bestseller: [
        {
            id: 3,
            name: 'Samsung Galaxy Watch6',
            desc: 'Classic 47mm Black',
            price: '$369',
            img: 'https://placehold.co/200x200/F6F6F6/000000?text=Bestseller+1',
        },
        // ...
    ],
    featured: [
        {
            id: 4,
            name: 'Galaxy Buds FE',
            desc: 'Graphite',
            price: '$99.99',
            img: 'https://placehold.co/200x200/F6F6F6/000000?text=Featured+1',
        },
        // ...
    ],
};

const TabbedProductSection = () => {
    const [activeTab, setActiveTab] = useState('new-arrival');

    // Helper to get correct image src (local or external)
    const getImageSrc = (img) => {
        // If img string starts with http, return as is (external)
        if (img.startsWith('http')) return img;
        // Otherwise, assume local asset in /assets/img/
        return new URL(`../assets/img/${img}`, import.meta.url).href;
    };

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 md:px-8">
                {/* Tabs */}
                <div className="mb-8 flex space-x-6 border-b border-gray-200">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`tab-button py-3 px-1 text-lg ${
                                activeTab === tab.id
                                    ? 'font-semibold text-gray-900 border-b-2 border-gray-900'
                                    : 'font-medium text-gray-500 hover:text-gray-900'
                            } transition-colors duration-200`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Grid of Products */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[15px]">
                    {products[activeTab].map((product) => (
                        <ProductCard
                            key={product.id}
                            img={getImageSrc(product.img)}
                            name={product.name}
                            desc={product.desc}
                            price={product.price}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TabbedProductSection;
