import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { createOrder } from "../api/orderApi";
import { getGameById } from "../api/gameApi";

import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

function Checkout() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const gameId = searchParams.get("gameId");

  const user = useSelector((state) => state.auth.user);

  const cartItems = useSelector((state) => state.cart.items);

  const [paymentMethod, setPaymentMethod] = useState("UPI");

  const orderMutation = useMutation({
    mutationFn: createOrder,

    onSuccess: (order) => {
        toast.success("Order created successfully!");

        navigate(`/order-success?orderId=${order.id}`);
    },

    onError: (error) => {
        console.error("Order creation failed: ",error);
        toast.error("Failed to create order. Please try again.")
    }
  })

  const {
    data: game,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["checkout-game", gameId],
    queryFn: () => getGameById(gameId),
    enabled: !!gameId,
  });


  const handlePlaceOrder = () => {
    if(!game || !user) {
        toast.error("Game or user information is missing.");
        return;
    }

    const order = {
        userId: user.id,

        items: [
            {
                gameId: game.id,
                title: game.title,
                price: Number(game.price),
                image: game.image?.[0]??"",
            },
        ],

        totalAmount: Number(game.price),
        paymentMethod,
        paymentStatus: "unpaid",
        orderStatus: "pending",
        createdAt: new Date().toISOString(),
    };

    orderMutation.mutate(order);
  };


  if (!user) {
    toast.error("Please login to purchase games.");
    navigate("/login");
    return null;
  }

  if (!gameId) {
    return (
      <div className="min-h-screen bg-zinc-950 p-8 text-white">
        <h1 className="text-3xl font-bold">No game selected</h1>

        <button
          onClick={() => navigate("/games")}
          className="mt-6 rounded-lg bg-amber-500 px-6 py-3 font-semibold text-black"
        >
          Browse Games
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 p-8 text-white">
        <h1 className="text-3xl font-bold">Loading Checkout...</h1>
      </div>
    );
  }

  if (isError || !game) {
    return (
      <div className="min-h-screen bg-zinc-950 p-8 text-white">
        <h1 className="text-3xl font-bold">Failed to load game</h1>

        <button
          onClick={() => navigate("/games")}
          className="mt-6 rounded-lg bg-amber-500 px-6 py-3 font-semibold text-black"
        >
          Back to Games
        </button>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-zinc-950 p-8 text-white">
      <div className="mx-auto max-w-6xl">
        {/* Header */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Checkout</h1>

          <p className="mt-2 text-zinc-400">Complete your purchase</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* =========================
              ORDER SUMMARY
          ========================== */}

          <div className="rounded-2xl bg-zinc-900 p-6">
            <h2 className="mb-6 text-xl font-semibold">Order Summary</h2>

            <div className="flex gap-5">
              {/* Game Image */}

              <img
                src={game.image[0]}
                alt={game.title}
                className="h-40 w-28 rounded-xl object-cover"
              />

              {/* Game Information */}

              <div className="flex-1">
                <h3 className="text-2xl font-bold">{game.title}</h3>

                <p className="mt-2 text-zinc-400">{game.category}</p>

                <p className="mt-4 text-sm text-zinc-400">Digital Copy</p>

                <p className="mt-4 text-2xl font-bold text-amber-500">
                  ${game.price}
                </p>
              </div>
            </div>
          </div>

          {/* =========================
              PAYMENT
          ========================== */}

          <div className="rounded-2xl bg-zinc-900 p-6">
            <h2 className="mb-6 text-xl font-semibold">Payment Method</h2>

            <div className="space-y-4">
              {/* UPI */}

              <label className="flex cursor-pointer items-center gap-4 rounded-lg border border-zinc-700 p-4 hover:border-amber-500">
                <input 
                type="radio" 
                name="payment" 
                value="UPI" 
                onChange={(e)=> setPaymentMethod(e.target.value)}/>

                <div>
                  <p className="font-semibold">UPI</p>

                  <p className="text-sm text-zinc-400">
                    Google Pay, PhonePe, Paytm
                  </p>
                </div>
              </label>

              {/* Card */}

              <label className="flex cursor-pointer items-center gap-4 rounded-lg border border-zinc-700 p-4 hover:border-amber-500">
                <input 
                type="radio" 
                name="payment" 
                value="CARD" 
                onChange={(e)=>setPaymentMethod(e.target.value)}/>

                <div>
                  <p className="font-semibold">Credit / Debit Card</p>

                  <p className="text-sm text-zinc-400">
                    Visa, Mastercard, RuPay
                  </p>
                </div>
              </label>
            </div>

            {/* Total */}

            <div className="mt-8 border-t border-zinc-700 pt-6">
              <div className="flex items-center justify-between">
                <span className="text-lg text-zinc-400">Total</span>

                <span className="text-2xl font-bold">${game.price}</span>
              </div>

              {/* Place Order */}

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={orderMutation.isPending}
                className="mt-6 w-full rounded-lg bg-amber-500 px-6 py-3 font-semibold text-black transition hover:bg-amber-400"
              >
                {orderMutation.isPending ? "Creating order..." : "Place order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
