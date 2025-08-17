import React from 'react';
import { useCart } from '../../context/CartContext.jsx';

const OrderSummary = ({ loading, error }) => {
    const { cart, itemCount } = useCart();

    const subtotal = cart?.cartItems?.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    ) || 0;

    const shippingCost = subtotal > 500 ? 0 : 50;

    // GST (18%)
    const gstRate = 0.18;
    const gst = subtotal * gstRate;

    const total = subtotal + gst + shippingCost;

    return (
        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 h-fit">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">🧾 Order Summary</h2>
            <div className="space-y-3 text-gray-600">
                <div className="flex justify-between">
                    <span>Subtotal ({itemCount} items)</span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                    <span>GST (18%)</span>
                    <span className="font-medium">₹{gst.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className={shippingCost === 0 ? "text-green-500 font-medium" : ""}>
                        {shippingCost === 0 ? "FREE" : `₹${shippingCost.toFixed(2)}`}
                    </span>
                </div>

                <div className="flex justify-between text-lg font-bold border-t pt-4">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                </div>
            </div>

            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

            <button
                type="submit"
                form="checkout-form"
                disabled={loading || itemCount === 0}
                className="w-full mt-8 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold py-3 rounded-lg shadow hover:from-pink-600 hover:to-pink-700 transition-all disabled:from-gray-300 disabled:to-gray-400"
            >
                {loading ? 'Processing...' : 'Place Order'}
            </button>
        </div>
    );
};

export default OrderSummary;
