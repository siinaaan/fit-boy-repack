import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import { addToCart } from "../features/cartSlice";
import { addToWishlist, removeFromWishlist } from "../features/wishlistSlice";

import {
  addCartItem,
  updateCartItem,
  getCartItems,
} from "../api/cartApi";

import {
  addWishlistItem,
  getWishlistItems,
  deleteWishlistItem,
} from "../api/wishlistApi"

function GameCard({ game }) {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(
    (state) => state.auth.user
  );

  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );

  const isWishlisted = wishlistItems.some(
    (item) => String(item.gameId) === String(game.id)
  );

  const handleAddToCart = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate("/login");
      return;
    }

    try{
    const cartItems = await getCartItems(user.id)

    const existingItem = cartItems.find(
      (item) =>
        String(item.gameId) === String(game.id)
    );

      let savedItem;

      if (existingItem) {
        // PATCH existing cart item
        savedItem = await updateCartItem(
          existingItem.id,
          existingItem.quantity + 1
        );
      } else {
        // POST new cart item
        savedItem = await addCartItem({
          userId: user.id,
          gameId: game.id,
          quantity: 1,
        });
      }

      dispatch(addToCart(savedItem));
    }catch(error){
        console.error(
            "Failed to add games to cart",error
        )
    }
     
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    

    if(!user) {
      navigate("/login");
      return;
    }
    try{
      const savedItems = await getWishlistItems(user.id);

      const existingItem = savedItems.find(
        (item) => String(item.gameId) === String(game.id)
      );
      
      if(existingItem){
        await deleteWishlistItem(existingItem.id);

        dispatch(removeFromWishlist(existingItem.id)
      );
        return;
      }

      const savedItem = await addWishlistItem({
        userId: user.id,
        gameId: game.id,
      });

      dispatch(addToWishlist(savedItem));
    }catch(error){
      console.error("Failed to update wishlist: ", error)
    }
  };

  return (
    <div className="relative">
      <Link to={`/games/${game.id}`}>
        <img
          src={game.image[0]}
          alt={game.title}
          className="h-120 w-full object-cover"
        />
      </Link>

      <button 
      type="button"
      onClick={handleWishlist}
      aria-label={
        isWishlisted ? "Already in wishlist" : "Added to wishlist"
      } title={isWishlisted ? "In Wishlist" : "Add to Wishlist"}
      className="absolute right-3 top-3 z-10 rounded-full bg-black/70 p-3 transition hover:bg-black">
        <Heart size={22}
        className={
        isWishlisted ? "fill-red-500 text-red-500"
        :"text-white"
      }/>
      </button>

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

        <button
        type="button"
          onClick={handleAddToCart}
          className="mt-4 w-full rounded-lg bg-[#8b0d1a] px-4 py-2 font-semibold text-black hover:bg-[#fb3640]"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default GameCard;