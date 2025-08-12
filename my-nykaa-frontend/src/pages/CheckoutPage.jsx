// src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { api } from '../api';

const CheckoutPage = ({ setPage }) => {
    const { cart, itemCount, fetchCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [orderPlaced, setOrderPlaced] = useState(false);

    const [address, setAddress] = useState({ fullName: '', street: '', city: '', zip: '' });
    
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState('new');
    const [addressStatus, setAddressStatus] = useState('loading');

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const data = await api.get('/orders/addresses');
                if (data && data.length > 0) {
                    setSavedAddresses(data);
                    setSelectedAddress(data[0]); 
                    const parts = data[0].split(', ');
                    if (parts.length === 4) {
                        setAddress({ fullName: parts[0], street: parts[1], city: parts[2], zip: parts[3] });
                    }
                    setAddressStatus('found');
                } else {
                    setAddressStatus('none');
                }
            } catch (err) {
                console.error("Could not fetch saved addresses:", err);
                setAddressStatus('error');
            }
        };
        fetchAddresses();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));
        setSelectedAddress('new');
    };
    
    const handleAddressSelect = (e) => {
        const value = e.target.value;
        setSelectedAddress(value);
        if (value !== 'new') {
            const parts = value.split(', ');
            if (parts.length === 4) {
                setAddress({ fullName: parts[0], street: parts[1], city: parts[2], zip: parts[3] });
            }
        } else {
            setAddress({ fullName: '', street: '', city: '', zip: '' });
        }
    };

    const subtotal = cart?.cartItems?.reduce((sum, item) => sum + item.product.price * item.quantity, 0) || 0;
    const shippingCost = subtotal > 500 ? 0 : 50;
    const total = subtotal + shippingCost;

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!cart || cart.cartItems.length === 0) {
            setError("Your cart is empty.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const orderItems = cart.cartItems.map(item => ({ productId: item.product.id, quantity: item.quantity }));
            
            // **FIXED LOGIC**: Determine the correct shipping address to send.
            const shippingAddress = selectedAddress !== 'new'
                ? selectedAddress // Use the selected address directly if it's not "new"
                : `${address.fullName}, ${address.street}, ${address.city}, ${address.zip}`;

            // Final validation to prevent sending an empty address
            if (shippingAddress.trim() === ',,,') {
                setError("Please fill out all address fields.");
                setLoading(false);
                return;
            }

            await api.post('/orders', { items: orderItems, shippingAddress });
            setOrderPlaced(true);
            fetchCart();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const isFormDisabled = selectedAddress !== 'new';

    if (orderPlaced) {
        return (
            <div className="container mx-auto text-center p-8 my-12 bg-white shadow-lg rounded-lg">
                <h1 className="text-3xl font-bold text-green-600 mb-4">Thank You!</h1>
                <p className="text-lg text-gray-700">Your order has been placed successfully.</p>
                <button onClick={() => setPage('home')} className="mt-8 bg-pink-500 text-white font-bold py-2 px-6 rounded-md hover:bg-pink-600">
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Shipping Address</h2>
                    
                    {savedAddresses.length > 0 && (
                        <div className="mb-4">
                            <label htmlFor="savedAddress" className="block text-sm font-medium text-gray-700">Select a saved address</label>
                            <select id="savedAddress" value={selectedAddress} onChange={handleAddressSelect} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500">
                                {savedAddresses.map((addr, index) => (
                                    <option key={index} value={addr}>{addr}</option>
                                ))}
                                <option value="new">-- Add a New Address --</option>
                            </select>
                        </div>
                    )}

                    <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" name="fullName" id="fullName" value={address.fullName} onChange={handleInputChange} 
                                   disabled={isFormDisabled}
                                   className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 ${isFormDisabled ? 'bg-gray-100' : ''}`} required />
                        </div>
                        <div>
                            <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street Address</label>
                            <input type="text" name="street" id="street" value={address.street} onChange={handleInputChange}
                                   disabled={isFormDisabled}
                                   className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 ${isFormDisabled ? 'bg-gray-100' : ''}`} required />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-grow">
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                                <input type="text" name="city" id="city" value={address.city} onChange={handleInputChange}
                                       disabled={isFormDisabled}
                                       className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 ${isFormDisabled ? 'bg-gray-100' : ''}`} required />
                            </div>
                            <div>
                                <label htmlFor="zip" className="block text-sm font-medium text-gray-700">ZIP / Postal Code</label>
                                <input type="text" name="zip" id="zip" value={address.zip} onChange={handleInputChange}
                                       disabled={isFormDisabled}
                                       className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 ${isFormDisabled ? 'bg-gray-100' : ''}`} required />
                            </div>
                        </div>
                    </form>
                </div>

                <div className="bg-white p-6 rounded-lg shadow h-fit">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Order Summary</h2>
                    <div className="space-y-2 text-gray-600">
                        <div className="flex justify-between">
                            <span>Subtotal ({itemCount} items)</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>₹{shippingCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg text-gray-800 border-t pt-2 mt-2">
                            <span>Total</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                    <button type="submit" form="checkout-form" disabled={loading || itemCount === 0} className="w-full mt-6 bg-pink-500 text-white font-bold py-3 rounded-md hover:bg-pink-600 disabled:bg-pink-300">
                        {loading ? 'Placing Order...' : 'Place Order'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
