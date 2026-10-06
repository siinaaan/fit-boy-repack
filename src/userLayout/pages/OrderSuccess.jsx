import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";

function OrderSuccess() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-16 text-white">

      <div className="mx-auto max-w-xl text-center">

        <div className="flex justify-center">
          <CheckCircle
            size={80}
            className="text-green-500"
          />
        </div>

        <h1 className="mt-6 text-4xl font-bold">
          Order Successful!
        </h1>

        <p className="mt-4 text-zinc-400">
          Your game has been successfully ordered.
        </p>

        {orderId && (
          <div className="mt-6 rounded-lg bg-zinc-900 p-4">
            <p className="text-sm text-zinc-400">
              Order ID
            </p>

            <p className="mt-1 font-semibold">
              {orderId}
            </p>
          </div>
        )}

        <p className="mt-6 text-sm text-zinc-500">
          This is a demo purchase. Payment processing will be
          connected later.
        </p>

        <div className="mt-8 flex justify-center gap-4">

          <button
            onClick={() => navigate("/games")}
            className="rounded-lg bg-amber-500 px-6 py-3 font-semibold text-black transition hover:bg-amber-400"
          >
            Continue Shopping
          </button>

          <button
            onClick={() => navigate("/")}
            className="rounded-lg border border-zinc-700 px-6 py-3 font-semibold transition hover:bg-zinc-800"
          >
            Home
          </button>

        </div>

      </div>

    </div>
  );
}

export default OrderSuccess;