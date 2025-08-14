import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { api } from '../api';
import OrderSummary from '../components/checkout/OrderSummary.jsx';

const CheckoutPage = ({ setPage }) => {
    const { cart, fetchCart, user } = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [orderPlaced, setOrderPlaced] = useState(false);

    const [address, setAddress] = useState({ fullName: '', street: '', city: '', zip: '' });
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState('new');
    const [addressStatus, setAddressStatus] = useState('loading');

    useEffect(() => {
        const fetchAddresses = async () => {
            if (!user) {
                setAddressStatus('none');
                return;
            }
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
    }, [user]);

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
    const total = subtotal + (subtotal > 500 ? 0 : 50);

    const handlePayment = async (e) => {
        e.preventDefault();
        if (!cart || cart.cartItems.length === 0) {
            setError("Your cart is empty.");
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const razorpayOrder = await api.post('/payment/create-order', { amount: total });

            const options = {
                key: 'rzp_test_R5HVrH32DhPWyq', // IMPORTANT: Replace with your Razorpay Key ID
                amount: razorpayOrder.amount,
                currency: "INR",
                name: "Nykaa Clone",
                description: "E-commerce Transaction",
                order_id: razorpayOrder.id,
                handler: async function (response) {
                    const orderItems = cart.cartItems.map(item => ({
                        productId: item.product.id,
                        quantity: item.quantity,
                    }));
                    const shippingAddress = selectedAddress !== 'new'
                        ? selectedAddress
                        : `${address.fullName}, ${address.street}, ${address.city}, ${address.zip}`;

                    await api.post('/orders', {
                        items: orderItems,
                        shippingAddress,
                        razorpayPaymentId: response.razorpay_payment_id,
                        razorpayOrderId: response.razorpay_order_id,
                    });

                    setOrderPlaced(true);
                    fetchCart();
                },
                prefill: {
                    name: address.fullName,
                    email: user?.user?.email,
                },
                theme: {
                    color: "#e84393"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

            rzp.on('payment.failed', function (response) {
                setError(`Payment Failed: ${response.error.description}`);
            });

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
                    <form id="checkout-form" onSubmit={handlePayment} className="space-y-4">
                        {addressStatus === 'found' && (
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
                <OrderSummary loading={loading} error={error} />
            </div>
        </div>
    );
};

export default CheckoutPage;