import { useMemo, useState, useEffect } from "react";
import type { CartItem, Guitar, GuitarID } from "../types";
export const useCart = () => {
  const initialCart = () => {
		const storedCart = localStorage.getItem("cart");
		return storedCart ? JSON.parse(storedCart) : [];
	}
  const [cart, setCart] = useState<CartItem[]>(initialCart);


	useEffect(() => {
		localStorage.setItem("cart", JSON.stringify(cart));
	}, [cart])
	
  const addToCart = (item: Guitar) => {
    const existingItem = cart.findIndex((cartItem) => cartItem.id === item.id);

		if (existingItem !== -1) {
			const updatedCart = [...cart];
			updatedCart[existingItem].quantity += 1;
			setCart(updatedCart);
		} else {
      const newItem: CartItem = { ...item, quantity: 1 };
      setCart([...cart, newItem]); 
		}
  };

  const increaseQuantity = (id: GuitarID) => {
    const updatedCart = [...cart];
    const itemIndex = updatedCart.findIndex((item) => item.id === id);
    updatedCart[itemIndex].quantity += 1;
    setCart(updatedCart);
  };

  const decreaseQuantity = (id: GuitarID) => {
    const updatedCart = [...cart];
    const itemIndex = updatedCart.findIndex((item) => item.id === id);
    if (updatedCart[itemIndex].quantity === 1) {
      removeFromCart(id);
    } else {
      updatedCart[itemIndex].quantity -= 1;
      setCart(updatedCart);
    }
  };

  const removeFromCart = (id: GuitarID) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
  };

  const clearCart = () => {
    setCart([]);
  };

  const isCartEmpty = useMemo(() => cart.length === 0, [cart]);
  const total = useMemo(() => {
    return cart.reduce(
      (total, guitar) => total + guitar.price * guitar.quantity,
      0
    );
  }, [cart]);

  return {
    cart,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    isCartEmpty,
    total,
  }
}