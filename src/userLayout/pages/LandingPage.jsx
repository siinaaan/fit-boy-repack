import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { getGames } from "../api/gameApi";
import GameCard from "../components/GameCard";

function LandingPage() {
  const navigate = useNavigate();

  const {
    data: games = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["games"],
    queryFn: getGames,
  });

  // ============================================
  // LOADING
  // ============================================

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <p className="text-lg text-zinc-400">
          Loading games...
        </p>
      </div>
    );
  }

  // ============================================
  // ERROR
  // ============================================

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-red-400">
        <p>Failed to load games.</p>
      </div>
    );
  }

  // ============================================
  // HERO GAMES
  // ============================================

  const heroGames = games.slice(0, 17);

  /*
    12 HEXAGON POSITIONS

    x = horizontal position
    y = vertical position
    size = size of hexagon
  */
const layout = [
  // =========================
  // ROW 1 — TOP
  // =========================

  // 1
  {
    x: 20,
    y: 15,
    size: 11,
  },

  // 2
  {
    x: 39,
    y: 12,
    size: 11,
  },

  // 3
  {
    x: 61,
    y: 12,
    size: 11,
  },

  // 4
  {
    x: 80,
    y: 15,
    size: 11,
  },


  // =========================
  // ROW 2 — UPPER MIDDLE
  // =========================

  // 5
  {
    x: 11,
    y: 38,
    size: 13,
  },

  // 6
  {
    x: 29,
    y: 37,
    size: 13,
  },

  // 7
  {
    x: 71,
    y: 37,
    size: 13,
  },

  // 8
  {
    x: 89,
    y: 38,
    size: 13,
  },


  // =========================
  // CENTER
  // =========================

  // 9 - FEATURED
  {
    x: 50,
    y: 45,
    size: 25,
    featured: true,
  },


  // =========================
  // ROW 3 — LOWER MIDDLE
  // =========================

  // 10
  {
    x: 11,
    y: 63,
    size: 13,
  },

  // 11
  {
    x: 29,
    y: 64,
    size: 13,
  },

  // 12
  {
    x: 71,
    y: 64,
    size: 13,
  },

  // 13
  {
    x: 89,
    y: 63,
    size: 13,
  },


  // =========================
  // ROW 4 — BOTTOM
  // =========================

  // 14
  {
    x: 20,
    y: 84,
    size: 11,
  },

  // 15
  {
    x: 39,
    y: 87,
    size: 11,
  },

  // 16
  {
    x: 61,
    y: 87,
    size: 11,
  },

  // 17
  {
    x: 80,
    y: 84,
    size: 11,
  },
];

  // ============================================
  // TRENDING GAMES
  // ============================================

  const trendingGames = games.slice(14, 18);

  // ============================================
  // MORE GAMES
  // ============================================

  const moreGames = games.slice(11, 15);

  // ============================================
  // CATEGORIES
  // ============================================

  const categories = [
    {
      name: "Action",
      image: games.find(
        (game) =>
          game.category?.toLowerCase() ===
          "action"
      )?.image?.[0],
    },

    {
      name: "RPG",
      image: games.find(
        (game) =>
          game.category?.toLowerCase() ===
          "rpg"
      )?.image?.[0],
    },

    {
      name: "Open World",
      image: games.find(
        (game) =>
          game.category
            ?.toLowerCase()
            .includes("open world")
      )?.image?.[0],
    },

    {
      name: "Shooter",
      image: games.find(
        (game) =>
          game.category
            ?.toLowerCase()
            .includes("shooter")
      )?.image?.[0],
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* ================================================= */}
      {/* HERO SECTION */}
      {/* ================================================= */}

      <section className="px-4 py-8 sm:px-6">

        <div className="mx-auto w-full max-w-[1250px]">

          <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-zinc-800 bg-[#101214] shadow-2xl">

            {/* ========================================= */}
            {/* HEXAGON BACKGROUND */}
            {/* ========================================= */}

            <div className="absolute inset-0">

              <div
                className="absolute inset-0  grid-bg"
                style={{
            
                  backgroundPosition:
                    "0 0, 0 0, 40px 70px, 40px 70px, 0 0",
                }}
              />

            </div>

            {/* GLOW EFFECTS */}

            <div className="pointer-events-none absolute inset-0">

              <div className="absolute left-[10%] top-[40%] h-0.5 w-[22%] rotate-30 bg-green-400/40 blur-sm" />

              <div className="absolute left-[10%] top-[58%] h-0.5 w-[23%] rotate-[-30deg] bg-green-400/30 blur-sm" />

              <div className="absolute right-[12%] top-[32%] h-0.5 w-[20%] rotate-[-30deg] bg-green-400/30 blur-sm" />

              <div className="absolute bottom-[18%] left-[38%] h-0.5 w-[22%] rotate-20 bg-green-400/30 blur-sm" />

            </div>



            {/* HEXAGON GAMES */}

            {heroGames.map((game, index) => {

              const position = layout[index];

              if (!position) {
                return null;
              }

              return (
                <button
                  key={game.id}
                  type="button"
                  onClick={() =>
                    navigate(
                      `/games/${game.id}`
                    )
                  }
                  className="group absolute z-10 overflow-hidden transition-all duration-500 hover:z-40 hover:scale-105"
                  style={{
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                    width: `${position.size}%`,
                    aspectRatio: "1",
                    transform:
                      "translate(-50%, -50%)",
                    clipPath:
                      "polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)",
                  }}
                >

                  {/* IMAGE */}

                  <img
                    src={game.image?.[0]}
                    alt={game.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  {/* OVERLAY */}

                  <div className="absolute inset-0 bg-black/10 transition group-hover:bg-black/0" />

                  {/* FEATURED */}

                  {position.featured && (
                    <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/80 via-transparent to-transparent pb-[12%]">

                      <div className="text-center">

                        <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-amber-400 sm:text-xs">
                          Featured
                        </p>

                        <h2 className="mt-1 text-sm font-bold sm:text-xl md:text-2xl">
                          {game.title}
                        </h2>

                      </div>

                    </div>
                  )}

                </button>
              );
            })}

            {/* ========================================= */}
            {/* HERO BRAND */}
            {/* ========================================= */}

            <div className="absolute bottom-6 left-6 z-30 sm:bottom-8 sm:left-8">

              <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-amber-500 sm:text-xs">
                FitBoy Repacks
              </p>

              <h1 className="mt-1 text-xl font-black sm:text-3xl md:text-4xl">
                Your next game
                <br />
                starts here.
              </h1>

            </div>

            {/* ========================================= */}
            {/* BROWSE BUTTON */}
            {/* ========================================= */}

            <button
              type="button"
              onClick={() =>
                navigate("/games")
              }
              className="absolute bottom-6 right-6 z-30 rounded-full  backdrop-blur-lg px-5 py-2.5 text-sm font-semibold text-emerald-400 transition hover:scale-105 hover:bg-zinc-800 sm:bottom-8 sm:right-8 sm:px-7 sm:py-3"
            >
              Browse Games
            </button>

          </div>

        </div>

      </section>

      {/* ================================================= */}
      {/* TRENDING GAMES */}
      {/* ================================================= */}

      <section className="px-4 py-12 sm:px-6">

        <div className="mx-auto max-w-7xl">

          <div className="mb-6 flex items-end justify-between">

            <div>

              <p className="text-sm font-semibold uppercase tracking-widest text-amber-500">
                Popular
              </p>

              <h2 className="mt-1 text-3xl font-bold">
                Trending Games
              </h2>

            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/games")
              }
              className="text-sm font-semibold text-zinc-400 transition hover:text-white"
            >
              View All →
            </button>

          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {trendingGames.map(
              (game) => (
                <GameCard
                  key={game.id}
                  game={game}
                />
              )
            )}

          </div>

        </div>

      </section>

      {/* ================================================= */}
      {/* CATEGORIES */}
      {/* ================================================= */}

      <section className="px-4 py-12 sm:px-6">

        <div className="mx-auto max-w-7xl">

          <div className="mb-6">

            <p className="text-sm font-semibold uppercase tracking-widest text-amber-500">
              Explore
            </p>

            <h2 className="mt-1 text-3xl font-bold">
              Browse Categories
            </h2>

          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

            {categories.map(
              (category) => (

                <button
                  key={category.name}
                  type="button"
                  onClick={() =>
                    navigate(
                      `/games?category=${encodeURIComponent(
                        category.name
                      )}`
                    )
                  }
                  className="group relative h-40 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900"
                >

                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-zinc-800" />
                  )}

                  <div className="absolute inset-0 bg-black/50 transition group-hover:bg-black/30" />

                  <h3 className="absolute inset-0 flex items-center justify-center text-xl font-bold">
                    {category.name}
                  </h3>

                </button>

              )
            )}

          </div>

        </div>

      </section>

      {/* ================================================= */}
      {/* MORE GAMES */}
      {/* ================================================= */}

      <section className="px-4 py-12 sm:px-6">

        <div className="mx-auto max-w-7xl">

          <div className="mb-6">

            <p className="text-sm font-semibold uppercase tracking-widest text-amber-500">
              Discover
            </p>

            <h2 className="mt-1 text-3xl font-bold">
              More Games
            </h2>

          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {moreGames.map(
              (game) => (
                <GameCard
                  key={game.id}
                  game={game}
                />
              )
            )}

          </div>

        </div>

      </section>

      
      {/* CTA */}

      <section className="px-4 py-16 sm:px-6">

        <div className="mx-auto max-w-7xl">

          <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 px-6 py-16 text-center sm:px-12">

            <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-amber-500/10 blur-[100px]" />

            <div className="relative">

              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">
                Ready to play?
              </p>

              <h2 className="mt-3 text-4xl font-black sm:text-5xl">
                Find your next level 
                <br/>
                gaming experience.
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
                Explore our growing collection of
                games and build your digital library.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/games")
                }
                className="mt-8 rounded-xl bg-amber-500 px-8 py-3 font-bold text-black transition hover:scale-105 hover:bg-amber-400"
              >
                Explore All Games
              </button>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default LandingPage;