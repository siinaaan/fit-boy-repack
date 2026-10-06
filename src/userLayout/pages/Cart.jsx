import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";

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

  const [buying, setBuying] = useState(false);


  // Get logged-in user

  const user = useSelector(
    (state) => state.auth.user
  );


  // Get cart from Redux

  const cartItems = useSelector(
    (state) => state.cart.items
  );


  // Get games from JSON Server

  const {
    data: games = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["games"],
    queryFn: getGames,
  });


  // --------------------------------
  // REMOVE ONE GAME
  // --------------------------------

  const handleRemoveItem = async (cartItem) => {

    try {

      // Delete from JSON Server
      await deleteCartItem(cartItem.id);

      // Delete from Redux
      dispatch(
        removeFromCart(cartItem.id)
      );

    } catch (error) {

      console.error(
        "Failed to remove game:",
        error
      );

    }

  };


  // --------------------------------
  // CLEAR CART
  // --------------------------------

  const handleClearCart = async () => {

    if (!user) {
      return;
    }

    try {

      // Get user's cart from database
      const items = await getCartItems(user.id);


      // Delete every cart item
      await Promise.all(
        items.map((item) =>
          deleteCartItem(item.id)
        )
      );


      // Clear Redux
      dispatch(clearCart());

    } catch (error) {

      console.error(
        "Failed to clear cart:",
        error
      );

    }

  };


  // --------------------------------
  // BUY
  // --------------------------------

  const handleBuy = async () => {

    if (!user || cartItems.length === 0) {
      return;
    }

    try {

      setBuying(true);


      // Get current cart from database
      const items = await getCartItems(user.id);


      // Demo purchase
      console.log(
        "Purchased items:",
        items
      );


      // For now, purchase is successful
      alert("Purchase successful!");


      // Remove purchased items
      await Promise.all(
        items.map((item) =>
          deleteCartItem(item.id)
        )
      );


      // Clear Redux
      dispatch(clearCart());

    } catch (error) {

      console.error(
        "Purchase failed:",
        error
      );

    } finally {

      setBuying(false);

    }

  };


  // --------------------------------
  // LOADING
  // --------------------------------

  if (isLoading) {
    return (
      <p className="p-6">
        Loading Cart...
      </p>
    );
  }


  // --------------------------------
  // ERROR
  // --------------------------------

  if (isError) {
    return (
      <p className="p-6 text-red-500">
        Failed to load games
      </p>
    );
  }


  // --------------------------------
  // EMPTY CART
  // --------------------------------

  if (cartItems.length === 0) {

    return (
      <div className="p-6">

        <h1 className="text-3xl font-bold">
          Your Cart
        </h1>

        <p className="mt-4">
          Your cart is empty
        </p>

      </div>
    );

  }


  // --------------------------------
  // TOTAL PRICE
  // --------------------------------

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

      return (
        sum +
        Number(game.price) *
        Number(cartItem.quantity)
      );

    },
    0
  );


  // --------------------------------
  // CART UI
  // --------------------------------

  return (

    <div className="min-h-screen bg-zinc-950 p-6 text-white">

      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="mb-8 flex items-center justify-between">

          <h1 className="text-3xl font-bold">
            Your Cart
          </h1>


          {/* CLEAR CART */}

          <button
            type="button"
            onClick={handleClearCart}
            className="rounded-lg bg-red-700 px-4 py-2 font-semibold hover:bg-red-600"
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

                {/* GAME IMAGE */}

                <img
                  src={game.image[0]}
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
                    ${game.price}
                  </p>

                  <p className="mt-1 text-gray-400">
                    Quantity: {cartItem.quantity}
                  </p>

                </div>


                {/* ITEM TOTAL + REMOVE */}

                <div className="text-right">

                  <p className="mb-4 text-lg font-bold">

                    $
                    {(
                      Number(game.price) *
                      Number(cartItem.quantity)
                    ).toFixed(2)}

                  </p>


                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveItem(cartItem)
                    }
                    className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold hover:bg-red-600"
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


            {/* NUMBER OF ITEMS */}

            <div className="mt-4 flex justify-between text-gray-400">

              <span>
                Items
              </span>

              <span>
                {cartItems.reduce(
                  (total, item) =>
                    total +
                    Number(item.quantity),
                  0
                )}
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


            {/* BUY BUTTON */}

            <button
              type="button"
              onClick={handleBuy}
              disabled={buying}
              className="mt-6 w-full rounded-lg bg-[#8b0d1a] px-4 py-3 font-bold hover:bg-[#fb3640] disabled:cursor-not-allowed disabled:opacity-50"
            >

              {buying
                ? "Processing..."
                : "Buy Now"}

            </button>

          </div>

        </div>

      </div>

    </div>

  );
}


export default Cart;