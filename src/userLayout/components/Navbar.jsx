import React, { useEffect, useState } from "react";
import fitboy from "../assets/FitBoy.png";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useNavigate,
  Link,
  useSearchParams,
} from "react-router-dom";

import toast from "react-hot-toast";

import { logout } from "../features/authSlice";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const user = useSelector(
    (state) => state.auth.user
  );

  const cartItems = useSelector(
    (state) => state.cart.items
  );

  // ============================================
  // SEARCH STATE
  // ============================================

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  // ============================================
  // KEEP SEARCH INPUT SYNCED WITH URL
  // ============================================

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  // ============================================
  // CART COUNT
  // ============================================

  const cartCount = cartItems.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  // ============================================
  // LOGOUT
  // ============================================

  const handleLogout = () => {
    dispatch(logout());

    toast.success(
      "Logged out successfully!"
    );
  };

  // ============================================
  // SEARCH
  // ============================================

  const handleSearch = (e) => {
    e.preventDefault();

    const searchValue = search.trim();

    // Empty search
    if (!searchValue) {
      navigate("/games");
      return;
    }

    // Navigate to Games with search query
    navigate(
      `/games?search=${encodeURIComponent(
        searchValue
      )}`
    );
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

      {/* ================================= */}
      {/* NAVBAR CONTAINER */}
      {/* ================================= */}

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

        {/* ================================= */}
        {/* LOGO */}
        {/* ================================= */}

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

            <p className="text-xs text-slate-500">
              Gaming Universe
            </p>

          </div>

        </Link>


        {/* ================================= */}
        {/* HOME */}
        {/* ================================= */}

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


        {/* ================================= */}
        {/* SEARCH */}
        {/* ================================= */}

        <form
          onSubmit={handleSearch}
          className="
            hidden
            w-full
            max-w-md
            overflow-hidden
            rounded-lg
            border
            border-emerald-500/20
            bg-[#07111a]
            transition-all
            duration-300
            focus-within:border-emerald-400
            focus-within:shadow-[0_0_20px_rgba(16,185,129,0.15)]
            md:flex
          "
        >

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search games..."
            className="
              w-full
              bg-transparent
              px-4
              py-3
              text-sm
              text-white
              outline-none
              placeholder:text-slate-500
            "
          />

          <button
            type="submit"
            className="
              bg-emerald-500
              px-6
              font-semibold
              text-black
              transition-all
              duration-300
              hover:bg-emerald-400
              hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]
            "
          >
            Search
          </button>

        </form>


        {/* ================================= */}
        {/* GAMES */}
        {/* ================================= */}

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


        {/* ================================= */}
        {/* LIBRARY */}
        {/* ================================= */}

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


        {/* ================================= */}
        {/* WISHLIST */}
        {/* ================================= */}

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


        {/* ================================= */}
        {/* CART */}
        {/* ================================= */}

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


        {/* ================================= */}
        {/* AUTH */}
        {/* ================================= */}

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