import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { getGameById, getGames } from "../api/gameApi";
import { createOrder } from "../api/orderApi";
import { getCartItems, deleteCartItem } from "../api/cartApi";
import { setCart } from "../features/cartSlice"

function Checkout() {
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const [searchParams] = useSearchParams();

  /*
    If gameId exists:
    Buy Now from GameDetails

    If gameId doesn't exist:
    Checkout from Cart
  */

  const gameId = searchParams.get("gameId");

  // ========================================
  // USER
  // ========================================

  const user = useSelector((state) => state.auth.user);

  // ========================================
  // CART
  // ========================================

  const cartItems = useSelector((state) => state.cart.items);

  // ========================================
  // PAYMENT METHOD
  // ========================================

  const [paymentMethod, setPaymentMethod] = useState("UPI");

  // ========================================
  // FETCH SINGLE GAME
  // Used for Buy Now
  // ========================================

  const {
    data: game,
    isLoading: gameLoading,
    isError: gameError,
  } = useQuery({
    queryKey: ["checkout-game", gameId],
    queryFn: () => getGameById(gameId),
    enabled: !!gameId,
  });

  // ========================================
  // FETCH ALL GAMES
  // Used for Cart Checkout
  // ========================================

  const {
    data: games = [],
    isLoading: gamesLoading,
    isError: gamesError,
  } = useQuery({
    queryKey: ["games"],
    queryFn: getGames,
    enabled: !gameId,
  });

  // ========================================
  // CREATE ORDER
  // ========================================

  const orderMutation = useMutation({
    mutationFn: createOrder,

    onSuccess: async (order) => {
  try {
    if (user) {
      // Get the user's current cart from JSON Server
      const currentCartItems = await getCartItems(user.id);

      // Get IDs of games that were just purchased
      const purchasedGameIds = new Set(
        order.items.map((item) => String(item.gameId))
      );

      // Find only the purchased games inside the cart
      const purchasedCartItems = currentCartItems.filter((cartItem) =>
        purchasedGameIds.has(String(cartItem.gameId))
      );

      // Delete purchased games from JSON Server cart
      await Promise.all(
        purchasedCartItems.map((cartItem) =>
          deleteCartItem(cartItem.id)
        )
      );

      // Keep any games that were NOT purchased
      const remainingCartItems = currentCartItems.filter(
        (cartItem) =>
          !purchasedGameIds.has(String(cartItem.gameId))
      );

      // Update Redux immediately
      dispatch(setCart(remainingCartItems));
    }

    // Refresh orders
    await queryClient.invalidateQueries({
      queryKey: ["orders", user.id],
    });

    // Refresh cart
    await queryClient.invalidateQueries({
      queryKey: ["cart", user.id],
    });

    toast.success("Order created successfully!");

    navigate(`/order-success?orderId=${order.id}`);

  } catch (error) {
    console.error("Post-order cleanup failed:", error);

    toast.error(
      "Order created, but cart cleanup failed."
    );
  }
},

    onError: (error) => {
      console.error("Order creation failed:", error);

      toast.error("Failed to create order. Please try again.");
    },
  });

  // ========================================
  // LOGIN CHECK
  // ========================================

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 p-8 text-white">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl font-bold">Login Required</h1>

          <p className="mt-4 text-zinc-400">Please login to purchase games.</p>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-6 rounded-lg bg-amber-500 px-6 py-3 font-semibold text-black"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // ========================================
  // BUILD CHECKOUT ITEMS
  // ========================================

  let checkoutItems = [];

  /*
    BUY NOW FROM GAME DETAILS

    /checkout?gameId=2
  */

  if (gameId && game) {
    checkoutItems = [
      {
        gameId: game.id,
        title: game.title,
        price: Number(game.price),
        image: game.image?.[0] ?? "",
      },
    ];
  } else if (!gameId) {

  /*
    CHECKOUT FROM CART

    /checkout
  */
    checkoutItems = cartItems
      .map((cartItem) => {
        const cartGame = games.find(
          (game) => String(game.id) === String(cartItem.gameId),
        );

        if (!cartGame) {
          return null;
        }

        return {
          gameId: cartGame.id,
          title: cartGame.title,
          price: Number(cartGame.price),
          image: cartGame.image?.[0] ?? "",
        };
      })
      .filter(Boolean);
  }

  // ========================================
  // TOTAL
  // ========================================

  const totalAmount = checkoutItems.reduce(
    (total, item) => total + Number(item.price),
    0,
  );

  // ========================================
  // PLACE ORDER
  // ========================================

  const handlePlaceOrder = () => {
    if (!user) {
      toast.error("Please login to purchase games.");

      return;
    }

    if (checkoutItems.length === 0) {
      toast.error("No games available for checkout.");

      return;
    }

    const order = {
      userId: user.id,

      items: checkoutItems,

      totalAmount,

      paymentMethod,

      /*
        Demo payment.

        Later, when we integrate a real
        payment gateway, this should only
        become "paid" after payment succeeds.
      */

      paymentStatus: "paid",

      orderStatus: "completed",

      createdAt: new Date().toISOString(),
    };

    orderMutation.mutate(order);
  };

  // ========================================
  // NO GAME ID + EMPTY CART
  // ========================================

  if (!gameId && !gamesLoading && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 p-8 text-white">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl font-bold">Your Cart Is Empty</h1>

          <p className="mt-4 text-zinc-400">
            Add a game to your cart before checking out.
          </p>

          <button
            type="button"
            onClick={() => navigate("/games")}
            className="mt-6 rounded-lg bg-amber-500 px-6 py-3 font-semibold text-black"
          >
            Browse Games
          </button>
        </div>
      </div>
    );
  }

  // ========================================
  // LOADING
  // ========================================

  if ((gameId && gameLoading) || (!gameId && gamesLoading)) {
    return (
      <div className="min-h-screen bg-zinc-950 p-8 text-white">
        <h1 className="text-3xl font-bold">Loading Checkout...</h1>
      </div>
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if ((gameId && gameError) || (!gameId && gamesError)) {
    return (
      <div className="min-h-screen bg-zinc-950 p-8 text-white">
        <h1 className="text-3xl font-bold">Failed to load checkout</h1>

        <button
          type="button"
          onClick={() => navigate("/games")}
          className="mt-6 rounded-lg bg-amber-500 px-6 py-3 font-semibold text-black"
        >
          Back to Games
        </button>
      </div>
    );
  }

  // ========================================
  // GAME NOT FOUND
  // ========================================

  if (gameId && !game) {
    return (
      <div className="min-h-screen bg-zinc-950 p-8 text-white">
        <h1 className="text-3xl font-bold">Game not found</h1>

        <button
          type="button"
          onClick={() => navigate("/games")}
          className="mt-6 rounded-lg bg-amber-500 px-6 py-3 font-semibold text-black"
        >
          Browse Games
        </button>
      </div>
    );
  }

  // ========================================
  // CHECKOUT UI
  // ========================================

  return (
    <div className="min-h-screen bg-zinc-950 p-8 text-white">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Checkout</h1>

          <p className="mt-2 text-zinc-400">Complete your purchase</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* ==================================
              ORDER SUMMARY
          =================================== */}

          <div className="rounded-2xl bg-zinc-900 p-6">
            <h2 className="mb-6 text-xl font-semibold">Order Summary</h2>

            <div className="space-y-5">
              {checkoutItems.map((item) => (
                <div
                  key={item.gameId}
                  className="flex gap-5 border-b border-zinc-800 pb-5"
                >
                  {/* IMAGE */}

                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-32 w-24 rounded-xl object-cover"
                  />

                  {/* DETAILS */}

                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{item.title}</h3>

                    <p className="mt-2 text-sm text-zinc-400">Digital Copy</p>

                    <p className="mt-4 text-xl font-bold text-amber-500">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* TOTAL */}

            <div className="mt-6 flex justify-between border-t border-zinc-800 pt-6">
              <span className="text-lg text-zinc-400">Total</span>

              <span className="text-2xl font-bold">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* ==================================
              PAYMENT
          =================================== */}

          <div className="rounded-2xl bg-zinc-900 p-6">
            <h2 className="mb-6 text-xl font-semibold">Payment Method</h2>

            <div className="space-y-4">
              {/* UPI */}

              <label
                className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition ${
                  paymentMethod === "UPI"
                    ? "border-amber-500 bg-zinc-800"
                    : "border-zinc-700"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="UPI"
                  checked={paymentMethod === "UPI"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />

                <div>
                  <p className="font-semibold">UPI</p>

                  <p className="text-sm text-zinc-400">
                    Google Pay, PhonePe, Paytm
                  </p>
                </div>
              </label>

              {/* CARD */}

              <label
                className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition ${
                  paymentMethod === "CARD"
                    ? "border-amber-500 bg-zinc-800"
                    : "border-zinc-700"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="CARD"
                  checked={paymentMethod === "CARD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />

                <div>
                  <p className="font-semibold">Credit / Debit Card</p>

                  <p className="text-sm text-zinc-400">
                    Visa, Mastercard, RuPay
                  </p>
                </div>
              </label>
            </div>

            {/* ORDER TOTAL */}

            <div className="mt-8 border-t border-zinc-700 pt-6">
              <div className="flex items-center justify-between">
                <span className="text-lg text-zinc-400">Total</span>

                <span className="text-2xl font-bold">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>

              {/* PLACE ORDER */}

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={orderMutation.isPending || checkoutItems.length === 0}
                className="mt-6 w-full rounded-lg bg-amber-500 px-6 py-3 font-semibold text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {orderMutation.isPending ? "Creating Order..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
