import React, { useEffect, useState } from "react";
import fitboy from "../assets/FitBoy.png";
import { useQuery } from "@tanstack/react-query";
import { getGames } from "../api/gameApi";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate, Link, useSearchParams } from "react-router-dom";

import toast from "react-hot-toast";

import { logout } from "../features/authSlice";
import { X } from "lucide-react";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");

  const [showSuggestions, setShowSuggestions] = useState(false);

  const { data: games = [] } = useQuery({
    queryKey: ["games"],
    queryFn: getGames,
  });

  const filteredGames = games
    .filter((game) =>
      game.title?.toLowerCase().includes(search.trim().toLowerCase()),
    )
    .slice(0, 6);

  const user = useSelector((state) => state.auth.user);

  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  const cartCount = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0,
  );

  const handleLogout = () => {
    dispatch(logout());

    toast.success("Logged out successfully!");
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const searchValue = search.trim();

    setShowSuggestions(false);

    if (!searchValue) {
      navigate("/games");
      return;
    }

    navigate(`/games?search=${encodeURIComponent(searchValue)}`);
  };

  return (
    <nav
      className="
        sticky
        top-0
        z-50
        w-full
        border-b
        border-emerald-500/20
        bg-[#050b12]/95
        backdrop-blur-xl
        shadow-[0_4px_25px_rgba(16,185,129,0.05)]
      "
    >
      <div
        className="
          flex
          h-24
          w-full
          items-center
          justify-between
          px-6
          lg:px-10
        "
      >
        <Link
          to="/"
          className="
            group
            flex
            min-w-fit
            items-center
            gap-3
          "
        >
          <img
            src={fitboy}
            alt="FitBoy Repacks"
            className="
              h-14
              w-14
              rounded-lg
              object-cover
              ring-1
              ring-emerald-400/30
              transition-all
              duration-300
              group-hover:ring-emerald-400
              group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]
            "
          />

          <div className="hidden sm:block">
            <h1
              className="
                text-lg
                font-black
                tracking-wide
                text-emerald-400
                drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]
              "
            >
              FitBoy Repacks
            </h1>

            <p className="text-xs text-slate-500">Gaming Universe</p>
          </div>
        </Link>

        <Link
          to="/"
          className="
            group
            relative
            px-3
            py-2
            text-sm
            font-medium
            text-emerald-400
            transition-all
            duration-300
            hover:text-emerald-300
          "
        >
          Home
          <span
            className="
              absolute
              bottom-0
              left-1/2
              h-[2px]
              w-0
              -translate-x-1/2
              bg-emerald-400
              shadow-[0_0_8px_rgba(16,185,129,0.8)]
              transition-all
              duration-300
              group-hover:w-full
            "
          />
        </Link>

        <div className="relative hidden w-full max-w-md md:block">
          <form
            onSubmit={handleSearch}
            className="flex overflow-hidden rounded-lg border border-emerald-500/20 bg-[#07111a] transition-all focus-within:border-emerald-400 focus-within:shadow-[0_0_20px_rgba(16,185,129,0.15)]"
          >
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => {
                setTimeout(() => setShowSuggestions(false), 150);
              }}
              placeholder="Search games..."
              autoComplete="off"
              className="w-full min-w-0 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
            />

            {search &&(
              <button 
              type="button"
              aria-label="Clear search"
              onClick={()=>{
                setSearch("");
                setShowSuggestions(false);
                navigate("/games");
              }}
              className="px-3 text-lg text-slate-400 transition hover:text-red-400">
                <X size={18} className="text-slate-400" />
              </button>
            )}

            <button
              type="submit"
              className="bg-emerald-500 px-6 font-semibold text-black transition-all hover:bg-emerald-400"
            >
              Search
            </button>
          </form>

          {showSuggestions && search.trim() && (
            <div className="absolute left-0 right-0 top-full z-[100] mt-2 overflow-hidden rounded-xl border border-emerald-500/20 bg-[#07111a] shadow-xl">
              {filteredGames.length > 0 ? (
                filteredGames.map((game) => (
                  <button
                    key={game.id}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setShowSuggestions(false);
                      setSearch("");
                      navigate(`/games/${game.id}`);
                    }}
                    className="flex w-full items-center gap-3 p-3 text-left transition hover:bg-emerald-500/10"
                  >
                    <img
                      src={game.image?.[0]}
                      alt=""
                      className="h-12 w-10 rounded object-cover"
                    />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {game.title}
                      </p>
                      <p className="text-xs text-slate-400">{game.category}</p>
                    </div>
                  </button>
                ))
              ) : (
                <p className="p-4 text-sm text-slate-400">No games found.</p>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => navigate("/games")}
          className="
            group
            relative
            px-3
            py-2
            text-sm
            font-medium
            text-slate-300
            transition-all
            duration-300
            hover:text-emerald-400
          "
        >
          Games
          <span
            className="
              absolute
              bottom-0
              left-1/2
              h-[2px]
              w-0
              -translate-x-1/2
              bg-emerald-400
              shadow-[0_0_8px_rgba(16,185,129,0.8)]
              transition-all
              duration-300
              group-hover:w-full
            "
          />
        </button>

        <Link
          to="/library"
          className="
            group
            relative
            px-3
            py-2
            text-sm
            font-medium
            text-slate-300
            transition-all
            duration-300
            hover:text-emerald-400
          "
        >
          Library
          <span
            className="
              absolute
              bottom-0
              left-1/2
              h-[2px]
              w-0
              -translate-x-1/2
              bg-emerald-400
              shadow-[0_0_8px_rgba(16,185,129,0.8)]
              transition-all
              duration-300
              group-hover:w-full
            "
          />
        </Link>

        <Link
          to="/wishlist"
          className="
            group
            relative
            px-3
            py-2
            text-sm
            font-medium
            text-slate-300
            transition-all
            duration-300
            hover:text-emerald-400
          "
        >
          Wishlist
          <span
            className="
              absolute
              bottom-0
              left-1/2
              h-[2px]
              w-0
              -translate-x-1/2
              bg-emerald-400
              shadow-[0_0_8px_rgba(16,185,129,0.8)]
              transition-all
              duration-300
              group-hover:w-full
            "
          />
        </Link>

        <Link
          to="/cart"
          className="
            group
            flex
            items-center
            gap-2
            px-3
            py-2
            text-sm
            font-medium
            text-slate-300
            transition-all
            duration-300
            hover:text-emerald-400
          "
        >
          Cart
          <span
            className="
              flex
              h-5
              min-w-5
              items-center
              justify-center
              rounded-full
              bg-emerald-500
              px-1.5
              text-xs
              font-bold
              text-black
              transition-all
              duration-300
              group-hover:shadow-[0_0_12px_rgba(16,185,129,0.7)]
            "
          >
            {cartCount}
          </span>
        </Link>

        {user ? (
          <button
            type="button"
            onClick={handleLogout}
            className="
              rounded-lg
              border
              border-emerald-500/20
              px-4
              py-2
              text-sm
              font-medium
              text-slate-300
              transition-all
              duration-300
              hover:border-emerald-400/50
              hover:bg-emerald-500/10
              hover:text-emerald-400
              hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]
            "
          >
            Logout
          </button>
        ) : (
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="
              rounded-lg
              border
              border-emerald-500/20
              px-4
              py-2
              text-sm
              font-medium
              text-emerald-400
              transition-all
              duration-300
              hover:border-emerald-400
              hover:bg-emerald-500/10
              hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]
            "
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
