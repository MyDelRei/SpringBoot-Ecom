import React from 'react';
import ProductCardLarge from './ProductCardLarge';
import ProductCardSmall from './ProductCardSmall';
import PS5Img from '../../assets/img/img4.png';
import AirPodsImg from '../../assets/img/img2.png';
import VisionProImg from '../../assets/img/img3.png';
import MacbookImg from '../../assets/img/img5.png';

const ProductHighlights = () => {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto md:px-8">
                <div className="flex flex-col md:flex-row" id="main-div">
                    <div className="flex flex-col flex-1">
                        <ProductCardLarge
                            title="Playstation 5"
                            description="Incredibly powerful CPUs, GPUs, and an SSD with integrated I/O will redefine your PlayStation experience."
                            image={PS5Img}
                        />

                        <div className="flex flex-col sm:flex-row">
                            <ProductCardSmall
                                title="Apple AirPods Max"
                                description="Computational audio. Listen, it's powerful"
                                image={AirPodsImg}
                                bgColor="bg-[#EDEDED]"
                            />
                            <ProductCardSmall
                                title="Apple Vision Pro"
                                description="An immersive way to experience entertainment"
                                image={VisionProImg}
                                bgColor="bg-[#353535]"
                                textColor="text-white"
                                reverse
                            />
                        </div>
                    </div>


                    <div className="flex-1 bg-[#D2D2DA] p-8 shadow-sm flex flex-col md:flex-row items-center justify-between min-h-[400px] md:mt-0">
                        <div className="text-gray-900 text-center md:text-left md:mr-8 order-1 mb-4 md:mb-0">
                            <h2 className="text-4xl font-bold mb-2">Macbook Air</h2>
                            <p className="text-lg text-slate-600 max-w-sm mx-auto md:mx-0 mb-6">
                                The new 15-inch MacBook Air makes room for more of what you love with a spacious Liquid Retina display.
                            </p>
                            <button className="w-[190px] inline-block border border-gray-900 text-center text-gray-900 px-6 py-[16px] font-semibold relative overflow-hidden group hover:text-white">
                                <span className="relative z-10">Shop Now</span>
                                <span className="absolute left-0 top-0 w-0 h-full bg-black transition-all duration-300 group-hover:w-full"></span>
                            </button>
                        </div>
                        <div className="order-2">
                            <img src={MacbookImg} alt="Macbook Air" className="h-full object-contain" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductHighlights;
