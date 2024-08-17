"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookie from 'js-cookie';

interface CartItem {
    productId: string;
    size: string;
    quantity: string;
}

interface CartContextType {
    cartCount: number;
    updateCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cartCount, setCartCount] = useState<number>(0);

    const updateCart = () => {
        const cartData = Cookie.get('cart');
        if (cartData) {
            const cart: CartItem[] = JSON.parse(cartData);
            // console.log(cart.length);
            // const totalItems = cart.reduce((total, item) => total + parseInt(item.quantity, 10), 0);
            setCartCount(cart.length);
        }
    };

    useEffect(() => {
        updateCart();
    }, []);

    return (
        <CartContext.Provider value={{ cartCount, updateCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};