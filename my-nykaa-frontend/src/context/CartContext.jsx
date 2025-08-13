// src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children, user }) => {
    const [cart, setCart] = useState(null);
    // UPDATED: Replaced 'loading' with 'loadingProductId' to track a specific item
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
        // UPDATED: Set the ID of the product that is currently being added
        setLoadingProductId(productId);
        try {
            const updatedCart = await api.post('/cart/items', { productId, quantity });
            setCart(updatedCart);
        } catch (err) {
            console.error("Failed to add item to cart:", err);
            setError(err.message);
        } finally {
            // UPDATED: Clear the loading ID when the operation is complete
            setLoadingProductId(null);
        }
    };

    const value = {
        cart,
        addToCart,
        fetchCart,
        loadingProductId, // Pass down the specific ID
        error,
        itemCount: cart?.cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
