// src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children, user }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCart = async () => {
        if (!user) {
            setCart(null); // Clear the cart if the user logs out
            return;
        };
        setLoading(true);
        try {
            const cartData = await api.get('/cart');
            setCart(cartData);
        } catch (err) {
            console.error("Failed to fetch cart:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // This effect runs when a user logs in or on the initial page load
    useEffect(() => {
        fetchCart();
    }, [user]);

    const addToCart = async (productId, quantity) => {
        if (!user) {
            alert("Please log in to add items to your cart.");
            return;
        }
        setLoading(true);
        try {
            const updatedCart = await api.post('/cart/items', { productId, quantity });
            setCart(updatedCart); // Update the state with the new cart from the backend
        } catch (err) {
            console.error("Failed to add item to cart:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // This object provides the cart data and functions to all components
    const value = {
        cart,
        addToCart,
        fetchCart,
        loading,
        error,
        itemCount: cart?.cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
