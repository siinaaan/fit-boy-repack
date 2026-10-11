import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { getGames } from "../api/gameApi";
import GameCard from "../components/GameCard";

import {
  CarFront,
  Compass,
  Crosshair,
  Earth,
  Ghost,
  Shield,
  SlidersHorizontal,
  Sword,
  Trophy,
} from "lucide-react";

function Games() {
  const [sortBy, setSortBy] = useState("default");

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
        .includes(searchText);

    const matchesCategory =
      !categoryText ||
      game.category
        ?.toLowerCase()
        .includes(categoryText);

    return matchesSearch && matchesCategory;
  });


  const sortedGames = [...filteredGames].sort(
    (a, b) => {
      const priceA = Number(a.price) || 0;
      const priceB = Number(b.price) || 0;

      if (sortBy === "price-low") {
        return priceA - priceB;
      }

      if (sortBy === "price-high") {
        return priceB - priceA;
      }

      return 0;
    }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050b12] p-6 text-white">
        <h2>Loading games...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#050b12] p-6 text-red-400">
        <h2>
          Error: {error.message}
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050b12] p-4 text-white sm:p-6">
      <div className="mb-6 flex flex-wrap items-center gap-3 border-b border-zinc-800 pb-2 sm:gap-6 sm:pb-0 md:gap-8">

        
        <button
          type="button"
          onClick={() => handleCategory("")}
          className={`pb-2 text-xl font-bold transition sm:pb-3 sm:text-3xl ${
            !selectedCategory
              ? "text-emerald-400"
              : "text-zinc-500 hover:text-amber-600"
          }`}
        >
          All Games
        </button>

        
        <button
          type="button"
          onClick={() =>
            handleCategory("Open World")
          }
          className={`flex items-center gap-1 pb-2 text-sm transition sm:pb-3 sm:text-lg ${
            selectedCategory.toLowerCase() ===
            "open world"
              ? "text-emerald-400"
              : "text-zinc-500 hover:text-amber-600"
          }`}
        >
          <Earth size={18} />
          <span>Open World</span>
        </button>

        
        <button
          type="button"
          onClick={() => handleCategory("Action")}
          className={`flex items-center gap-1 pb-2 text-sm transition sm:pb-3 sm:text-lg ${
            selectedCategory.toLowerCase() ===
            "action"
              ? "text-emerald-400"
              : "text-zinc-500 hover:text-amber-600"
          }`}
        >
          <Sword size={18} />
          Action
        </button>

        
        <button
          type="button"
          onClick={() => handleCategory("RPG")}
          className={`flex items-center gap-1 pb-2 text-sm transition sm:pb-3 sm:text-lg ${
            selectedCategory.toLowerCase() ===
            "rpg"
              ? "text-emerald-400"
              : "text-zinc-500 hover:text-amber-600"
          }`}
        >
          <Shield size={18} />
          RPG
        </button>


        <div className="relative pb-2 sm:pb-3">

          <button
            type="button"
            onClick={() =>
              setShowMore((previous) => !previous)
            }
            aria-expanded={showMore}
            className={`flex items-center gap-2 text-sm transition hover:text-emerald-400 sm:text-lg ${
              [
                "adventure",
                "horror",
                "racing",
                "shooter",
                "sports",
              ].includes(
                selectedCategory.toLowerCase()
              )
                ? "text-emerald-400"
                : "text-zinc-500"
            }`}
          >
            More

            <span
              className={`text-xs transition ${
                showMore ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>

          {showMore && (
            <div className="absolute left-0 top-full z-30 mt-2 w-44 overflow-hidden rounded-lg border border-zinc-800 bg-black shadow-xl sm:w-48">

              <button
                type="button"
                onClick={() =>
                  handleCategory("Adventure")
                }
                className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-emerald-400"
              >
                <Compass size={18} />
                Adventure
              </button>

              <button
                type="button"
                onClick={() =>
                  handleCategory("Horror")
                }
                className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-emerald-400"
              >
                <Ghost size={18} />
                Horror
              </button>

              <button
                type="button"
                onClick={() =>
                  handleCategory("Racing")
                }
                className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-emerald-400"
              >
                <CarFront size={18} />
                Racing
              </button>

              <button
                type="button"
                onClick={() =>
                  handleCategory("Shooter")
                }
                className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-emerald-400"
              >
                <Crosshair size={18} />
                Shooter
              </button>

              <button
                type="button"
                onClick={() =>
                  handleCategory("Sports")
                }
                className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-emerald-400"
              >
                <Trophy size={18} />
                Sports
              </button>

            </div>
          )}
        </div>
      </div>

      
      {searchQuery && (
        <p className="mb-5 text-sm text-zinc-400">
          Search results for{" "}
          <span className="font-semibold text-emerald-400">
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

      

      <div className="mb-6 flex flex-wrap items-center justify-end gap-4">
        <div className="flex items-center gap-3">
          <label
            htmlFor="price-sort"
            className="text-sm text-zinc-400"
          >
            <SlidersHorizontal size={18} className="text-emerald-400"/>
          </label>

          <select
            id="price-sort"
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value)
            }
            className="max-w-full rounded-lg border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-sm text-white outline-none transition focus:border-emerald-500"
          >
            <option value="default">
              Default
            </option>

            <option value="price-low">
              Price: Low to High
            </option>

            <option value="price-high">
              Price: High to Low
            </option>
          </select>
        </div>
      </div>

      
      {sortedGames.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-10 text-center">

          <h2 className="text-2xl font-semibold text-white">
            No games found
          </h2>

          <p className="mt-3 text-zinc-400">
            Try another search or category.
          </p>

          <button
            type="button"
            onClick={() => {
              setSortBy("default");
              handleCategory("");
            }}
            className="mt-5 rounded-lg bg-emerald-600 px-5 py-2 font-semibold text-black transition hover:bg-emerald-500"
          >
            Reset Filters
          </button>

        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {sortedGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
            />
          ))}

        </div>
      )}
    </div>
  );
}

export default Games;
