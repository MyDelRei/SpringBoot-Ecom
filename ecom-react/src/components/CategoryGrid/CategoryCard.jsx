import React from 'react';

const CategoryCard = ({ icon: Icon, label }) => {
    return (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-100 shadow-xs text-gray-900 text-center h-[160px] cursor-pointer hover:bg-gray-200 transition-colors duration-200 rounded-lg">
            <Icon className="text-4xl mb-3" />
            <span className="text-base font-medium">{label}</span>
        </div>
    );
};

export default CategoryCard;
