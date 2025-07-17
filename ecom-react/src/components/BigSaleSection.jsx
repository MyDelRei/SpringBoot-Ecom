import summerBg from '../assets/img/img7.png'; // adjust path as needed

const BigSummerSale = () => {
    return (
        <a
            className="relative bg-black text-white py-24 flex items-center justify-center overflow-hidden"
            style={{
                backgroundImage: `url(${summerBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
                <h2 className="text-5xl text-transparent md:text-7xl font-bold mb-4">Big Summer Sale</h2>
                <p className="text-lg text-transparent md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                    Commodo fames vitae vitae leo mauris in. Eu consequat.
                </p>
                <a href="#" className="">
                    <p className="text-transparent">Shop Now</p>
                </a>
            </div>
        </a>
    );
};

export default BigSummerSale;
