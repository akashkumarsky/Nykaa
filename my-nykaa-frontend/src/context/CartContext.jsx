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

    const removeFromCart = (productId) => {
        if (!cart) return;

        // Remove item locally
        const updatedCart = {
            ...cart,
            cartItems: cart.cartItems.filter(item => item.product.id !== productId)
        };

        setCart(updatedCart);
    };


    const value = {
        cart,
        addToCart,
        removeFromCart, // add it to context
        fetchCart,
        loadingProductId,
        error,
        itemCount: cart?.cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
