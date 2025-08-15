import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext.jsx";
import { api } from "../api";
import OrderSummary from "../components/checkout/OrderSummary.jsx";

const CheckoutPage = ({ setPage }) => {
  const { cart, fetchCart, user } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);

<<<<<<< HEAD
  const [address, setAddress] = useState({ fullName: '', street: '', city: '', zip: '' });
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('new');
  const [addressStatus, setAddressStatus] = useState('loading');
  const [saveAddress, setSaveAddress] = useState(false);

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
=======
  const [address, setAddress] = useState({
    fullName: "",
    street: "",
    city: "",
    zip: "",
  });

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("new");
  const [saveAddress, setSaveAddress] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user) return;
      try {
        const data = await api.get("/orders/addresses");
        const normalized = (Array.isArray(data) ? data : []).map((item, idx) => {
          if (typeof item === "string") {
            const parts = item.split(",").map((s) => s.trim());
            const [fullName = "", street = "", city = "", zip = ""] = parts;
            return {
              id: `str-${idx}`,
              fullName,
              street,
              city,
              zip,
              label: item,
              textOnly: true,
            };
          }
          if (item && typeof item === "object") {
            const id = item.id != null ? String(item.id) : `obj-${idx}`;
            return {
              id,
              fullName: item.fullName ?? "",
              street: item.street ?? "",
              city: item.city ?? "",
              zip: item.zip ?? "",
              label: `${item.fullName}, ${item.street}, ${item.city}, ${item.zip}`,
              textOnly: false,
            };
          }
          return null;
        }).filter(Boolean);

        setAddresses(normalized);

        if (normalized.length > 0) {
          setSelectedAddressId(normalized[0].id);
        }
      } catch (err) {
        console.error("Could not fetch saved addresses:", err);
>>>>>>> c0070bc1d6b950b7fddafb65721809d031668316
      }
    };
    fetchAddresses();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
<<<<<<< HEAD
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
=======
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const subtotal =
    cart?.cartItems?.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    ) || 0;
  const total = subtotal + (subtotal > 500 ? 0 : 50);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!cart || cart.cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
>>>>>>> c0070bc1d6b950b7fddafb65721809d031668316
    }
  };

<<<<<<< HEAD
  const subtotal = cart?.cartItems?.reduce((sum, item) => sum + item.product.price * item.quantity, 0) || 0;
  const total = subtotal + (subtotal > 500 ? 0 : 50);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!cart || cart.cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }
=======
    const selected = addresses.find((a) => a.id === selectedAddressId);
    const hasFormAddress =
      address.fullName && address.street && address.city && address.zip;

    if (!selected && !hasFormAddress) {
      setError("Please choose a saved address or fill in a new one.");
      return;
    }

>>>>>>> c0070bc1d6b950b7fddafb65721809d031668316
    setLoading(true);
    setError(null);

    try {
<<<<<<< HEAD
      const razorpayOrder = await api.post('/payment/create-order', { amount: total });

      const options = {
        key: 'rzp_test_R5HVrH32DhPWyq', // Replace with your Razorpay Key ID
=======
      const razorpayOrder = await api.post("/payment/create-order", {
        amount: total,
      });

      const options = {
        key: "rzp_test_R5HVrH32DhPWyq",
>>>>>>> c0070bc1d6b950b7fddafb65721809d031668316
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "Nykaa Clone",
        description: "E-commerce Transaction",
        order_id: razorpayOrder.id,
        handler: async function (response) {
<<<<<<< HEAD
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
            saveAddress: saveAddress && selectedAddress === 'new', // save only if new
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
          });
=======
          const orderItems = cart.cartItems.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          }));

          const useAddressId = selected && !selected.textOnly;
          const payload = {
            items: orderItems,
            addressId: useAddressId ? parseInt(selected.id, 10) : null,
            shippingAddress: useAddressId
              ? null
              : selected
              ? selected.label
              : `${address.fullName}, ${address.street}, ${address.city}, ${address.zip}`,
            saveAddress: !selected && !!saveAddress,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
          };

          await api.post("/orders", payload);
>>>>>>> c0070bc1d6b950b7fddafb65721809d031668316

          setOrderPlaced(true);
          fetchCart();
        },
        prefill: {
<<<<<<< HEAD
          name: address.fullName,
          email: user?.user?.email,
        },
        theme: {
          color: "#e84393"
        }
=======
          name:
            (addresses.find((a) => a.id === selectedAddressId)?.fullName) ||
            address.fullName ||
            "",
          email: user?.user?.email,
        },
        theme: { color: "#e84393" },
>>>>>>> c0070bc1d6b950b7fddafb65721809d031668316
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

<<<<<<< HEAD
      rzp.on('payment.failed', function (response) {
        setError(`Payment Failed: ${response.error.description}`);
      });

=======
      rzp.on("payment.failed", function (response) {
        setError(`Payment Failed: ${response.error.description}`);
      });
>>>>>>> c0070bc1d6b950b7fddafb65721809d031668316
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="container mx-auto text-center p-8 my-12 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Thank You!</h1>
<<<<<<< HEAD
        <p className="text-lg text-gray-700">Your order has been placed successfully.</p>
        <button onClick={() => setPage('home')} className="mt-8 bg-pink-500 text-white font-bold py-2 px-6 rounded-md hover:bg-pink-600">
