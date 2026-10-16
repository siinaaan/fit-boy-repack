
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { MapPin, Package, ShoppingBag } from "lucide-react";

import { getGameById, getGames } from "../api/gameApi";
import { createOrder } from "../api/orderApi";
import { getCartItems, deleteCartItem } from "../api/cartApi";
import { setCart } from "../features/cartSlice";

// Demo shipping policy: free shipping.
// Change this value if you want to charge a shipping fee.
const SHIPPING_FEE = 0;

const initialAddress = {
  fullName: "",
  phone: "",
  addressLine: "",
  city: "",
  state: "",
  pinCode: "",
};

const inputClass =
  "w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-emerald-500";

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const gameId = searchParams.get("gameId");

  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items);

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [shippingAddress, setShippingAddress] = useState(initialAddress);

  const {
    data: game,
    isLoading: gameLoading,
    isError: gameError,
  } = useQuery({
    queryKey: ["checkout-game", gameId],
    queryFn: () => getGameById(gameId),
    enabled: !!gameId,
  });

  const {
    data: games = [],
    isLoading: gamesLoading,
    isError: gamesError,
  } = useQuery({
    queryKey: ["games"],
    queryFn: getGames,
    enabled: !gameId,
  });

  const orderMutation = useMutation({
    mutationFn: createOrder,

    onSuccess: async (order) => {
      try {
        if (user && !gameId) {
          const currentCartItems = await getCartItems(user.id);

          const purchasedGameIds = new Set(
            order.items.map((item) => String(item.gameId))
          );

          const purchasedCartItems = currentCartItems.filter((item) =>
            purchasedGameIds.has(String(item.gameId))
          );

          await Promise.all(
            purchasedCartItems.map((item) => deleteCartItem(item.id))
          );

          const remainingCartItems = currentCartItems.filter(
            (item) =>
              !purchasedGameIds.has(String(item.gameId))
          );

          dispatch(setCart(remainingCartItems));
        }

        await queryClient.invalidateQueries({
          queryKey: ["cart", user.id],
        });
      } catch (error) {
        console.error("Cart cleanup failed:", error);
        toast.error(
          "Order placed, but the cart could not be fully updated."
        );
      }

      await queryClient.invalidateQueries({
        queryKey: ["orders", user.id],
      });

      toast.success("Your order has been placed!");
      navigate(`/order-success?orderId=${order.id}`);
    },

    onError: (error) => {
      console.error("Order creation failed:", error);
      toast.error("Failed to place your order. Please try again.");
    },
  });

  const updateAddress = (event) => {
    const { name, value } = event.target;

    setShippingAddress((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050b12] p-6 text-white">
        <div className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center">
          <h1 className="text-3xl font-bold">Login Required</h1>
          <p className="mt-4 text-zinc-400">
            Please log in before placing an order.
          </p>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-6 rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-black transition hover:bg-emerald-400"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  let checkoutItems = [];

  if (gameId && game) {
    checkoutItems = [
      {
        gameId: game.id,
        title: game.title,
        price: Number(game.price),
        image: Array.isArray(game.image)
          ? game.image[0] || ""
          : game.image || "",
        quantity: 1,
      },
    ];
  } else if (!gameId) {
    checkoutItems = cartItems
      .map((cartItem) => {
        const cartGame = games.find(
          (item) => String(item.id) === String(cartItem.gameId)
        );

        if (!cartGame) return null;

        return {
          gameId: cartGame.id,
          title: cartGame.title,
          price: Number(cartGame.price),
          image: Array.isArray(cartGame.image)
            ? cartGame.image[0] || ""
            : cartGame.image || "",
          quantity: Math.max(1, Number(cartItem.quantity) || 1),
        };
      })
      .filter(Boolean);
  }

  const subtotal = checkoutItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const totalAmount = subtotal + SHIPPING_FEE;

  const handlePlaceOrder = (event) => {
    event.preventDefault();

    if (!user?.id) {
      toast.error("Please log in before placing your order.");
      navigate("/login");
      return;
    }

    if (checkoutItems.length === 0) {
      toast.error("No games available for checkout.");
      return;
    }

    const {
      fullName,
      phone,
      addressLine,
      city,
      state,
      pinCode,
    } = shippingAddress;

    if (
      !fullName.trim() ||
      !phone.trim() ||
      !addressLine.trim() ||
      !city.trim() ||
      !state.trim() ||
      !pinCode.trim()
    ) {
      toast.error("Please complete all shipping address fields.");
      return;
    }

    if (!/^[0-9+\-\s()]{7,20}$/.test(phone.trim())) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    if (!/^[a-zA-Z0-9\s-]{4,10}$/.test(pinCode.trim())) {
      toast.error("Please enter a valid PIN/postal code.");
      return;
    }

    const order = {
      userId: user.id,

      items: checkoutItems.map((item) => ({
        gameId: item.gameId,
        title: item.title,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
      })),

      shippingAddress: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        addressLine: addressLine.trim(),
        city: city.trim(),
        state: state.trim(),
        pinCode: pinCode.trim(),
      },

      subtotal,
      shippingFee: SHIPPING_FEE,
      totalAmount,

      paymentMethod,

      paymentStatus: "pending",
      orderStatus: "placed",

      createdAt: new Date().toISOString(),
    };

    orderMutation.mutate(order);
  };

  if (
    (gameId && gameLoading) ||
    (!gameId && gamesLoading)
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050b12] p-8 text-emerald-400">
        Loading checkout...
      </div>
    );
  }

  if (
    (gameId && gameError) ||
    (!gameId && gamesError)
  ) {
    return (
      <div className="min-h-screen bg-[#050b12] p-8 text-center text-white">
        <h1 className="text-2xl font-bold">
          Failed to load checkout
        </h1>
        <button
          type="button"
          onClick={() => navigate("/games")}
          className="mt-6 rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-black"
        >
          Back to Games
        </button>
      </div>
    );
  }

  if (gameId && !game) {
    return (
      <div className="min-h-screen bg-[#050b12] p-8 text-center text-white">
        <h1 className="text-2xl font-bold">Game not found</h1>
        <button
          type="button"
          onClick={() => navigate("/games")}
          className="mt-6 rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-black"
        >
          Browse Games
        </button>
      </div>
    );
  }

  if (!gameId && cartItems.length === 0) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#050b12] p-6 text-white">
        <div className="text-center">
          <ShoppingBag
            size={48}
            className="mx-auto mb-4 text-emerald-400"
          />
          <h1 className="text-3xl font-bold">
            Your Cart Is Empty
          </h1>
          <p className="mt-3 text-zinc-400">
            Add a game to your cart before checking out.
          </p>
          <button
            type="button"
            onClick={() => navigate("/games")}
            className="mt-6 rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-black transition hover:bg-emerald-400"
          >
            Browse Games
          </button>
        </div>
      </div>
    );
  }

  const formatPrice = (amount) => `₹ ${amount.toFixed(2)}`;

  return (
    <div className="min-h-screen bg-[#050b12] p-4 text-white sm:p-6 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold sm:text-4xl">
            Checkout
          </h1>
          <p className="mt-2 text-zinc-400">
            Complete your physical game order.
          </p>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2 lg:gap-8">
            {/* LEFT: SHIPPING DETAILS AND ORDER SUMMARY */}
            <div className="space-y-6">
              <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6">
                <div className="mb-6 flex items-center gap-3">
                  <MapPin className="text-emerald-400" size={25} />
                  <div>
                    <h2 className="text-xl font-semibold">
                      Shipping Address
                    </h2>
                    <p className="mt-1 text-sm text-zinc-400">
                      Where should we deliver your order?
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="fullName"
                      className="mb-2 block text-sm text-zinc-300"
                    >
                      Full name
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      value={shippingAddress.fullName}
                      onChange={updateAddress}
                      autoComplete="name"
                      placeholder="Enter your full name"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm text-zinc-300"
                    >
                      Phone number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={updateAddress}
                      autoComplete="tel"
                      placeholder="Enter your phone number"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="addressLine"
                      className="mb-2 block text-sm text-zinc-300"
                    >
                      House / street address
                    </label>
                    <textarea
                      id="addressLine"
                      name="addressLine"
                      rows={3}
                      value={shippingAddress.addressLine}
                      onChange={updateAddress}
                      autoComplete="street-address"
                      placeholder="House number, street, locality"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="city"
                      className="mb-2 block text-sm text-zinc-300"
                    >
                      City
                    </label>
                    <input
                      id="city"
                      name="city"
                      value={shippingAddress.city}
                      onChange={updateAddress}
                      autoComplete="address-level2"
                      placeholder="City"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="state"
                      className="mb-2 block text-sm text-zinc-300"
                    >
                      State
                    </label>
                    <input
                      id="state"
                      name="state"
                      value={shippingAddress.state}
                      onChange={updateAddress}
                      autoComplete="address-level1"
                      placeholder="State"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="pinCode"
                      className="mb-2 block text-sm text-zinc-300"
                    >
                      PIN / postal code
                    </label>
                    <input
                      id="pinCode"
                      name="pinCode"
                      value={shippingAddress.pinCode}
                      onChange={updateAddress}
                      autoComplete="postal-code"
                      placeholder="Enter PIN / postal code"
                      className={inputClass}
                      required
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <Package className="text-emerald-400" size={25} />
                  <h2 className="text-xl font-semibold">
                    Order Summary
                  </h2>
                </div>

                <div className="space-y-5">
                  {checkoutItems.map((item) => (
                    <div
                      key={item.gameId}
                      className="flex items-center gap-4 border-b border-zinc-800 pb-5"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-24 w-20 shrink-0 rounded-lg object-cover sm:h-28 sm:w-24"
                      />

                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold sm:text-lg">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm text-zinc-400">
                          Physical Game Copy
                        </p>
                        <p className="mt-1 text-sm text-zinc-400">
                          Quantity: {item.quantity}
                        </p>
                        <p className="mt-2 font-semibold text-emerald-400">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {formatPrice(item.price)} per item
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 space-y-3 text-sm sm:text-base">
                  <div className="flex justify-between gap-4 text-zinc-400">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between gap-4 text-zinc-400">
                    <span>Shipping</span>
                    <span>
                      {SHIPPING_FEE === 0
                        ? "Free"
                        : formatPrice(SHIPPING_FEE)}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 border-t border-zinc-700 pt-4">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold text-emerald-400">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                </div>
              </section>
            </div>

            {/* RIGHT: PAYMENT */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6">
              <h2 className="mb-2 text-xl font-semibold">
                Payment Method
              </h2>
              <p className="mb-6 text-sm text-zinc-400">
                Select how you would like to pay.
              </p>

              <div className="space-y-3">
                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                    paymentMethod === "COD"
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-zinc-700 hover:border-zinc-500"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(event) =>
                      setPaymentMethod(event.target.value)
                    }
                    className="mt-1 accent-emerald-500"
                  />
                  <div>
                    <p className="font-semibold">
                      Cash on Delivery (COD)
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">
                      Pay when your order is delivered.
                    </p>
                  </div>
                </label>

                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                    paymentMethod === "UPI"
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-zinc-700 hover:border-zinc-500"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="UPI"
                    checked={paymentMethod === "UPI"}
                    onChange={(event) =>
                      setPaymentMethod(event.target.value)
                    }
                    className="mt-1 accent-emerald-500"
                  />
                  <div>
                    <p className="font-semibold">UPI</p>
                    <p className="mt-1 text-sm text-zinc-400">
                      Demo option only — no payment is processed.
                    </p>
                  </div>
                </label>

                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                    paymentMethod === "CARD"
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-zinc-700 hover:border-zinc-500"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="CARD"
                    checked={paymentMethod === "CARD"}
                    onChange={(event) =>
                      setPaymentMethod(event.target.value)
                    }
                    className="mt-1 accent-emerald-500"
                  />
                  <div>
                    <p className="font-semibold">
                      Credit / Debit Card
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">
                      Demo option only — no payment is processed.
                    </p>
                  </div>
                </label>
              </div>

              <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <div className="flex justify-between gap-4 text-zinc-400">
                  <span>Items</span>
                  <span>
                    {checkoutItems.reduce(
                      (count, item) => count + item.quantity,
                      0
                    )}
                  </span>
                </div>

                <div className="mt-3 flex justify-between gap-4">
                  <span className="font-semibold">Amount due</span>
                  <span className="text-xl font-bold text-emerald-400">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-zinc-500">
                This is a demo storefront. UPI and card payments are
                not connected to a payment gateway. Payment remains
                pending until it is actually confirmed.
              </p>

              <button
                type="submit"
                disabled={
                  orderMutation.isPending ||
                  checkoutItems.length === 0
                }
                className="mt-6 w-full rounded-lg bg-emerald-500 px-6 py-3 font-bold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {orderMutation.isPending
                  ? "Placing Order..."
                  : "Place Order"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/cart")}
                className="mt-3 w-full rounded-lg border border-zinc-700 px-6 py-3 font-semibold text-zinc-300 transition hover:bg-zinc-800"
              >
                Back to Cart
              </button>
            </section>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
