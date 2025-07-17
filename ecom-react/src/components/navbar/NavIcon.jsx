import React from 'react';
import { FaHeart, FaShoppingCart, FaUserCircle } from 'react-icons/fa';

const NavIcons = () => (
    <div className="flex items-center space-x-6 justify-center md:justify-start order-3 md:order-none">
        <a
            href="#"
            className="text-gray-700 hover:text-gray-900 transition-colors duration-200 rounded-full p-2"
            aria-label="Favorites"
        >
            <FaHeart className="text-lg" />
        </a>
        <a
            href="#"
            className="text-gray-700 hover:text-gray-900 transition-colors duration-200 rounded-full p-2"
            aria-label="Cart"
        >
            <FaShoppingCart className="text-lg" />
        </a>
        <a
            href="#"
            className="text-gray-700 hover:text-gray-900 transition-colors duration-200 rounded-full p-2"
            aria-label="User Account"
        >
            <FaUserCircle className="text-lg" />
        </a>
    </div>
);

export default NavIcons;
