import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import HeroSection from '../components/HeroSection';
import ProductHighlights from "../components/ProductHighlights/ProductHighlights.jsx";
import CategoryGrid from "../components/CategoryGrid/CategoryGrid.jsx";
import TabbedProductSection from "../components/TabbedProductSection.jsx";
import BigSummerSale from "../components/BigSaleSection.jsx";
import Footer from "../components/Footer.jsx";

const HomePage = () => {
    return (
        <div>
            <Navbar />
            <HeroSection />
            <ProductHighlights />
            <CategoryGrid />
            <TabbedProductSection />
            <BigSummerSale/>
            <Footer />
        </div>
    );
};

export default HomePage;
