import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { getOrderByUser } from "../api/orderApi";

function useLibrary() {
  const user = useSelector(
    (state) => state.auth.user
  );

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: () => getOrderByUser(user.id),
    enabled: !!user?.id,
  });

  const purchasedGameIds = orders
    .filter(
      (order) => order.orderStatus === "completed"
    )
    .flatMap(
      (order) =>
        order.items?.map((item) => String(item.gameId)) || []
    );

  const isOwned = (gameId) => {
    return purchasedGameIds.includes(String(gameId));
  };

  return {
    isOwned,
    purchasedGameIds,
    isLoading,
    isError,
  };
}

export default useLibrary;