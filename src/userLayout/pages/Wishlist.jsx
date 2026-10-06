import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";

import { getGames } from "../api/gameApi";
import { deleteWishlistItem } from "../api/wishlistApi";

import {
    addCartItem,
    getCartItems,
} from "../api/cartApi"

import { removeFromWishlist } from "../features/wishlistSlice";
import { addToCart } from "../features/cartSlice";
import toast from "react-hot-toast";

function Wishlist() {
  const dispatch = useDispatch();

  const user = useSelector(
    (state) => state.auth.user
  );

  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );

  const handleAddToCart = async (game) => {
    if(!user){
      toast.error("Please login to add games to cart.")
        return;
    }

    try{
        const cartItems = await getCartItems(user.id);

        const existingItem = cartItems.find(
            (item) => String(item.gameId) === String(game.id)
        );
        let savedItem;

        if(existingItem){
          toast.error(`${game.title} is already in your cart!`);
          return;
        }else{
          //Add new cart Item
          savedItem = await addCartItem({
            userId: user.id,
            gameId: game.id,
            quantity: 1,
          });
        }

        dispatch(addToCart(savedItem));
        toast.success(`${game.title} added to cart`)
    }catch(error){
      console.error(
        "Failed to add game to cart",error
      );
      toast.error("Failed to add game to cart.")
    }
  };

  const {
    data: games = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["games"],
    queryFn: getGames,
  });

  console.log("Games:", games);

  const wishlistGames = wishlistItems
    .map((wishlistItem) => {
      const game = games.find(
        (game) =>
          String(game.id) === String(wishlistItem.gameId)
      );

      console.log(
        "Wishlist gameId:",
        wishlistItem.gameId,
        "Matched game:",
        game
      );

      return game;
    })
    .filter(Boolean);

  console.log("Final wishlist games:", wishlistGames);

  const handleRemove = async (wishlistItem) => {
    try {
      await deleteWishlistItem(wishlistItem.id);

      dispatch(
        removeFromWishlist(wishlistItem.id)
      );

      toast.success("Game removed from wishlist!")
    } catch (error) {
      console.error(
        "Failed to remove wishlist item:",
        error
      );

      toast.error("Failed to remove game from wishlist")
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-white">
        Loading wishlist...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-white">
        Failed to load games.
      </div>
    );
  }

  return (
    <div className="p-8 text-white">

      <h1 className="mb-8 text-3xl font-bold">
        My Wishlist
      </h1>

      {wishlistGames.length === 0 ? (
        <div className="rounded-xl bg-zinc-900 p-8">
          <p className="text-gray-400">
            Your wishlist is empty.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {wishlistGames.map((game) => {

            const wishlistItem = wishlistItems.find(
              (item) =>
                String(item.gameId) ===
                String(game.id)
            );

            return (
              <div
                key={wishlistItem.id}
                className="overflow-hidden rounded-xl bg-zinc-900"
              >

                <img
                  src={game.image[0]}
                  alt={game.title}
                  className="h-80 w-full object-cover"
                />

                <div className="p-4">

                  <h2 className="text-xl font-bold">
                    {game.title}
                  </h2>

                  <p className="mt-2 text-sm text-gray-400">
                    {game.category}
                  </p>

                  <p className="mt-3 text-lg font-semibold">
                    ${game.price}
                  </p>

                  <button 
                  type="button"
                  onClick={()=>handleAddToCart(game)}
                  className="mt-4 w-full rounded-lg bg-amber-500 px-4 py-2 font-semibold text-black transition hover:bg-amber-400"
                  >
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleRemove(wishlistItem)
                    }
                    className="mt-4 w-full rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-500"
                  >
                    Remove
                  </button>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default Wishlist;