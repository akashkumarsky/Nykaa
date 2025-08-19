// src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { api } from '../api';
import OrderSummary from '../components/checkout/OrderSummary.jsx';

const CheckoutPage = ({ setPage }) => {
  const { cart, fetchCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // ✅ address now includes phone
  const [address, setAddress] = useState({ fullName: '', street: '', city: '', zip: '', phone: '' });
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('new');
  const [errors, setErrors] = useState({});

  // inside useEffect -> fetchAddresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const data = await api.get('/orders/addresses');
        if (data?.length > 0) {
          setSavedAddresses(data);
          setSelectedAddress(data[0]);

          const parts = data[0].split(', ');
          if (parts.length === 4) {
            setAddress({
              fullName: parts[0],
              street: parts[1],
              city: parts[2],
              zip: parts[3],
              phone: ''   // backward compatibility
            });
          } else if (parts.length === 5) {
            setAddress({
              fullName: parts[0],
              street: parts[1],
              city: parts[2],
              zip: parts[3],
              phone: parts[4]
            });
          }
        }
      } catch (err) {
        console.error("Could not fetch saved addresses:", err);
      }
    };
    fetchAddresses();
  }, []);

  // inside handleAddressSelect
  const handleAddressSelect = (e) => {
    const value = e.target.value;
    setSelectedAddress(value);

    if (value !== 'new') {
      const parts = value.split(', ');
      if (parts.length === 4) {
        setAddress({
          fullName: parts[0],
          street: parts[1],
          city: parts[2],
          zip: parts[3],
          phone: ''
        });
      } else if (parts.length === 5) {
        setAddress({
          fullName: parts[0],
          street: parts[1],
          city: parts[2],
          zip: parts[3],
          phone: parts[4]
        });
      }
    } else {
      setAddress({ fullName: '', street: '', city: '', zip: '', phone: '' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
    setSelectedAddress('new');
  };



  // ✅ Validation rules
  const validateFields = () => {
    let newErrors = {};

    if (!/^[a-zA-Z\s]+$/.test(address.fullName.trim())) {
      newErrors.fullName = "Name must contain only letters and spaces";
    }
    if (!/^[a-zA-Z0-9\s,.-]+$/.test(address.street.trim())) {
      newErrors.street = "Street must contain only letters, numbers, , . -";
    }
    if (!/^[a-zA-Z\s]+$/.test(address.city.trim())) {
      newErrors.city = "City must contain only letters";
    }
    if (!/^\d{5,6}$/.test(address.zip.trim())) {
      newErrors.zip = "ZIP code must be 5–6 digits";
    }
    if (!/^[6-9]\d{9}$/.test(address.phone.trim())) {
      newErrors.phone = "Phone must be a valid 10-digit number starting with 6-9";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Subtotal, GST & Shipping
  const subtotal = cart?.cartItems?.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  ) || 0;

  const shippingCost = subtotal > 500 ? 0 : 50;
  const gstRate = 0.18;
  const gst = subtotal * gstRate;
  const total = subtotal + gst + shippingCost;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!cart || cart.cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (selectedAddress === 'new' && !validateFields()) {
      return;
    }

    const shippingAddress = selectedAddress !== 'new'
      ? selectedAddress
      : `${address.fullName}, ${address.street}, ${address.city}, ${address.zip}, ${address.phone}`;

    try {
      setLoading(true);
      setError(null);

      const orderItems = cart.cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }));

      const paymentOrder = await api.post("/payment/create-order", { amount: total });

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setError("Failed to load Razorpay SDK");
        setLoading(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: paymentOrder.amount,
        currency: "INR",
        name: "Nykaa Clone",
        description: "Order Payment",
        order_id: paymentOrder.id,
        handler: async (response) => {
          try {
            await api.post('/orders', {
              items: orderItems,
              shippingAddress,
              totalAmount: total,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id
            });
            setOrderPlaced(true);
            fetchCart();
          } catch {
            setError("Payment successful but order could not be saved.");
          }
        },
        theme: { color: "#EC4899" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      setError("Payment initialization failed.");
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="container mx-auto text-center p-8 my-12 bg-white shadow-xl rounded-2xl border border-gray-100">
        <h1 className="text-4xl font-extrabold text-green-600 mb-4">🎉 Thank You!</h1>
        <p className="text-lg text-gray-600">Your order has been placed successfully.</p>
        <button
          onClick={() => setPage('home')}
          className="mt-8 bg-pink-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-pink-600 transition-all"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">Secure Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Address Section */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-md border border-gray-100">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">📦 Shipping Address</h2>
          {savedAddresses.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Choose a saved address
              </label>
              <div className="relative">
                <select
                  value={selectedAddress}
                  onChange={handleAddressSelect}
                  className="appearance-none w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-700 font-medium shadow-sm focus:ring-2 focus:ring-pink-500 cursor-pointer"
                >
                  {savedAddresses.map((addr, index) => (
                    <option key={index} value={addr}>
                      {addr}
                    </option>
                  ))}
                  <option value="new">➕ Add a New Address</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-5">
            {/* Full Name */}
            <div>
              <input
                name="fullName"
                placeholder="Full Name"
                value={address.fullName}
                onChange={handleInputChange}
                disabled={selectedAddress !== 'new'}
                required
                className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-pink-400"
              />
              {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
            </div>

            {/* Street */}
            <div>
              <input
                name="street"
                placeholder="Street Address"
                value={address.street}
                onChange={handleInputChange}
                disabled={selectedAddress !== 'new'}
                required
                className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-pink-400"
              />
              {errors.street && <p className="text-red-500 text-sm">{errors.street}</p>}
            </div>

            {/* City & ZIP */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  name="city"
                  placeholder="City"
                  value={address.city}
                  onChange={handleInputChange}
                  disabled={selectedAddress !== 'new'}
                  required
                  className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-pink-400"
                />
                {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
              </div>
              <div>
                <input
                  name="zip"
                  placeholder="ZIP Code"
                  value={address.zip}
                  onChange={handleInputChange}
                  disabled={selectedAddress !== 'new'}
                  required
                  className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-pink-400"
                />
                {errors.zip && <p className="text-red-500 text-sm">{errors.zip}</p>}
              </div>
            </div>

            {/* Phone */}
            <div>
              <input
                name="phone"
                placeholder="Phone Number"
                value={address.phone}
                onChange={handleInputChange}
                disabled={selectedAddress !== 'new'}
                required
                className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-pink-400"
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>


          </form>
        </div>

        {/* Order Summary */}
        <OrderSummary loading={loading} error={error} />
      </div>
    </div>
  );
};

export default CheckoutPage;