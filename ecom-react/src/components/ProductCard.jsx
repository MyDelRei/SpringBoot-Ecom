import React from 'react';

const ProductCard = ({ img, name, desc, price }) => (
    <div className="bg-[#F6F6F6] p-4 shadow-sm text-center flex flex-col items-center justify-between min-h-[432px]">
        <div className="self-end text-gray-400 hover:text-red-500 cursor-pointer transition-colors duration-200">
            <i className="far fa-heart text-xl"></i>
        </div>
        <div className="flex-grow flex items-center justify-center mb-4">
            <img
                src={img}
                onError={(e) =>
                    (e.target.src = 'https://placehold.co/200x200/F6F6F6/000000?text=Image')
                }
                alt={name}
                className="max-w-[80%] h-auto object-contain"
            />
        </div>
        <div className="text-gray-900 mb-4">
            <h3 className="text-base font-medium mb-1">{name}</h3>
            <p className="text-sm text-gray-600 mb-2">{desc}</p>
            <p className="text-lg font-bold">{price}</p>
        </div>
        <button className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200">
            Buy Now
        </button>
    </div>
);



export default ProductCard;
