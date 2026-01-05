// // src/contexts/CartContext.js
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { API_ENDPOINTS } from "../config/api";

// Create the Cart context
const CartContext = createContext();

// Reducer function to manage cart state updates based on dispatched actions
const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_CART":
      return { ...state, items: action.payload, loading: false };
    case "ADD_ITEM":
      return { ...state, items: [...state.items, action.payload] };
    case "UPDATE_ITEM":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    loading: false,
    error: null,
  });

  const getHeaders = useCallback(() => {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const token = localStorage.getItem("authToken");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }, []);

  // Fetch initial cart data
  // Update fetchCart function
  const fetchCart = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      // No need to get userId here as it's handled by the backend session
      const response = await fetch(`${API_ENDPOINTS.cart}`, {
        credentials: "include", // Important for cookies/session
        headers: getHeaders(),
      });

      if (!response.ok) {
        // Only handle 401 specifically for authenticated users
        if (response.status === 401 && localStorage.getItem("authToken")) {
          localStorage.removeItem("authToken");
          // Optionally redirect to login or handle differently
          // window.location.href = "/login";
        }
        throw new Error("Failed to fetch cart");
      }

      const data = await response.json();
      dispatch({ type: "SET_CART", payload: data });
    } catch (error) {
      console.error("Cart fetch error:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
      // For anonymous users, we might want to initialize an empty cart
      if (!localStorage.getItem("authToken")) {
        dispatch({ type: "SET_CART", payload: [] });
      }
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [getHeaders]);

  // Merge cart items after login
  const mergeCart = useCallback(async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.cart}/merge`, {
        method: "POST",
        credentials: "include",
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error("Failed to merge cart");

      // Re-fetch cart to get updated data post-merge
      await fetchCart();
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  }, [getHeaders, fetchCart]);

  // Listen for auth state changes to trigger merge or fetch
  // Update useEffect for auth changes
  // Update useEffect for auth changes
  useEffect(() => {
    const handleAuthChange = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          // First fetch the current cart
          await fetchCart();

          // Then attempt to merge if there was an anonymous cart
          const mergeResponse = await fetch(`${API_ENDPOINTS.cart}/merge`, {
            method: "POST",
            credentials: "include",
            headers: getHeaders(),
          });

          if (!mergeResponse.ok) {
            console.error("Failed to merge cart");
          }

          // Fetch the cart again after merging
          await fetchCart();
        } catch (error) {
          console.error("Error during cart merge:", error);
        }
      } else {
        // Just fetch the anonymous cart
        await fetchCart();
      }
    };

    handleAuthChange();

    // Listen for storage events
    window.addEventListener("storage", (e) => {
      if (e.key === "authToken") {
        handleAuthChange();
      }
    });

    return () => {
      window.removeEventListener("storage", handleAuthChange);
    };
  }, [fetchCart]);

  // Define action methods for cart management
  const addToCart = useCallback(
    async (productId, quantity, color) => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const userId = parseInt(localStorage.getItem("userId")); // Parse userId as an integer
        const response = await fetch(API_ENDPOINTS.cart, {
          method: "POST",
          credentials: "include",
          headers: getHeaders(),
          body: JSON.stringify({ productId, quantity, color, userId }),
        });
        if (!response.ok) throw new Error("Failed to add item to cart");
        const data = await response.json();
        dispatch({ type: "ADD_ITEM", payload: data });
        dispatch({ type: "SET_LOADING", payload: false });
        return true; // Return success boolean
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: error.message });
        dispatch({ type: "SET_LOADING", payload: false });
        return false; // Return failure boolean
      }
    },
    [getHeaders]
  );

  // const updateCartItem = useCallback(
  //   async (itemId, quantity) => {
  //     dispatch({ type: "SET_LOADING", payload: true });
  //     try {
  //       const response = await fetch(`${API_ENDPOINTS.cart}/${itemId}`, {
  //         method: "PUT",
  //         credentials: "include",
  //         headers: getHeaders(),
  //         body: quantity.toString(), //orJSON.stringify({ quantity }) // Send quantity as request body
  //       });
  //       if (!response.ok) throw new Error("Failed to update cart item");
  //       dispatch({ type: "UPDATE_ITEM", payload: { id: itemId, quantity } });
  //     } catch (error) {
  //       dispatch({ type: "SET_ERROR", payload: error.message });
  //     } finally {
  //       dispatch({ type: "SET_LOADING", payload: false });
  //     }
  //   },
  //   [getHeaders]
  // );

  // const removeFromCart = useCallback(
  //   async (itemId) => {
  //     dispatch({ type: "SET_LOADING", payload: true });
  //     try {
  //       const response = await fetch(`${API_ENDPOINTS.cart}/${itemId}`, {
  //         method: "DELETE", //or "POST" with "DELETE" in body as JSON.stringify({ id: itemId }) // Send itemId as request body or query param (e.g. /cart?id=123) // or use "PATCH" with "DELETE" in body as JSON.stringify({ id: itemId }) // Send itemId as request body or query param (e.g. /cart?id=123)
  //         credentials: "include",
  //         headers: getHeaders(),
  //         //mode: "no-cors",
  //       });
  //       if (!response.ok) throw new Error("Failed to remove item from cart");
  //       dispatch({ type: "REMOVE_ITEM", payload: itemId });
  //     } catch (error) {
  //       dispatch({ type: "SET_ERROR", payload: error.message });
  //     } finally {
  //       dispatch({ type: "SET_LOADING", payload: false });
  //     }
  //   },
  //   [getHeaders]
  // );

  const updateCartItem = useCallback(
    async (itemId, quantity) => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const response = await fetch(API_ENDPOINTS.updateCartItem, {
          // Use the endpoint directly
          method: "POST",
          credentials: "include",
          headers: getHeaders(),
          body: JSON.stringify({
            itemId: itemId,
            quantity: quantity,
          }),
        });
        if (!response.ok) throw new Error("Failed to update cart item");
        dispatch({ type: "UPDATE_ITEM", payload: { id: itemId, quantity } });
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: error.message });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [getHeaders]
  );

  // Remove item from cart
  const removeFromCart = useCallback(
    async (itemId) => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const response = await fetch(API_ENDPOINTS.removeFromCart, {
          // Use the endpoint directly
          method: "POST",
          credentials: "include",
          headers: getHeaders(),
          body: JSON.stringify(itemId), // Send itemId as a number
        });
        if (!response.ok) throw new Error("Failed to remove item from cart");
        dispatch({ type: "REMOVE_ITEM", payload: itemId });
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: error.message });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [getHeaders]
  );

  const clearCart = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await fetch(`${API_ENDPOINTS.cart}/clear`, {
        method: "POST",
        credentials: "include",
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error("Failed to clear cart");
      dispatch({ type: "CLEAR_CART" });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [getHeaders]);

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        fetchCart,
        mergeCart,
      }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
