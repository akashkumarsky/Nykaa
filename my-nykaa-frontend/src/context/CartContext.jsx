// src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children, user }) => {
    const [cart, setCart] = useState(null);
    const [loadingProductId, setLoadingProductId] = useState(null);
    const [error, setError] = useState(null);

    const fetchCart = async () => {
        if (!user) {
            setCart(null);
            return;
        }
        try {
            const cartData = await api.get('/cart');
            setCart(cartData);
        } catch (err) {
            console.error("Failed to fetch cart:", err);
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [user]);

    const addToCart = async (productId, quantity) => {
        if (!user) {
            alert("Please log in to add items to your cart.");
            return;
        }
        setLoadingProductId(productId);
        try {
            const updatedCart = await api.post('/cart/items', { productId, quantity });
            setCart(updatedCart);
        } catch (err) {
            console.error("Failed to add item to cart:", err);
            setError(err.message);
        } finally {
            setLoadingProductId(null);
        }
    };

    // NEW: Function to update an item's quantity via API
    const updateItemQuantity = async (cartItemId, quantity) => {
        if (!user) return;
        // Prevent quantity from going below 1
        const newQuantity = Math.max(1, quantity);
        try {
            const updatedCart = await api.put(`/cart/items/${cartItemId}`, { quantity: newQuantity });
            setCart(updatedCart);
        } catch (err) {
            console.error("Failed to update item quantity:", err);
            setError(err.message);
        }
    };

    // NEW: Function to remove an item from the cart via API
    const removeItem = async (cartItemId) => {
        if (!user) return;
        try {
            const updatedCart = await api.delete(`/cart/items/${cartItemId}`);
            setCart(updatedCart);
        } catch (err) {
            console.error("Failed to remove item:", err);
            setError(err.message);
        }
    };

    const value = {
        cart,
        addToCart,
        fetchCart,
        loadingProductId,
        error,
        itemCount: cart?.cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0,
        updateItemQuantity, // Expose the new function
        removeItem,       // Expose the new function
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
