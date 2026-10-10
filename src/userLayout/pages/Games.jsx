import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { getGames } from "../api/gameApi";
import GameCard from "../components/GameCard";

function Games() {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const [showMore, setShowMore] = useState(false);

  const searchQuery =
    searchParams.get("search") || "";

  const selectedCategory =
    searchParams.get("category") || "";

  const {
    data: games = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["games"],
    queryFn: getGames,
  });

  const handleCategory = (category) => {
    setShowMore(false);

    const params = new URLSearchParams();

    if (searchQuery) {
      params.set("search", searchQuery);
    }

    if (category) {
      params.set("category", category);
    }

    setSearchParams(params);
  };

  const filteredGames = games.filter((game) => {
    const searchText =
      searchQuery.toLowerCase().trim();

    const categoryText =
      selectedCategory.toLowerCase().trim();

    const matchesSearch =
      !searchText ||
      game.title
        ?.toLowerCase()
        .includes(searchText)

    const matchesCategory =
      !categoryText ||
      game.category
        ?.toLowerCase()
        .includes(categoryText);

    return (
      matchesSearch &&
      matchesCategory
    );
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <h2>Loading...</h2>
      </div>
    );
  }


  if (error) {
    return (
      <div className="p-6">
        <h2>
          Error: {error.message}
        </h2>
      </div>
    );
  }

  return (
    <div className="p-6">


      <div className="mb-6 flex items-center gap-8 border-b">

        <button
          type="button"
          onClick={() =>
            handleCategory("")
          }
          className={`pb-3 text-3xl font-bold transition ${
            !selectedCategory
              ? "text-emerald-400"
              : "text-zinc-500  hover:text-amber-600"
          }`}
        >
          All Games
        </button>


        <button
          type="button"
          onClick={() =>
            handleCategory("Open World")
          }
          className={`pb-3 text-lg transition ${
            selectedCategory ===
            "Open World"
              ? "text-emerald-400"
              : "text-zinc-500  hover:text-amber-600"
          }`}
        >
          Open World
        </button>


        <button
          type="button"
          onClick={() =>
            handleCategory("action")
          }
          className={`pb-3 text-lg transition ${
            selectedCategory ===
            "action"
              ? "text-emerald-400"
              : "text-zinc-500  hover:text-amber-600"
          }`}
        >
          Action
        </button>


        <button
          type="button"
          onClick={() =>
            handleCategory("rpg")
          }
          className={`pb-3 text-lg transition ${
            selectedCategory ===
            "rpg"
              ? "text-emerald-400"
              : "text-zinc-500 hover:text-amber-600"
          }`}
        >
          RPG
        </button>

        <div className="relative pb-3">

          <button
            type="button"
            onClick={() =>
              setShowMore(
                !showMore
              )
            }
            className="flex items-center gap-2 text-lg text-zinc-500 transition hover:text-emerald-400"
          >
            More

            <span
              className={`text-sm transition ${
                showMore
                  ? "rotate-180"
                  : ""
              }`}
            >
              ▼
            </span>

          </button>

          {showMore && (

            <div className="absolute left-0 top-full z-30 mt-2 w-48 overflow-hidden rounded-lg border border-zinc-200 bg-black shadow-xl">

              <button
                type="button"
                onClick={() =>
                  handleCategory(
                    "Adventure"
                  )
                }
                className="block w-full px-4 py-3 text-left text-emerald-600 hover:bg-zinc-800"
              >
                Adventure
              </button>

              <button
                type="button"
                onClick={() =>
                  handleCategory(
                    "Horror"
                  )
                }
                className="block w-full px-4 py-3 text-left text-emerald-600 hover:bg-zinc-800"
              >
                Horror
              </button>

              <button
                type="button"
                onClick={() =>
                  handleCategory(
                    "Racing"
                  )
                }
                className="block w-full px-4 py-3 text-left text-emerald-600 hover:bg-zinc-800"
              >
                Racing
              </button>

              <button
                type="button"
                onClick={() =>
                  handleCategory(
                    "Shooter"
                  )
                }
                className="block w-full px-4 py-3 text-left  text-emerald-600 hover:bg-zinc-800"
              >
                Shooter
              </button>

              <button
                type="button"
                onClick={() =>
                  handleCategory(
                    "Sports"
                  )
                }
                className="block w-full px-4 py-3 text-left  text-emerald-600 hover:bg-zinc-800"
              >
                Sports
              </button>

            </div>

          )}

        </div>

      </div>

      {searchQuery && (
        <p className="mb-5 text-sm text-zinc-500">
          Search results for{" "}
          <span className="font-semibold text-black">
            "{searchQuery}"
          </span>
        </p>
      )}

      {selectedCategory && (
        <p className="mb-5 text-sm text-zinc-400">
          Category:{" "}
          <span className="font-semibold text-emerald-400">
            {selectedCategory}
          </span>
        </p>
      )}

      {filteredGames.length === 0 ? (

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-10 text-center">

          <h2 className="text-2xl font-semibold text-white">
            No games found
          </h2>

          <p className="mt-3 text-zinc-400">
            Try another search or category.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {filteredGames.map(
            (game) => (
              <GameCard
                key={game.id}
                game={game}
              />
            )
          )}

        </div>

      )}

    </div>
  );
}

export default Games;