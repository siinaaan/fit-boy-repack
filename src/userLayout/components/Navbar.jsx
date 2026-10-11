import React, { useEffect, useState } from "react";
import fitboy from "../assets/FitBoy.png";
import { useQuery } from "@tanstack/react-query";
import { getGames } from "../api/gameApi";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate, Link, useSearchParams } from "react-router-dom";

import toast from "react-hot-toast";

import { logout } from "../features/authSlice";
import { X, Menu, Search, ShoppingCart, Heart, Package, Gamepad2 } from "lucide-react";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


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

  const wishlistItems = useSelector((state) => state.wishlist.items)

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
          flex-nowrap
          h-20
          sm:h-24
          w-full
          items-center
          justify-between
          gap-2
          sm:gap-4
          lg:gap-6
          px-3
          sm:px-6
          lg:px-10
        "
      >
        <Link
          to="/"
          onClick={() => setIsMobileMenuOpen(false)}
          className="
            group
            flex
            shrink-0
            items-center
            gap-2
            sm:gap-3
          "
        >
          <img
            src={fitboy}
            alt="FitBoy Repacks"
            className="
              h-9
              w-9
              min-[400px]:h-10
              min-[400px]:w-10
              sm:h-14
              sm:w-14
              shrink-0
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

          <div className="hidden min-[360px]:block min-w-0">
            <h1
              className="
                text-xs
                min-[480px]:text-sm
                sm:text-lg
                font-black
                tracking-wide
                text-emerald-400
                drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]
                whitespace-nowrap
              "
            >
              <span>FitBoy</span>
              <span className="hidden min-[480px]:inline"> Repacks</span>
            </h1>

            <p className="text-[10px] sm:text-xs text-slate-500 hidden md:block">
              Gaming Universe
            </p>
          </div>
        </Link>

        <Link
          to="/"
          className="
            group
            relative
            hidden
            lg:block
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

        {/* SEARCH BAR (RESPONSIVE: VISIBLE ON ALL BREAKPOINTS) */}
        <div className="relative flex-1 min-w-0 max-w-md lg:w-full">
          <form
            onSubmit={handleSearch}
            className="flex items-center overflow-hidden rounded-lg border border-emerald-500/20 bg-[#07111a] transition-all focus-within:border-emerald-400 focus-within:shadow-[0_0_20px_rgba(16,185,129,0.15)]"
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
                setTimeout(() => setShowSuggestions(false), 200);
              }}
              placeholder="Search games..."
              autoComplete="off"
              className="w-full min-w-0 bg-transparent px-2.5 py-1.5 sm:px-4 sm:py-2.5 lg:py-3 text-xs sm:text-sm text-white outline-none placeholder:text-slate-500"
            />

            {search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  setSearch("");
                  setShowSuggestions(false);
                  navigate("/games");
                }}
                className="shrink-0 px-1.5 sm:px-3 text-slate-400 transition hover:text-red-400"
              >
                <X
                  size={16}
                  className="sm:w-[18px] sm:h-[18px] text-slate-400"
                />
              </button>
            )}

            <button
              type="submit"
              aria-label="Search"
              className="shrink-0 bg-emerald-500 px-2.5 sm:px-5 lg:px-6 py-1.5 sm:py-2.5 lg:py-3 font-semibold text-black transition-all hover:bg-emerald-400 flex items-center justify-center"
            >
              <Search size={15} className="sm:hidden" />
              <span className="hidden sm:inline text-xs sm:text-sm">
                Search
              </span>
            </button>
          </form>

          {showSuggestions && search.trim() && (
            <div className="absolute left-0 right-0 top-full z-[100] mt-2 max-h-60 sm:max-h-80 overflow-y-auto rounded-xl border border-emerald-500/20 bg-[#07111a] shadow-xl">
              {filteredGames.length > 0 ? (
                filteredGames.map((game) => (
                  <button
                    key={game.id}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setShowSuggestions(false);
                      setSearch("");
                      setIsMobileMenuOpen(false);
                      navigate(`/games/${game.id}`);
                    }}
                    className="flex w-full items-center gap-2 sm:gap-3 p-2 sm:p-3 text-left transition hover:bg-emerald-500/10"
                  >
                    <img
                      src={game.image?.[0]}
                      alt=""
                      className="h-10 w-8 sm:h-12 sm:w-10 rounded object-cover shrink-0"
                    />

                    <div className="min-w-0">
                      <p className="truncate text-xs sm:text-sm font-medium text-white">
                        {game.title}
                      </p>
                      <p className="text-[10px] sm:text-xs text-slate-400">
                        {game.category}
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <p className="p-3 sm:p-4 text-xs sm:text-sm text-slate-400">
                  No games found.
                </p>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => navigate("/games")}
          className="group relative hidden lg:flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-300 transition-all duration-300 hover:text-emerald-400"
        >
          <Gamepad2 size={18} />
          <span>Games</span>

          </button>

        <Link
          to="/orders"
          aria-label="My Orders"
          title="My Orders"
          className="group relative hidden lg:flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-300 transition-all duration-300 hover:text-emerald-400"
        >
          <Package size={18} />
          <span>My Orders</span>
        </Link>

        <Link
          to="/wishlist"
          className="group relative hidden lg:flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-300 transition-all duration-300 hover:text-emerald-400"
        >
          <Heart size={18} className="text-slate-300" />
          <span>Wishlist</span>

          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-emerald-500 px-1.5 text-xs font-bold text-black">
            {wishlistItems.length}
          </span>
        </Link>

        <Link
          to="/cart"
          className="group hidden lg:flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-300 transition-all duration-300 hover:text-emerald-400"
        >
          <ShoppingCart size={18} className="text-slate-300" />
          <span>Cart</span>

          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1.5 text-xs font-bold text-black transition-all duration-300 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.7)]">
            {cartCount}
          </span>
        </Link>

        {user ? (
          <button
            type="button"
            onClick={handleLogout}
            className="hidden lg:block rounded-lg border border-emerald-500/20 px-4 py-2 text-sm font-medium text-slate-300 transition-all duration-300 hover:border-emerald-400/50 hover:bg-emerald-500/10 hover:text-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]"
          >
            Logout
          </button>
        ) : (
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="hidden
              lg:block
              rounded-lg
              border
              border-emerald-500/20
              px-4
              py-2
              text-sm
              font-medium
              text-emerald-400
              transition-all
              duration-300 hover:border-emerald-400 hover:bg-emerald-500/10 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
          >
            Login
          </button>
        )}

        {/* MOBILE CONTROLS (CART + HAMBURGER) */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-2 lg:hidden">
          <Link
            to="/cart"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="View Cart"
            className="
              flex
              items-center
              gap-1
              sm:gap-1.5
              rounded-lg
              px-1.5
              sm:px-2.5
              py-1.5
              text-sm
              font-medium
              text-slate-300
              transition
              hover:text-emerald-400
            "
          >
            <ShoppingCart size={18} className="text-slate-300" />
            <span className="hidden min-[480px]:inline text-xs sm:text-sm">
              Cart
            </span>
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
              "
            >
              {cartCount}
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="
              rounded-lg
              border
              border-emerald-500/20
              p-1.5
              sm:p-2
              text-slate-300
              transition-all
              duration-300
              hover:border-emerald-400/50
              hover:bg-emerald-500/10
              hover:text-emerald-400
            "
          >
            {isMobileMenuOpen ? (
              <X size={20} className="sm:w-[22px] sm:h-[22px]" />
            ) : (
              <Menu size={20} className="sm:w-[22px] sm:h-[22px]" />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {isMobileMenuOpen && (
        <div className="border-t border-emerald-500/20 bg-[#07111a]/95 px-5 py-4 backdrop-blur-xl lg:hidden">
          {/* Mobile Links */}
          <div className="flex flex-col space-y-2">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-emerald-400 transition hover:bg-emerald-500/10"
            >
              Home
            </Link>

            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate("/games");
              }}
              className="rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-300 transition hover:bg-emerald-500/10 hover:text-emerald-400"
            >
              Games
            </button>

            <Link
              to="/orders"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-emerald-500/10 hover:text-emerald-400"
            >
              Orders
            </Link>

            <Link
              to="/wishlist"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-emerald-500/10 hover:text-emerald-400"
            >
              Wishlist
            </Link>

            <div className="pt-2 border-t border-emerald-500/10">
              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="
                    w-full
                    rounded-lg
                    border
                    border-emerald-500/20
                    px-4
                    py-2.5
                    text-center
                    text-sm
                    font-medium
                    text-slate-300
                    transition
                    hover:border-emerald-400/50
                    hover:bg-emerald-500/10
                    hover:text-emerald-400
                  "
                >
                  Logout
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate("/login");
                  }}
                  className="
                    w-full
                    rounded-lg
                    border
                    border-emerald-500/20
                    px-4
                    py-2.5
                    text-center
                    text-sm
                    font-medium
                    text-emerald-400
                    transition
                    hover:border-emerald-400
                    hover:bg-emerald-500/10
                  "
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
