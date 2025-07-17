import React from 'react';

const ProductCardSmall = ({ title, description, image, bgColor = 'bg-gray-200', textColor = 'text-gray-900', reverse = false }) => (
    <div className={`${bgColor} p-6 shadow-sm flex-1 flex flex-col md:flex-row items-center justify-between min-h-[250px]`}>
        <div className={`flex-1 flex justify-center items-center p-2 ${reverse ? 'order-2 md:order-2' : 'order-1 md:order-1'}`}>
            <img src={image} alt={title} className="w-full h-full object-contain" />
        </div>
        <div className={`flex-1 ${textColor} text-center md:text-left ${reverse ? 'md:mr-4 order-1 md:order-1' : 'md:ml-4 order-2 md:order-2'} mb-4 md:mb-0`}>
            <h2 className="text-2xl font-bold mb-1">{title}</h2>
            <p className="text-base max-w-xs mx-auto md:mx-0">{description}</p>
        </div>
    </div>
);

export default ProductCardSmall;
