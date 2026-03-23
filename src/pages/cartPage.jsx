// sceed_frontend/src/pages/cartPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BannerOne from "../components/bannerOne";
import BannerTwo from "../components/bannerTwo";
import { useCart } from "../contexts/CartContext";
import { ChevronLeft } from "lucide-react";

const CartPage = () => {
  const navigate = useNavigate();
  const { items, loading, error, updateCartItem, removeFromCart } = useCart();
  const [selectedShipping, setSelectedShipping] = useState(""); //added

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }
  //incase of cart loading error
  // if (error) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center text-red-500">
  //       Error: {error}, please login first
  //     </div>
  //   );
  // }
  // if (error) {
  //   return (
  //     <div className="min-h-screen flex flex-col items-center justify-center text-red-500 text-center">
  //       <p className="mb-4">
  //         Error: {error}, Please log in to access your cart and complete your
  //         shopping experience.
  //       </p>
  //       <button
  //         onClick={() => navigate("/login")}
  //         className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
  //         Log In
  //       </button>
  //     </div>
  //   );
  // }
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-500 text-center">
        <p className="mb-4">
          It seems you're not logged in. Please log in to access your cart.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Log In
        </button>
        <p className="mt-6 text-gray-700">
          Not registered yet? Sign up to join us and enjoy shopping!
        </p>
        <button
          onClick={() => navigate("/sign-up")}
          className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Sign Up
        </button>
      </div>
    );
  }

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity > 0) {
      await updateCartItem(itemId, newQuantity);
    }
  };

  const handleRemoveItem = async (itemId) => {
    await removeFromCart(itemId);
  };

  const handleCheckout = () => {
    // Pass the necessary data to the PaymentPage
    navigate("/checkout", {
      state: {
        cartItems: items,
        subtotal: calculateSubtotal(),
        selectedShipping: selectedShipping,
      },
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className=" mx-auto px-1">
        {/*container*/}
        <div
          style={{ backgroundColor: "#FFFFFF" }}
          className="h-10 w-full border font-bold text-black flex justify-center items-center">
          <h1 className="flex items-center gap-2">
            Cart <ShoppingCart size={20} />
          </h1>
        </div>

        <main className="flex-grow h-full w-auto">
          <div className="container mx-auto px-1 py-4 h-[100%]">
            {items.length === 0 ? (
              <div className="text-center py-0 bg-white rounded-lg h-full w-auto">
                <h1 className="text-2xl font-medium mb-8 text-black text-center opacity-50">
                  Your cart is empty
                </h1>
                <p className="text-black mb-6 font-raleway text-xl">
                  You haven't added any products to your Cart yet.
                </p>
                <a
                  href="/shop"
                  className="inline-block bg-white border border-black text-black px-6 py-3 hover:bg-black hover:text-white rounded-md transition-colors duration-200">
                  Browse Products
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items Section */}
                <div className="lg:col-span-2 space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex space-x-4">
                        <div className="relative w-48">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-full h-48 object-cover rounded"
                          />
                        </div>

                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <h3 className="text-xl font-medium mr-0">
                              {item.productName}
                            </h3>

                            {/* //remove/delete item button  */}
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="flex items-center gap-2 text-gray-400 hover:text-red-500">
                              <Trash2 size={20} />
                              <span>Remove item</span>
                            </button>
                          </div>

                          <div className="mt-2">
                            <span className="text-lg font-medium">
                              ${item.price.toFixed(2)}
                            </span>
                          </div>

                          <div className="mt-4">
                            <p className="text-gray-600">Color: {item.color}</p>
                          </div>

                          <div className="mt-4 flex items-center gap-4">
                            <div className="flex items-center space-x-4 border-2 rounded-2xl px-2">
                              {/* quantity buttons plus and minus */}
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.id,
                                    item.quantity - 1
                                  )
                                }
                                className="w-8 h-8 flex items-center justify-center">
                                <Minus size={16} />
                              </button>
                              <span>{item.quantity} Pieces</span>
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.id,
                                    item.quantity + 1
                                  )
                                }
                                className="w-8 h-8 flex items-center justify-center">
                                <Plus size={16} />
                              </button>
                            </div>
                            <span className="text-lg font-medium">
                              Subtotal: $
                              {(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h2 className="text-xl font-medium mb-4">Cart Summary</h2>
                    <p className="text-gray-500 mb-4">
                      Shipping Fees not Included
                    </p>

                    <div className="border-t pt-4">
                      <div className="flex justify-between mb-4">
                        <span>Subtotal:</span>
                        <span className="text-pink-500">
                          ${calculateSubtotal().toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={handleCheckout}
                        className="w-full bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors">
                        {/* Checkout for ${calculateSubtotal().toFixed(2)} */}
                        Proceed to Checkout
                      </button>
                      {/*back button*/}
                      <button
                        className="mt-2 w-full text-gray-600 flex items-center justify-center space-x-2 hover:text-gray-800 border"
                        onClick={() => navigate(-1)}>
                        <span>
                          <ChevronLeft />
                        </span>
                        <span>Go Back & Continue Shopping</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
};

export default CartPage;
