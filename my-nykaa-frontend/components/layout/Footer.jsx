// src/components/layout/Footer.jsx
import React from 'react';

const Footer = () => (
    <footer className="bg-gray-800 text-gray-300 mt-auto">
        <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">NYKAA</h3>
                    <ul>
                        <li className="mb-2"><a href="#" className="hover:text-pink-400">Who are we?</a></li>
                        <li className="mb-2"><a href="#" className="hover:text-pink-400">Careers</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Help</h3>
                    <ul>
                        <li className="mb-2"><a href="#" className="hover:text-pink-400">Contact Us</a></li>
                        <li className="mb-2"><a href="#" className="hover:text-pink-400">FAQ</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Top Categories</h3>
                    <ul>
                        <li className="mb-2"><a href="#" className="hover:text-pink-400">Makeup</a></li>
                        <li className="mb-2"><a href="#" className="hover:text-pink-400">Skin</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Get special discount!</h3>
                    <div className="flex">
                        <input type="email" placeholder="Your Email" className="bg-gray-700 text-white p-2 rounded-l-md focus:outline-none w-full" />
                        <button className="bg-pink-500 text-white px-4 py-2 rounded-r-md">Send</button>
                    </div>
                </div>
            </div>
            <div className="mt-12 border-t border-gray-700 pt-8 text-center text-sm">
                <p>&copy; 2025 Nykaa E-Retail Pvt. Ltd. All Rights Reserved.</p>
            </div>
        </div>
    </footer>
);

export default Footer;
