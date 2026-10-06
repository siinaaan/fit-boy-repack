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

  console.log("WishlistLoader user:", user);

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

  console.log("Wishlist API data:", wishlistItems);

  useEffect(() => {
    if (wishlistItems) {
      console.log(
        "Putting wishlist into Redux:",
        wishlistItems
      );

      dispatch(setWishlist(wishlistItems));
    }
  }, [wishlistItems, dispatch]);

  if (isLoading) {
    console.log("Loading wishlist...");
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