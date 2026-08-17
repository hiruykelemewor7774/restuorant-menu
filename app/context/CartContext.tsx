"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type CartItem = {
  name: string;
  price: string;
  image: string;
  quantity: number;
  category: string;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  changeQuantity: (name: string, category: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  tableNumber: string;
  setTableNumber: (table: string) => void;
  guestInfo: { name: string; phone: string; email: string; address: string; idNumber: string } | null;
  setGuestInfo: (info: { name: string; phone: string; email: string; address: string; idNumber: string } | null) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableNumber, setTableNumber] = useState("");
  const [guestInfo, setGuestInfo] = useState<{
  name: string; phone: string; email: string; address: string; idNumber: string;
} | null>(null);
  

  function addToCart(item: Omit<CartItem, "quantity">) {
    setCart((prev) => {
      const existing = prev.find(
        (c) => c.name === item.name && c.category === item.category
      );
      if (existing) {
        return prev.map((c) =>
          c.name === item.name && c.category === item.category
            ? { ...c, quantity: c.quantity + 1 }
            : c
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }

  function changeQuantity(name: string, category: string, delta: number) {
    setCart((prev) =>
      prev
        .map((c) =>
          c.name === name && c.category === category
            ? { ...c, quantity: c.quantity + delta }
            : c
        )
        .filter((c) => c.quantity > 0)
    );
  }

  function clearCart() {
    setCart([]);
  }

  const totalItems = cart.reduce((sum, c) => sum + c.quantity, 0);
  const totalPrice = cart.reduce((sum, c) => {
    const num = parseFloat(c.price.replace(/[^0-9.]/g, "")) || 0;
    return sum + num * c.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        changeQuantity,
        clearCart,
        totalItems,
        totalPrice,
        tableNumber,
        setTableNumber,
        guestInfo,
        setGuestInfo,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}