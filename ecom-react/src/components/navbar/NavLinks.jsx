import React from 'react';

const NavLinks = () => (
    <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 text-gray-700 flex-grow justify-center md:justify-end mb-4 md:mb-0 order-1 md:order-none">
        {['Home', 'About', 'Contact Us', 'Blog'].map((link) => (
            <li key={link}>
                <a
                    href="#"
                    className="block px-3 py-2 rounded-lg text-sm text-slate-500 hover:text-black transition-colors duration-200 font-medium"
                >
                    {link}
                </a>
            </li>
        ))}
    </ul>
);

export default NavLinks;
