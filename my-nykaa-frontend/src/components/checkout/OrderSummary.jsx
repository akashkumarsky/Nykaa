import React from 'react';
import { useCart } from '../../context/CartContext.jsx';

const OrderSummary = ({ loading, error }) => {
    const { cart, itemCount } = useCart();

    const subtotal = cart?.cartItems?.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    ) || 0;
    const shippingCost = subtotal > 500 ? 0 : 50; // Example: Free shipping for orders over 500
    const total = subtotal + shippingCost;

    return (
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
                {/* Updated this line as requested */}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                </div>
            </div>
            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            <button
                type="submit"
                form="checkout-form" // This links the button to the form in the parent component
                disabled={loading || itemCount === 0}
                className="w-full mt-6 bg-pink-500 text-white font-bold py-3 rounded-md hover:bg-pink-600 disabled:bg-pink-300"
            >
                {/* Updated loading text */}
                {loading ? 'Processing...' : 'Place Order'}
            </button>
        </div>
    );
};

export default OrderSummary;