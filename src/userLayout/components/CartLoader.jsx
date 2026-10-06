import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getCartItems } from "../api/cartApi";
import { setCart } from "../features/cartSlice";

function CartLoader() {
  const dispatch = useDispatch();

  const user = useSelector(
    (state) => state.auth.user
  );

  const {
    data: cartItems = [],
    isError,
    error,
  } = useQuery({
    queryKey: ["cart", user?.id],
    queryFn: () => getCartItems(user.id),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (user?.id) {
      dispatch(setCart(cartItems));
    } else {
      dispatch(setCart([]));
    }
  }, [cartItems, user?.id, dispatch]);

  useEffect(() => {
    if (isError) {
      console.error("Failed to load cart:", error);
    }
  }, [isError, error]);

  return null;
}

export default CartLoader;

