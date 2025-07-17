import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import NavLinks from './NavLinks';
import SearchBar from './SearchBar';
import NavIcons from './NavIcon';
import MobileToggle from './MobileToggle';
import { motion, AnimatePresence } from 'framer-motion';

const menuVariants = {
    hidden: { opacity: 0, height: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.3, ease: 'easeInOut' } },
};

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

    // Track window width to toggle desktop/mobile layout reactively
    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // If desktop, always show menu (no toggle)
    // If mobile, show menu only if menuOpen === true

    return (
        <nav className="bg-white p-4 shadow-sm">
            <div className="container mx-auto flex items-center justify-between flex-wrap">
                <Logo />
                {!isDesktop && (
                    <MobileToggle onClick={() => setMenuOpen(!menuOpen)} isOpen={menuOpen} />
                )}

                {/* Menu: on desktop always flex, on mobile animate toggle */}
                {(isDesktop || menuOpen) && (
                    <motion.div
                        className={`w-full flex-grow md:flex md:items-center md:w-auto flex-col md:flex-row mt-4 md:mt-0`}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={menuVariants}
                        style={{ overflow: 'hidden' }}
                    >
                        <SearchBar />
                        <NavLinks />
                        <NavIcons />
                    </motion.div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
