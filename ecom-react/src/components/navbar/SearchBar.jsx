import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = () => (
    <div
        className="w-full md:w-1/3 flex items-center bg-gray-100 rounded-[5px] px-4 py-2 mb-4 md:mb-0 md:mr-4
        border border-transparent hover:border-black focus-within:border-black transition-all duration-200 group"
    >
        <FaSearch className="text-gray-500 mr-3 transition-colors duration-200 group-hover:text-black" />
        <input
            type="text"
            placeholder="Search"
            className="w-full bg-transparent text-gray-800 outline-none placeholder-gray-500 group-hover:text-black transition-colors duration-200"
        />
    </div>
);

export default SearchBar;
