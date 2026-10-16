import { useState } from "react";
import { useSelector } from "react-redux";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Package,
  LoaderCircle,
  AlertTriangle,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  getOrderByUser,
  updateOrder,
} from "../api/orderApi";

const orderSteps = [
  "placed",
  "processing",
  "shipped",
  "out-for-delivery",
  "delivered",
];

function OrderTimeline({ status }) {
  const normalizedStatus = String(
    status || "placed"
  ).toLowerCase();

  if (normalizedStatus === "cancelled") {
    return (
      <div className="mt-6 rounded-lg border border-red-800 bg-red-950/30 p-4">
        <div className="flex items-center gap-2">
          <X size={20} className="text-red-400" />

          <p className="font-semibold text-red-400">
            Order Cancelled
          </p>
        </div>

        <p className="mt-1 text-sm text-zinc-400">
          This order is no longer being processed.
        </p>
      </div>
    );
  }

  const currentStep = orderSteps.indexOf(
    normalizedStatus
  );

  const activeStep = currentStep === -1
    ? 0
    : currentStep;

  return (
    <div className="mt-6">
      <h3 className="mb-5 font-semibold text-white">
        Delivery Progress
      </h3>

      <div className="flex items-start">
        {orderSteps.map((step, index) => {
          const completed = index <= activeStep;

          return (
            <div
              key={step}
              className="flex min-w-0 flex-1 flex-col items-center"
            >
              <div className="flex w-full items-center">
                {index > 0 && (
                  <div
                    className={`h-1 flex-1 ${
                      index <= activeStep
                        ? "bg-emerald-500"
                        : "bg-zinc-700"
                    }`}
                  />
                )}

                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    completed
                      ? "bg-emerald-500 text-black"
                      : "bg-zinc-700 text-zinc-300"
                  }`}
                >
                  {completed ? "✓" : index + 1}
                </div>

                {index < orderSteps.length - 1 && (
                  <div
                    className={`h-1 flex-1 ${
                      index < activeStep
                        ? "bg-emerald-500"
                        : "bg-zinc-700"
                    }`}
                  />
                )}
              </div>

              <span
                className={`mt-2 text-center text-[10px] sm:text-xs ${
                  completed
                    ? "text-emerald-400"
                    : "text-zinc-500"
                }`}
              >
                {step
                  .split("-")
                  .map(
                    (word) =>
                      word.charAt(0).toUpperCase() +
                      word.slice(1)
                  )
                  .join(" ")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Orders() {
  const user = useSelector(
    (state) => state.auth.user
  );

  const queryClient = useQueryClient();

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: () => getOrderByUser(user.id),
    enabled: !!user?.id,
  });

  const cancelOrderMutation = useMutation({
    mutationFn: (orderId) =>
      updateOrder(orderId, {
        orderStatus: "cancelled",
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders", user?.id],
      });

      setSelectedOrder(null);

      toast.success(
        "Order cancelled successfully."
      );
    },

    onError: (error) => {
      console.error(
        "Failed to cancel order:",
        error
      );

      toast.error(
        "Failed to cancel order. Please try again."
      );
    },
  });

  const handleCancelOrder = (order) => {
    const status = String(
      order.orderStatus || "placed"
    ).toLowerCase();

    if (!["placed", "processing"].includes(status)) {
      toast.error(
        "This order can no longer be cancelled."
      );
      return;
    }

    setSelectedOrder(order);
  };

  const confirmCancelOrder = () => {
    if (!selectedOrder || cancelOrderMutation.isPending) {
      return;
    }

    const status = String(
      selectedOrder.orderStatus || "placed"
    ).toLowerCase();

    if (!["placed", "processing"].includes(status)) {
      toast.error(
        "This order can no longer be cancelled."
      );

      setSelectedOrder(null);
      return;
    }

    cancelOrderMutation.mutate(selectedOrder.id);
  };


  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#050b12] text-emerald-400">
        <LoaderCircle
          className="mr-3 animate-spin"
          size={22}
        />
        Loading your orders...
      </div>
    );
  }


  if (isError) {
    return (
      <div className="min-h-[60vh] bg-[#050b12] p-8 text-center text-red-400">
        Failed to load orders. Please try again.
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#050b12] px-4 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">



        <div className="mb-8 flex items-center gap-3">
          <Package
            size={32}
            className="text-emerald-400"
          />

          <div>
            <h1 className="text-3xl font-bold">
              My Orders
            </h1>

            <p className="mt-1 text-sm text-zinc-400">
              Track your game purchases.
            </p>
          </div>
        </div>


        {orders.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-10 text-center">
            <Package
              size={48}
              className="mx-auto mb-4 text-zinc-500"
            />

            <h2 className="text-xl font-semibold">
              No orders yet
            </h2>

            <p className="mt-2 text-zinc-400">
              Your orders will appear here after checkout.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {[...orders]
              .sort((a,b)=> new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
              .map((order) => {
              const status = String(
                order.orderStatus || "placed"
              ).toLowerCase();

              const canCancel = [
                "placed",
                "processing",
              ].includes(status);

              return (
                <article
                  key={order.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6"
                >

                  <div className="flex flex-col justify-between gap-4 border-b border-zinc-800 pb-4 sm:flex-row sm:items-start">
                    <div>
                      <p className="text-sm text-zinc-400">
                        Order ID
                      </p>

                      <p className="break-all font-semibold">
                        {order.id}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-zinc-400">
                        Order status
                      </p>

                      <p
                        className={`font-semibold capitalize ${
                          status === "cancelled"
                            ? "text-red-400"
                            : "text-emerald-400"
                        }`}
                      >
                        {status.replaceAll("-", " ")}
                      </p>

                    </div>

                    <div>
                      <p className="text-sm text-zinc-400">
                        Order total
                      </p>

                      <p className="font-bold text-white">
                        ₹
                        {Number(
                          order.totalAmount || 0
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>


                  <div className="mt-4 space-y-4">
                    {(order.items || []).map(
                      (item, index) => (
                        <div
                          key={`${order.id}-${item.gameId || index}`}
                          className="flex items-center gap-4"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-20 w-16 rounded-lg object-cover"
                          />

                          <div>
                            <h3 className="font-semibold">
                              {item.title}
                            </h3>

                            <p className="text-sm text-zinc-400">
                              Quantity: {item.quantity || 1}
                            </p>

                            <p className="text-sm text-emerald-400">
                              ₹
                              {Number(
                                item.price || 0
                              ).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>


                  {order.shippingAddress && (
                    <div className="mt-5 border-t border-zinc-800 pt-4">
                      <h3 className="mb-2 font-semibold">
                        Shipping address
                      </h3>

                      <p className="text-sm leading-6 text-zinc-400">
                        {order.shippingAddress.fullName}
                        <br />
                        {order.shippingAddress.addressLine}
                        <br />
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state}{" "}
                        {order.shippingAddress.pinCode}
                      </p>

                      {order.shippingAddress.phone && (
                        <p className="mt-1 text-sm text-zinc-400">
                          Phone: {order.shippingAddress.phone}
                        </p>
                      )}
                    </div>
                  )}


                  <p className="mt-4 text-xs text-zinc-500">
                    Ordered on:{" "}
                    {order.createdAt
                      ? new Date(
                          order.createdAt
                        ).toLocaleDateString()
                      : "Date unavailable"}
                  </p>


                  <OrderTimeline
                    status={order.orderStatus}
                  />

                  

                      {canCancel && (
                        <button
                          type="button"
                          onClick={() =>
                            handleCancelOrder(order)
                          }
                          disabled={
                            cancelOrderMutation.isPending
                          }
                          className="mt-4 rounded-lg bg-red-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Cancel Order
                        </button>
                      )}
                </article>
              );
            })}
          </div>
        )}
      </div>


      {selectedOrder && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={() => {
            if (!cancelOrderMutation.isPending) {
              setSelectedOrder(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-order-title"
            aria-describedby="cancel-order-description"
            className="w-full max-w-md rounded-2xl border border-zinc-800 bg-[#0b1118] p-6 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="flex justify-end">
              <button
                type="button"
                aria-label="Close confirmation"
                disabled={cancelOrderMutation.isPending}
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>


            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
              <AlertTriangle
                size={30}
                className="text-red-400"
              />
            </div>


            <h2
              id="cancel-order-title"
              className="mt-5 text-center text-xl font-bold text-white"
            >
              Cancel this order?
            </h2>


            <p
              id="cancel-order-description"
              className="mt-3 text-center text-sm leading-6 text-zinc-400"
            >
              Are you sure you want to cancel order{" "}
              <span className="break-all font-semibold text-white">
                #{selectedOrder.id}
              </span>
              ?
            </p>

            <p className="mt-3 text-center text-xs text-zinc-500">
              This action cannot be undone from this page.
            </p>

            <div className="mt-7 flex gap-3">
              <button
                type="button"
                disabled={cancelOrderMutation.isPending}
                onClick={() => setSelectedOrder(null)}
                className="flex-1 rounded-lg border border-zinc-700 px-4 py-3 font-semibold text-zinc-300 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Keep Order
              </button>

              <button
                type="button"
                disabled={cancelOrderMutation.isPending}
                onClick={confirmCancelOrder}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {cancelOrderMutation.isPending ? (
                  <>
                    <LoaderCircle
                      size={18}
                      className="animate-spin"
                    />
                    Cancelling...
                  </>
                ) : (
                  "Yes, Cancel"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Orders;
