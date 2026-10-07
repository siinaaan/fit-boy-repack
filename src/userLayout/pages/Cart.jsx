import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getGames } from "../api/gameApi";

import {
  removeFromCart,
  clearCart,
} from "../features/cartSlice";

import {
  getCartItems,
  deleteCartItem,
} from "../api/cartApi";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Logged-in user
  const user = useSelector(
    (state) => state.auth.user
  );

  // Redux cart
  const cartItems = useSelector(
    (state) => state.cart.items
  );

  // Fetch all games
  const {
    data: games = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["games"],
    queryFn: getGames,
  });

  // ========================================
  // REMOVE ONE GAME
  // ========================================

  const handleRemoveItem = async (cartItem) => {
    try {
      await deleteCartItem(cartItem.id);

      dispatch(
        removeFromCart(cartItem.id)
      );

      toast.success("Game removed from cart.");
    } catch (error) {
      console.error(
        "Failed to remove game:",
        error
      );

      toast.error(
        "Failed to remove game from cart."
      );
    }
  };

  // ========================================
  // CLEAR CART
  // ========================================

  const handleClearCart = async () => {
    if (!user) {
      toast.error("Please login first.");
      return;
    }

    if (cartItems.length === 0) {
      return;
    }

    try {
      const items = await getCartItems(user.id);

      await Promise.all(
        items.map((item) =>
          deleteCartItem(item.id)
        )
      );

      dispatch(clearCart());

      toast.success("Cart cleared.");
    } catch (error) {
      console.error(
        "Failed to clear cart:",
        error
      );

      toast.error(
        "Failed to clear cart."
      );
    }
  };

  // ========================================
  // PROCEED TO CHECKOUT
  // ========================================

  const handleCheckout = () => {
    if (!user) {
      toast.error(
        "Please login to continue."
      );

      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      toast.error(
        "Your cart is empty."
      );

      return;
    }

    // No gameId means:
    // Checkout all games in cart
    navigate("/checkout");
  };

  // ========================================
  // LOADING
  // ========================================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 p-6 text-white">
        <p>Loading Cart...</p>
      </div>
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (isError) {
    return (
      <div className="min-h-screen bg-zinc-950 p-6 text-white">
        <p className="text-red-500">
          Failed to load games.
        </p>
      </div>
    );
  }

  // ========================================
  // EMPTY CART
  // ========================================

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 p-6 text-white">

        <div className="mx-auto max-w-6xl">

          <h1 className="text-3xl font-bold">
            Your Cart
          </h1>

          <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900 p-10 text-center">

            <h2 className="text-2xl font-semibold">
              Your cart is empty
            </h2>

            <p className="mt-3 text-zinc-400">
              Add some games to your cart.
            </p>

            <button
              type="button"
              onClick={() => navigate("/games")}
              className="mt-6 rounded-lg bg-amber-500 px-6 py-3 font-semibold text-black transition hover:bg-amber-400"
            >
              Browse Games
            </button>

          </div>

        </div>

      </div>
    );
  }

  // ========================================
  // TOTAL PRICE
  // ========================================

  const total = cartItems.reduce(
    (sum, cartItem) => {
      const game = games.find(
        (game) =>
          String(game.id) ===
          String(cartItem.gameId)
      );

      if (!game) {
        return sum;
      }

      // Digital games always have quantity 1
      return sum + Number(game.price);
    },
    0
  );

  // ========================================
  // CART UI
  // ========================================

  return (
    <div className="min-h-screen bg-zinc-950 p-6 text-white">

      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="mb-8 flex items-center justify-between">

          <h1 className="text-3xl font-bold">
            Your Cart
          </h1>

          <button
            type="button"
            onClick={handleClearCart}
            className="rounded-lg bg-red-700 px-4 py-2 font-semibold transition hover:bg-red-600"
          >
            Clear Cart
          </button>

        </div>


        {/* CART ITEMS */}

        <div className="space-y-4">

          {cartItems.map((cartItem) => {

            const game = games.find(
              (game) =>
                String(game.id) ===
                String(cartItem.gameId)
            );

            if (!game) {
              return null;
            }

            return (
              <div
                key={cartItem.id}
                className="flex items-center gap-5 rounded-xl border border-zinc-800 bg-zinc-900 p-4"
              >

                {/* IMAGE */}

                <img
                  src={game.image?.[0]}
                  alt={game.title}
                  className="h-32 w-24 rounded-lg object-cover"
                />


                {/* GAME DETAILS */}

                <div className="flex-1">

                  <h2 className="text-xl font-bold">
                    {game.title}
                  </h2>

                  <p className="mt-1 text-gray-400">
                    {game.category}
                  </p>

                  <p className="mt-2">
                    ${Number(game.price).toFixed(2)}
                  </p>

                  <p className="mt-1 text-sm text-zinc-500">
                    Digital Copy
                  </p>

                </div>


                {/* PRICE + REMOVE */}

                <div className="text-right">

                  <p className="mb-4 text-lg font-bold">
                    $
                    {Number(game.price).toFixed(2)}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveItem(cartItem)
                    }
                    className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold transition hover:bg-red-600"
                  >
                    Remove
                  </button>

                </div>

              </div>
            );
          })}

        </div>


        {/* ORDER SUMMARY */}

        <div className="mt-8 flex justify-end">

          <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6">

            <h2 className="text-2xl font-bold">
              Order Summary
            </h2>


            {/* ITEMS */}

            <div className="mt-4 flex justify-between text-gray-400">

              <span>
                Items
              </span>

              <span>
                {cartItems.length}
              </span>

            </div>


            {/* TOTAL */}

            <div className="mt-3 flex justify-between text-xl font-bold">

              <span>
                Total
              </span>

              <span>
                ${total.toFixed(2)}
              </span>

            </div>


            {/* CHECKOUT */}

            <button
              type="button"
              onClick={handleCheckout}
              className="mt-6 w-full rounded-lg bg-emerald-700  px-4 py-3 font-bold transition hover:bg-emerald-500"
            >
              Proceed to Checkout
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Cart;