=======
        <p className="text-lg text-gray-700">
          Your order has been placed successfully.
        </p>
        <button
          onClick={() => setPage("home")}
          className="mt-8 bg-pink-500 text-white font-bold py-2 px-6 rounded-md hover:bg-pink-600"
        >
>>>>>>> c0070bc1d6b950b7fddafb65721809d031668316
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
<<<<<<< HEAD
        {/* Address Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Shipping Address</h2>

          {addressStatus === 'found' && savedAddresses.length > 0 && (
            <div className="mb-4">
              <label htmlFor="savedAddress" className="block text-sm font-medium text-gray-700">Select a saved address</label>
              <select
                id="savedAddress"
                value={selectedAddress}
                onChange={handleAddressSelect}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              >
                {savedAddresses.map((addr, index) => (
                  <option key={index} value={addr}>{addr}</option>
                ))}
                <option value="new">➕ Add a New Address</option>
              </select>
            </div>
          )}

          {/* New / Editable Address Form */}
          <form id="checkout-form" onSubmit={handlePayment} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="fullName"
                id="fullName"
                value={address.fullName}
                onChange={handleInputChange}
                disabled={selectedAddress !== 'new'}
                placeholder="Enter full name"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 ${selectedAddress !== 'new' ? 'bg-gray-100' : ''}`}
                required
              />
            </div>
            <div>
              <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street Address</label>
              <input
                type="text"
                name="street"
                id="street"
                value={address.street}
                onChange={handleInputChange}
                disabled={selectedAddress !== 'new'}
                placeholder="House No, Area, Landmark"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 ${selectedAddress !== 'new' ? 'bg-gray-100' : ''}`}
                required
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-grow">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  value={address.city}
                  onChange={handleInputChange}
                  disabled={selectedAddress !== 'new'}
                  placeholder="Enter city"
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 ${selectedAddress !== 'new' ? 'bg-gray-100' : ''}`}
                  required
                />
              </div>
              <div>
                <label htmlFor="zip" className="block text-sm font-medium text-gray-700">ZIP / Postal Code</label>
                <input
                  type="text"
                  name="zip"
                  id="zip"
                  value={address.zip}
                  onChange={handleInputChange}
                  disabled={selectedAddress !== 'new'}
                  placeholder="123456"
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 ${selectedAddress !== 'new' ? 'bg-gray-100' : ''}`}
                  required
                />
              </div>
            </div>

            {/* Save Address Checkbox */}
            {selectedAddress === 'new' && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="saveAddress"
                  checked={saveAddress}
                  onChange={(e) => setSaveAddress(e.target.checked)}
                />
                <label htmlFor="saveAddress" className="text-sm text-gray-700">
                  Save this address for future orders
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Place Order & Pay'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
=======
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Shipping Address
          </h2>

          {addresses.length > 0 && (
            <div className="mb-6">
              <label
                htmlFor="savedAddress"
                className="block text-sm font-medium text-gray-700"
              >
                Choose a Saved Address
              </label>
              <select
                id="savedAddress"
                value={selectedAddressId}
                onChange={(e) => setSelectedAddressId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              >
                {addresses.map((addr) => (
                  <option key={addr.id} value={addr.id}>
                    {addr.label}
                  </option>
                ))}
                <option value="new">➕ Add New Address</option>
              </select>

              {selectedAddressId &&
                selectedAddressId !== "new" && (
                  <div className="mt-3 text-sm text-gray-700 bg-gray-50 rounded p-3">
                    {addresses.find((a) => a.id === selectedAddressId)?.label}
                  </div>
                )}
            </div>
          )}

          {(addresses.length === 0 || selectedAddressId === "new") && (
            <>
              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="px-3 text-gray-500 text-sm">
                  Fill New Address
                </span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <form
                id="checkout-form"
                onSubmit={handlePayment}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    value={address.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="street"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="street"
                    id="street"
                    value={address.street}
                    onChange={handleInputChange}
                    placeholder="House No, Area, Landmark"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-grow">
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      id="city"
                      value={address.city}
                      onChange={handleInputChange}
                      placeholder="Enter city"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="zip"
                      className="block text-sm font-medium text-gray-700"
                    >
                      ZIP / Postal Code
                    </label>
                    <input
                      type="text"
                      name="zip"
                      id="zip"
                      value={address.zip}
                      onChange={handleInputChange}
                      placeholder="123456"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="saveAddress"
                    checked={saveAddress}
                    onChange={(e) => setSaveAddress(e.target.checked)}
                  />
                  <label
                    htmlFor="saveAddress"
                    className="text-sm text-gray-700"
                  >
                    Save this address for future orders
                  </label>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600 disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Place Order & Pay"}
                </button>
              </form>
            </>
          )}
        </div>

>>>>>>> c0070bc1d6b950b7fddafb65721809d031668316
        <OrderSummary loading={loading} error={error} />
      </div>
    </div>
  );
};

export default CheckoutPage;
