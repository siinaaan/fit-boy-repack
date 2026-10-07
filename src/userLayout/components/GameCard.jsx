import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import useLibrary from "../hooks/useLibrary";

import { addToCart } from "../features/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../features/wishlistSlice";

import {
  addCartItem,
  getCartItems,
} from "../api/cartApi";

import {
  addWishlistItem,
  getWishlistItems,
  deleteWishlistItem,
} from "../api/wishlistApi";

function GameCard({ game }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(
    (state) => state.auth.user
  );

  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );

  // Library ownership
  const { isOwned } = useLibrary();

  const owned = isOwned(game.id);

  const isWishlisted = wishlistItems.some(
    (item) =>
      String(item.gameId) === String(game.id)
  );

  // =========================
  // ADD TO CART
  // =========================

  const handleAddToCart = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to add games to cart.");
      navigate("/login");
      return;
    }

    try {
      const cartItems = await getCartItems(user.id);

      const existingItem = cartItems.find(
        (item) =>
          String(item.gameId) === String(game.id)
      );

      if (existingItem) {
        toast.error(
          `${game.title} is already in your cart!`
        );
        return;
      }

      const savedItem = await addCartItem({
        userId: user.id,
        gameId: game.id,
        quantity: 1,
      });

      dispatch(addToCart(savedItem));

      toast.success(
        `${game.title} added to cart!`
      );

    } catch (error) {
      console.error(
        "Failed to add game to cart:",
        error
      );

      toast.error(
        "Failed to add game to cart."
      );
    }
  };

  // =========================
  // WISHLIST
  // =========================

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error(
        "Please login to add games to wishlist."
      );

      navigate("/login");
      return;
    }

    try {
      const savedItems =
        await getWishlistItems(user.id);

      const existingItem = savedItems.find(
        (item) =>
          String(item.gameId) ===
          String(game.id)
      );

      if (existingItem) {
        await deleteWishlistItem(
          existingItem.id
        );

        dispatch(
          removeFromWishlist(existingItem.id)
        );

        toast.success(
          `${game.title} removed from wishlist!`
        );

        return;
      }

      const savedItem =
        await addWishlistItem({
          userId: user.id,
          gameId: game.id,
        });

      dispatch(addToWishlist(savedItem));

      toast.success(
        `${game.title} added to wishlist!`
      );

    } catch (error) {
      console.error(
        "Failed to update wishlist:",
        error
      );

      toast.error(
        "Failed to update wishlist."
      );
    }
  };

  return (
    <div className="relative">

      {/* Game Image */}

      <Link to={`/games/${game.id}`}>
        <img
          src={game.image[0]}
          alt={game.title}
          className="h-120 w-full object-cover"
        />
      </Link>


      {/* Wishlist */}

      <button
        type="button"
        onClick={handleWishlist}
        aria-label={
          isWishlisted
            ? "Remove from wishlist"
            : "Add to wishlist"
        }
        title={
          isWishlisted
            ? "In Wishlist"
            : "Add to Wishlist"
        }
        className="absolute right-3 top-3 z-10 rounded-full bg-black/70 p-3 transition hover:bg-black"
      >
        <Heart
          size={22}
          className={
            isWishlisted
              ? "fill-emerald-600 text-emerald-600"
              : "text-white"
          }
        />
      </button>


      {/* Game Information */}

      <div className="p-4">

        <Link to={`/games/${game.id}`}>
          <h2 className="text-xl font-bold">
            {game.title}
          </h2>
        </Link>

        <p className="mt-1 text-sm text-gray-400">
          {game.category}
        </p>

        <p className="mt-3 text-lg font-semibold">
          ${game.price}
        </p>


        {/* Ownership */}

        {owned ? (

          <button
            type="button"
            onClick={() => navigate("/library")}
            className="mt-4 w-full rounded-lg border border-green-500 px-4 py-2 font-semibold text-green-400 transition hover:bg-green-500 hover:text-black"
          >
            ✓ In Library
          </button>

        ) : (

          <button
            type="button"
            onClick={handleAddToCart}
            className="mt-4 w-full rounded-lg bg-[#8b0d1a] px-4 py-2 font-semibold text-white hover:bg-[#fb3640]"
          >
            Add to Cart
          </button>

        )}

      </div>

    </div>
  );
}

export default GameCard;