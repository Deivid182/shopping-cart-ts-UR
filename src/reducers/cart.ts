import { db } from "../data/db";
import type { CartItem, Guitar } from "../types";

const initialCart = () => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : [];
}
export type CartState = {
  data: Guitar[];
  cart: CartItem[];
};

export const initialState: CartState = {
  data: db,
  cart: initialCart(),
};

const reducerActionTypes = {
  "add-to-cart": "add-to-cart",
  "increase-quantity": "increase-quantity",
  "decrease-quantity": "decrease-quantity",
  "remove-from-cart": "remove-from-cart",
  "clear-cart": "clear-cart",
}

export type reducerActionType = typeof reducerActionTypes

export type ReducerCartAction = {
  type: keyof reducerActionType
  payload: {
    item?: Guitar,
    id?: Guitar["id"]
  }
}

type ReducerFunction = (state: CartState, action: ReducerCartAction) => CartState

type ReducerObject = {
  [K in keyof reducerActionType]: ReducerFunction;
};

export const reducers: ReducerObject = {
  "add-to-cart": (state, action) => {
    let updatedCart: CartItem[] = [];
    const existingItem = state.cart.find(cartItem => cartItem.id === action.payload.item?.id);
    if (existingItem) {
      updatedCart = state.cart.map(cartItem => {
        if (cartItem.id === action.payload.item?.id) {
          return {
            ...cartItem,
            quantity: cartItem.quantity + 1
          }
        } else {
          return cartItem
        }
      })
    } else {
      const newItem: CartItem = { ...action.payload.item!, quantity: 1 };
      updatedCart = [...state.cart, newItem];
    }

    return {
      ...state,
      cart: updatedCart
    }
  },
  "increase-quantity": (state, action) => {
    const updatedCart = state.cart.map(cartItem => {
      if (cartItem.id === action.payload.id) {
        return {
          ...cartItem,
          quantity: cartItem.quantity + 1
        }
      } else {
        return cartItem
      }
    })
    return {
      ...state,
      cart: updatedCart
    }
  },
  "decrease-quantity": (state, action) => {
    const updatedCart = state.cart.map(cartItem => {
      if(cartItem.id === action.payload.id && cartItem.quantity > 1) {
        return {
          ...cartItem,
          quantity: cartItem.quantity - 1
        }
      } else {
        return cartItem
      }
    })
    return {
      ...state,
      cart: updatedCart
    }
  },
  "remove-from-cart": (state, action) => {
    const updatedCart = state.cart.filter(cartItem => cartItem.id !== action.payload.id)
    return {
      ...state,
      cart: updatedCart
    }
  },
  "clear-cart": (state) => {
    return {
      ...state,
      cart: []
    }
  },
}

export const cartReducer = (state: CartState, action: ReducerCartAction) => {
  const reducer = reducers[action.type];
  return reducer ? reducer(state, action) : state
}