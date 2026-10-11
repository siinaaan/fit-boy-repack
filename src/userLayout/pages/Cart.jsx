import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  updateCartItem,
  getCartItems,
  deleteCartItem,
} from "../api/cartApi";

import { getGames } from "../api/gameApi";

import {
  updateCartQuantity,
  removeFromCart,
  clearCart,
} from "../features/cartSlice";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items);

  const {
    data: games = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["games"],
    queryFn: getGames,
  });

  // Update quantity in JSON Server and Redux
  const quantityMutation = useMutation({
    mutationFn: ({ id, quantity }) =>
      updateCartItem(id, quantity),

    onSuccess: (updatedItem) => {
      dispatch(
        updateCartQuantity({
          id: updatedItem.id,
          quantity: updatedItem.quantity,
        })
      );

      queryClient.invalidateQueries({
        queryKey: ["cart", user?.id],
      });
    },

    onError: (error) => {
      console.error("Failed to update quantity:", error);
      toast.error("Failed to update quantity.");
    },
  });

  // Increase or decrease quantity
  const handleQuantityChange = (cartItem, change) => {
    const currentQuantity = Number(cartItem.quantity) || 1;
    const newQuantity = currentQuantity + change;

    if (newQuantity < 1) return;
    if (quantityMutation.isPending) return;

    quantityMutation.mutate({
      id: cartItem.id,
      quantity: newQuantity,
    });
  };

  // Remove an item
  const handleRemoveItem = async (cartItem) => {
    try {
      await deleteCartItem(cartItem.id);

      dispatch(removeFromCart(cartItem.id));

      queryClient.invalidateQueries({
        queryKey: ["cart", user?.id],
      });

      toast.success("Game removed from cart.");
    } catch (error) {
      console.error("Failed to remove game:", error);
      toast.error("Failed to remove game from cart.");
    }
  };

  // Clear the entire cart
  const handleClearCart = async () => {
    if (!user) {
      toast.error("Please login first.");
      return;
    }

    if (cartItems.length === 0) return;

    try {
      const items = await getCartItems(user.id);

      await Promise.all(
        items.map((item) => deleteCartItem(item.id))
      );

      dispatch(clearCart());

      queryClient.invalidateQueries({
        queryKey: ["cart", user.id],
      });

      toast.success("Cart cleared.");
    } catch (error) {
      console.error("Failed to clear cart:", error);
      toast.error("Failed to clear cart.");
    }
  };

  // Proceed to checkout
  const handleCheckout = () => {
    if (!user) {
      toast.error("Please login to continue.");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    navigate("/checkout");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 p-6 text-white">
        <p>Loading Cart...</p>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-zinc-950 p-6 text-white">
        <p className="text-red-500">
          Failed to load games.
        </p>
      </div>
    );
  }

  // Empty cart
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

  // Calculate total price using quantity
  const total = cartItems.reduce((sum, cartItem) => {
    const game = games.find(
      (game) =>
        String(game.id) === String(cartItem.gameId)
    );

    if (!game) return sum;

    const quantity = Number(cartItem.quantity) || 1;

    return sum + Number(game.price) * quantity;
  }, 0);

  // Calculate total number of copies
  const totalItems = cartItems.reduce(
    (sum, item) => sum + (Number(item.quantity) || 1),
    0
  );

  return (
    <div className="min-h-screen bg-zinc-950 p-4 text-white sm:p-6">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between sm:mb-8">
          <h1 className="text-2xl font-bold sm:text-3xl">
            Your Cart
          </h1>

          <button
            type="button"
            onClick={handleClearCart}
            disabled={cartItems.length === 0}
            className="rounded-lg bg-red-700 px-3 py-2 text-sm font-semibold transition hover:bg-red-600 disabled:opacity-50 sm:px-4 sm:text-base"
          >
            Clear Cart
          </button>
        </div>

        {/* Cart Items */}
        <div className="space-y-4">
          {cartItems.map((cartItem) => {
            const game = games.find(
              (game) =>
                String(game.id) === String(cartItem.gameId)
            );

            if (!game) return null;

            const quantity = Number(cartItem.quantity) || 1;
            const itemTotal = Number(game.price) * quantity;

            return (
              <div
                key={cartItem.id}
                className="flex flex-col justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:flex-row sm:items-center sm:gap-5"
              >
                {/* Game Details */}
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <img
                    src={
                      Array.isArray(game.image)
                        ? game.image[0]
                        : game.image
                    }
                    alt={game.title}
                    className="h-24 w-20 flex-shrink-0 rounded-lg object-cover sm:h-32 sm:w-24"
                  />

                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-base font-bold sm:text-xl">
                      {game.title}
                    </h2>

                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                      {game.category}
                    </p>

                    <p className="mt-2 text-sm sm:text-base">
                      ₹{Number(game.price).toFixed(2)} each
                    </p>

                    <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
                      Digital Copy
                    </p>

                    {/* Quantity Controls */}
                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-sm text-zinc-400">
                        Quantity
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleQuantityChange(cartItem, -1)
                        }
                        disabled={
                          quantity <= 1 ||
                          quantityMutation.isPending
                        }
                        aria-label={`Decrease quantity of ${game.title}`}
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-700 text-lg transition hover:border-emerald-500 hover:text-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        −
                      </button>

                      <span className="min-w-5 text-center font-semibold">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleQuantityChange(cartItem, 1)
                        }
                        disabled={quantityMutation.isPending}
                        aria-label={`Increase quantity of ${game.title}`}
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-700 text-lg transition hover:border-emerald-500 hover:text-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Item Subtotal and Remove */}
                <div className="flex items-center justify-between border-t border-zinc-800 pt-3 sm:flex-col sm:items-end sm:justify-center sm:border-t-0 sm:pt-0">
                  <div className="sm:mb-4">
                    <p className="text-xs text-zinc-400 sm:text-right">
                      Subtotal
                    </p>

                    <p className="text-base font-bold text-emerald-400 sm:text-lg">
                      ₹{itemTotal.toFixed(2)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(cartItem)}
                    className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold transition hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="mt-8 flex justify-end">
          <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6">
            <h2 className="text-xl font-bold sm:text-2xl">
              Order Summary
            </h2>

            <div className="mt-4 flex justify-between text-gray-400">
              <span>Unique games</span>
              <span>{cartItems.length}</span>
            </div>

            <div className="mt-3 flex justify-between text-gray-400">
              <span>Total copies</span>
              <span>{totalItems}</span>
            </div>

            <div className="mt-4 flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-emerald-400">
                ₹{total.toFixed(2)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              className="mt-6 w-full rounded-lg bg-emerald-700 px-4 py-3 font-bold transition hover:bg-emerald-500"
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
