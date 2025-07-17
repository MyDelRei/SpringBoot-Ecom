import React from 'react';
import iphoneImage from '../assets/img/img1.png'; // Adjust the path if this component is deeper

const HeroSection = () => {
    return (
        <section
            className="relative text-white h-screen flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: '#211C24' }}
        >
            <div className="container mx-auto flex flex-col-reverse md:flex-row items-center justify-center px-4 md:px-8">
                {/* Text Content */}
                <div className="flex-1 text-center md:text-left order-2 md:order-none mt-[250px] md:mt-0">
                    <p className="text-[25px] font-medium text-gray-300">Pro.Beyond.</p>
                    <h1 className="text-[72px] font-bold leading-tight">
                        <span className="text-[72px] font-light">iPhone 14</span> Pro
                    </h1>
                    <p className="text-[19px] text-gray-300 mb-8 max-w-md mx-auto md:mx-0">
                        Created to change everything for the better. For everyone
                    </p>
                    <button className="w-[190px] inline-block border border-white text-center text-gray-900 px-6 py-[16px] font-semibold relative overflow-hidden group hover:text-black hover:border-0">
                        <span className="relative z-10 text-white">Shop Now</span>
                        <span className="absolute left-0 top-0 w-0 h-full bg-black transition-all duration-300 group-hover:w-full"></span>
                    </button>
                </div>

                {/* Image */}
                <div className="flex-1 flex justify-center md:justify-end order-1 md:order-none">
                    <img
                        src={iphoneImage}
                        alt="iPhone 14 Pro"
                        className="max-w-xs md:max-w-lg lg:max-w-xl xl:max-w-2xl h-auto object-contain"
                    />
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
