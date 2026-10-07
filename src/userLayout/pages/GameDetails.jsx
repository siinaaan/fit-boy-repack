import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

import { getGameById } from "../api/gameApi";
import { addCartItem, getCartItems } from "../api/cartApi";

import { X } from "lucide-react";
import toast from "react-hot-toast";

import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/cartSlice";

import useLibrary from "../hooks/useLibrary";

function GameDetails() {
  const { id } = useParams();

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const user = useSelector(
    (state) => state.auth.user
  );

  // Check whether the current user owns this game
  const { isOwned } = useLibrary();

  const [selectedImage, setSelectedImage] = useState(0);
  const [adding, setAdding] = useState(false);

  // ========================================
  // GET GAME
  // ========================================

  const {
    data: game,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["game", id],
    queryFn: () => getGameById(id),
  });

  // ========================================
  // ADD TO CART
  // ========================================

  const handleAddToCart = async () => {
    if (!user) {
      toast.error(
        "Please login to add games to cart."
      );

      navigate("/login");
      return;
    }

    // Extra protection:
    // Don't allow an owned game into cart
    if (isOwned(game.id)) {
      toast.error(
        `${game.title} is already in your library!`
      );

      return;
    }

    try {
      setAdding(true);

      // Get user's current cart
      const cartItems = await getCartItems(
        user.id
      );

      // Check duplicate
      const existingItem = cartItems.find(
        (item) =>
          String(item.gameId) ===
          String(game.id)
      );

      if (existingItem) {
        toast.error(
          `${game.title} is already in your cart!`
        );

        return;
      }

      // Add new cart item
      const savedItem = await addCartItem({
        userId: user.id,
        gameId: game.id,
        quantity: 1,
      });

      // Update Redux
      dispatch(addToCart(savedItem));

      toast.success(
        `${game.title} added to cart!`
      );

      // Refresh cart query
      await queryClient.invalidateQueries({
        queryKey: ["cart", user.id],
      });

    } catch (error) {
      console.error(
        "Failed to add game to cart:",
        error
      );

      toast.error(
        "Failed to add game to cart."
      );

    } finally {
      setAdding(false);
    }
  };

  // ========================================
  // BUY NOW
  // ========================================

  const handleBuyNow = () => {
    if (!user) {
      toast.error(
        "Please login to buy this game."
      );

      navigate("/login");
      return;
    }

    // Don't allow purchasing the same game again
    if (isOwned(game.id)) {
      toast.error(
        `${game.title} is already in your library!`
      );

      return;
    }

    navigate(
      `/checkout?gameId=${game.id}`
    );
  };

  // ========================================
  // LOADING
  // ========================================

  if (isLoading) {
    return (
      <h2 className="p-8 text-white">
        Loading...
      </h2>
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (isError) {
    return (
      <h2 className="p-8 text-white">
        Failed to load details
      </h2>
    );
  }

  // Check ownership after game has loaded
  const owned = isOwned(game.id);

  // ========================================
  // UI
  // ========================================

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 text-white">

      <div className="relative grid max-h-[90vh] w-full max-w-6xl grid-cols-1 gap-8 overflow-y-auto scrollbar-none rounded-2xl bg-zinc-900 p-8 lg:grid-cols-2">

        {/* CLOSE BUTTON */}

        <button
          onClick={() => navigate(-1)}
          className="absolute right-5 top-5 z-50 cursor-pointer"
        >
          <X size={28} />
        </button>


        {/* ==================================
            LEFT SIDE
        =================================== */}

        <div>

          <div>

            <img
              src={game.image[selectedImage]}
              alt={game.title}
              className="mt-6 h-120 w-80 rounded-xl object-cover"
            />

          </div>


          {/* THUMBNAILS */}

          <div className="mt-4 flex gap-4">

            {game.image.map(
              (image, index) => (

                <button
                  key={image}
                  onClick={() =>
                    setSelectedImage(index)
                  }
                  className={`overflow-hidden rounded-lg border-2 ${
                    selectedImage === index
                      ? "border-white"
                      : "border-transparent"
                  }`}
                >

                  <img
                    src={image}
                    alt={`${game.title} ${
                      index + 1
                    }`}
                    className="h-20 w-32 object-cover"
                  />

                </button>

              )
            )}

          </div>

        </div>


        {/* ==================================
            RIGHT SIDE
        =================================== */}

        <div className="flex flex-col justify-center rounded-2xl bg-zinc-900 p-8">

          <h1 className="mt-6 text-3xl font-bold">
            {game.title}
          </h1>


          <div className="mt-4 flex gap-3 text-gray-400">

            <p className="mt-4 text-gray-500">
              {game.category}
            </p>

          </div>


          <p className="mt-6 leading-7 text-gray-300">
            {game.description}
          </p>


          <p className="mt-8 text-3xl font-bold">
            ${game.price}
          </p>


          {/* ==================================
              PURCHASE BUTTONS
          =================================== */}

          <div className="mt-8 flex gap-4">

            {owned ? (

              // ==================================
              // ALREADY OWNED
              // ==================================

              <button
                type="button"
                onClick={() =>
                  navigate("/library")
                }
                className="w-full rounded-lg border border-green-500 px-6 py-3 font-semibold text-green-400 transition hover:bg-green-500 hover:text-black"
              >
                ✓ In Library
              </button>

            ) : (

              // ==================================
              // NOT OWNED
              // ==================================

              <>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="flex-1 rounded-lg bg-amber-500 px-6 py-3 font-semibold text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {adding
                    ? "Adding..."
                    : "Add to Cart"}
                </button>


                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="flex-1 rounded-lg border border-amber-500 px-6 py-3 font-semibold text-amber-500 transition hover:bg-amber-500 hover:text-black"
                >
                  Buy Now
                </button>
              </>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default GameDetails;