import React from 'react';

const ProductCardLarge = ({ title, description, image, reverse = false }) => (
    <div className="bg-white p-8 shadow-sm flex flex-col md:flex-row items-center justify-between min-h-[400px]">
        <div className={`flex-1 flex justify-center items-center p-4 ${reverse ? 'order-2 md:order-2' : 'order-2 md:order-1'}`}>
            <img src={image} alt={title} className="w-full h-full object-contain" />
        </div>
        <div className={`flex-1 text-gray-900 text-center md:text-left ${reverse ? 'md:mr-4 order-1 md:order-1' : 'md:ml-4 order-1 md:order-2'} mb-4 md:mb-0`}>
            <h2 className="text-4xl font-bold mb-2">{title}</h2>
            <p className="text-lg text-slate-600 max-w-sm mx-auto md:mx-0">{description}</p>
        </div>
    </div>
);

export default ProductCardLarge;
