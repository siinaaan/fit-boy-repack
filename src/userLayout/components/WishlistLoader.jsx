import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getWishlistItems } from "../api/wishlistApi";
import { setWishlist } from "../features/wishlistSlice";

function WishlistLoader() {
  const dispatch = useDispatch();

  const user = useSelector(
    (state) => state.auth.user
  );


  const {
    data: wishlistItems,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["wishlist", user?.id],
    queryFn: () => getWishlistItems(user.id),
    enabled: !!user?.id,
  });


  useEffect(() => {
    if(!user?.id){
      dispatch(setWishlist([]));
      return;
    }

    if (wishlistItems) {
      dispatch(setWishlist(wishlistItems));
    }
  }, [user?.id,wishlistItems, dispatch]);

  if (isLoading) {
    <h2>Loading...</h2>
  }

  if (isError) {
    console.error(
      "Wishlist loading error:",
      error
    );
  }

  return null;
}

export default WishlistLoader;