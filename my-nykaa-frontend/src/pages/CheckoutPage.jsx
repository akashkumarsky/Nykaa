// src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { api } from '../api';

const CheckoutPage = ({ setPage }) => {
    const { cart, itemCount, fetchCart, user } = useCart(); // Get user from cart context for prefill
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [address, setAddress] = useState({ fullName: '', street: '', city: '', zip: '' });
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState('new');
    const [addressStatus, setAddressStatus] = useState('loading');

    useEffect(() => {
        const fetchAddresses = async () => {
            if (!user) return;
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
    const shippingCost = subtotal > 500 ? 0 : 50;
    const total = subtotal + shippingCost;

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Step 1: Create a Razorpay order from your backend
            const orderResponse = await api.post('/payment/create-order', { amount: total });
            const razorpayOrder = JSON.parse(orderResponse);

            // Step 2: Configure Razorpay options
            const options = {
                key: 'rzp_test_R5HVrH32DhPWyq', // IMPORTANT: Replace with your Razorpay Key ID
                amount: razorpayOrder.amount,
                currency: "INR",
                name: "Nykaa Clone",
                description: "E-commerce Transaction",
                order_id: razorpayOrder.id,
                handler: async function (response) {
                    // Step 3: This function is called after a successful payment
                    const orderItems = cart.cartItems.map(item => ({
                        productId: item.product.id,
                        quantity: item.quantity,
                    }));
                    const shippingAddress = selectedAddress !== 'new'
                        ? selectedAddress
                        : `${address.fullName}, ${address.street}, ${address.city}, ${address.zip}`;

                    // Step 4: Create the order in your database with payment details
                    await api.post('/orders', {
                        items: orderItems,
                        shippingAddress,
                        razorpayPaymentId: response.razorpay_payment_id,
                        razorpayOrderId: response.razorpay_order_id,
                    });

                    setOrderPlaced(true);
                    fetchCart(); // This will clear the cart
                },
                prefill: {
                    name: address.fullName,
                    email: user?.user?.email, // Prefill user's email
                },
                theme: {
                    color: "#e84393" // A pink theme color
                }
            };

            // Step 5: Open the Razorpay checkout modal
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
                    {/* The 'id' of this form is important, and its onSubmit is now handlePayment */}
                    <form id="checkout-form" onSubmit={handlePayment} className="space-y-4">
                        {/* ... all your address input fields ... */}
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" name="fullName" id="fullName" value={address.fullName} onChange={handleInputChange}
                                disabled={isFormDisabled}
                                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 ${isFormDisabled ? 'bg-gray-100' : ''}`} required />
                        </div>
                        {/* ... other fields ... */}
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
                    <button
                        type="submit"
                        form="checkout-form" // This links the button to the form
                        disabled={loading || itemCount === 0}
                        className="w-full mt-6 bg-pink-500 text-white font-bold py-3 rounded-md hover:bg-pink-600 disabled:bg-pink-300"
                    >
                        {loading ? 'Processing...' : 'Proceed to Payment'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
