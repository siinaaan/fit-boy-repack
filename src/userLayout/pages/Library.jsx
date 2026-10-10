import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  getOrderByUser,
  updateOrder,
  deleteOrder,
} from "../api/orderApi";

import { getGames } from "../api/gameApi";

function Library() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const user = useSelector((state) => state.auth.user);

  const [showRemoveModal, setShowRemoveModal] =
    useState(false);

  const [selectedGame, setSelectedGame] =
    useState(null);

  const {
    data: orders = [],
    isLoading: ordersLoading,
    isError: ordersError,
  } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: () => getOrderByUser(user.id),
    enabled: !!user?.id,
  });

  const {
    data: games = [],
    isLoading: gamesLoading,
    isError: gamesError,
  } = useQuery({
    queryKey: ["games"],
    queryFn: getGames,
  });

  const openRemoveModal = (game) => {
    setSelectedGame(game);
    setShowRemoveModal(true);
  };

  const closeRemoveModal = () => {
    setShowRemoveModal(false);
    setSelectedGame(null);
  };

  const handleRemoveFromLibrary = async (gameId) => {
    try {

      const order = orders.find(
        (order) =>
          order.orderStatus === "completed" &&
          order.items?.some(
            (item) =>
              String(item.gameId) ===
              String(gameId)
          )
      );

      if (!order) {
        toast.error("Game not found in library.");
        closeRemoveModal();
        return;
      }

      const updatedItems = order.items.filter(
        (item) =>
          String(item.gameId) !==
          String(gameId)
      );

      if (updatedItems.length === 0) {
        await deleteOrder(order.id);
      }

      else {
        const updatedTotal =
          updatedItems.reduce(
            (total, item) =>
              total + Number(item.price),
            0
          );

        await updateOrder(order.id, {
          items: updatedItems,
          totalAmount: updatedTotal,
        });
      }

      await queryClient.invalidateQueries({
        queryKey: ["orders", user.id],
      });

      closeRemoveModal();

      toast.success(
        "Game removed from library."
      );

    } catch (error) {
      console.error(
        "Failed to remove game from library:",
        error
      );

      toast.error(
        "Failed to remove game from library."
      );
    }
  };


  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 p-8 text-white">

        <div className="mx-auto max-w-xl text-center">

          <h1 className="text-3xl font-bold">
            Library
          </h1>

          <p className="mt-4 text-zinc-400">
            Please login to view your library.
          </p>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-6 rounded-lg bg-amber-500 px-6 py-3 font-semibold text-black transition hover:bg-amber-400"
          >
            Login
          </button>

        </div>

      </div>
    );
  }

  if (ordersLoading || gamesLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 p-8 text-white">

        <h1 className="text-3xl font-bold">
          Library
        </h1>

        <p className="mt-8 text-zinc-400">
          Loading your games...
        </p>

      </div>
    );
  }


  if (ordersError || gamesError) {
    return (
      <div className="min-h-screen bg-zinc-950 p-8 text-white">

        <h1 className="text-3xl font-bold">
          Library
        </h1>

        <p className="mt-8 text-red-400">
          Failed to load your library.
        </p>

      </div>
    );
  }

  const completedOrders = orders.filter(
    (order) =>
      order.orderStatus === "completed"
  );

  const purchasedGameIds =
    completedOrders.flatMap(
      (order) =>
        order.items?.map(
          (item) => String(item.gameId)
        ) || []
    );

  const uniqueGameIds = [
    ...new Set(purchasedGameIds),
  ];


  const purchasedGames = games.filter(
    (game) =>
      uniqueGameIds.includes(
        String(game.id)
      )
  );

  return (
    <div className="min-h-screen bg-zinc-950 p-8 text-white">

      <div className="mx-auto max-w-7xl">


        <div className="mb-10">

          <h1 className="text-4xl font-bold">
            Library
          </h1>

          <p className="mt-2 text-zinc-400">
            Your purchased games
          </p>

        </div>


        {purchasedGames.length === 0 ? (

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-12 text-center">

            <h2 className="text-2xl font-semibold">
              Your library is empty
            </h2>

            <p className="mt-3 text-zinc-400">
              Games you purchase will appear here.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/games")
              }
              className="mt-6 rounded-lg bg-amber-500 px-6 py-3 font-semibold text-black transition hover:bg-amber-400"
            >
              Browse Games
            </button>

          </div>

        ) : (

          <>

            <p className="mb-6 text-sm text-zinc-400">

              {purchasedGames.length}{" "}

              {purchasedGames.length === 1
                ? "game"
                : "games"}

              {" "}in your library

            </p>


            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {purchasedGames.map((game) => (

                <div
                  key={game.id}
                  className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 transition duration-300 hover:-translate-y-1 hover:border-zinc-700"
                >

                  <div className="relative overflow-hidden">

                    <img
                      src={game.image?.[0]}
                      alt={game.title}
                      className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute right-3 top-3 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-black">
                      ✓ Owned
                    </div>

                  </div>


                  <div className="p-5">

                    <h2 className="truncate text-xl font-bold">
                      {game.title}
                    </h2>

                    <p className="mt-2 text-sm text-zinc-400">
                      {game.category}
                    </p>

                    <p className="mt-3 text-sm text-zinc-500">
                      Digital Copy
                    </p>


                    <button
                      type="button"
                      className="mt-5 w-full rounded-lg border border-green-500 px-4 py-3 font-semibold text-green-400 transition hover:bg-green-500 hover:text-black"
                    >
                      Download
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        openRemoveModal(game)
                      }
                      className="mt-3 w-full rounded-lg border border-red-600 px-4 py-3 font-semibold text-red-500 transition hover:bg-red-600 hover:text-white"
                    >
                      Remove from Library
                    </button>

                  </div>

                </div>

              ))}

            </div>

          </>

        )}

      </div>

      {/* REMOVE CONFIRMATION */}
      {showRemoveModal && selectedGame && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">

          <div className="w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl">

            <h2 className="text-2xl font-bold text-white">
              Remove Game?
            </h2>

            <p className="mt-4 text-zinc-400">

              Are you sure you want to remove{" "}

              <span className="font-semibold text-white">
                {selectedGame.title}
              </span>

              {" "}from your library?

            </p>

            <p className="mt-2 text-sm text-zinc-500">
              You will be able to purchase this
              game again.
            </p>


            <div className="mt-6 flex gap-3">


              <button
                type="button"
                onClick={closeRemoveModal}
                className="flex-1 rounded-lg border border-zinc-700 px-4 py-3 font-semibold text-zinc-300 transition hover:bg-zinc-800"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() =>
                  handleRemoveFromLibrary(
                    selectedGame.id
                  )
                }
                className="flex-1 rounded-lg bg-red-700 px-4 py-3 font-semibold text-white transition hover:bg-red-600"
              >
                Remove
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Library;