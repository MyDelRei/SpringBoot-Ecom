const Footer = () => {
    return (
        <footer className="bg-black text-white py-16">
            <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-12">
                {/* Company Info & Social Media */}
                <div className="flex flex-col">
                    <a href="#" className="text-2xl font-bold mb-4">
                        cyber
                    </a>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
                        We are a residential interior design firm located in Portland. Our boutique-studio offers more than
                    </p>
                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                            <i className="fab fa-twitter text-xl"></i>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                            <i className="fab fa-facebook-f text-xl"></i>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                            <i className="fab fa-tiktok text-xl"></i>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                            <i className="fab fa-instagram text-xl"></i>
                        </a>
                    </div>
                </div>

                {/* Services Links */}
                <div>
                    <h3 className="text-lg font-semibold mb-6">Services</h3>
                    <ul className="space-y-4">
                        {[
                            'Bonus program',
                            'Gift cards',
                            'Credit and payment',
                            'Service contracts',
                            'Non-cash account',
                            'Payment',
                        ].map((service) => (
                            <li key={service}>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                                    {service}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Assistance to the Buyer Links */}
                <div>
                    <h3 className="text-lg font-semibold mb-6">Assistance to the buyer</h3>
                    <ul className="space-y-4">
                        {[
                            'Find an order',
                            'Terms of delivery',
                            'Exchange and return of goods',
                            'Guarantee',
                            'Frequently asked questions',
                            'Terms of use of the site',
                        ].map((item) => (
                            <li key={item}>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
