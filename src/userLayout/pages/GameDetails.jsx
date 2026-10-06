import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

import { getGameById } from "../api/gameApi";
import { addCartItem, updateCartItem, getCartItems } from "../api/cartApi";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/cartSlice";

function GameDetails() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const [selectedImage, setSelectedImage] = useState(0);
  const [buying, setBuying] = useState(false);
  const [adding, setAdding] = useState(false);

  const {
    data: game,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["game", id],
    queryFn: () => getGameById(id),
  });

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setAdding(true);

      // Get the user's current cart from JSON Server
      const cartItems = await getCartItems(user.id);

      // Check whether this game already exists in the cart
      const existingItem = cartItems.find(
        (item) => String(item.gameId) === String(game.id),
      );

      let savedItem;

      if (existingItem) {
        // Game exists: increase quantity
        savedItem = await updateCartItem(
          existingItem.id,
          existingItem.quantity + 1,
        );
      } else {
        // Game doesn't exist: create a new cart record
        savedItem = await addCartItem({
          userId: user.id,
          gameId: game.id,
          quantity: 1,
        });
      }

      // Update Redux with the database cart record
      dispatch(addToCart(savedItem));
      await queryClient.invalidateQueries({
        queryKey: ["cart", user.id],
      })
    } catch (error) {
      console.error("Failed to add game to cart:", error);
    } finally {
      setAdding(false);
    }
  };

  //BUY Now

  const handleBuyNow = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setBuying(true);

      console.log("Buying Game: ", game);
      alert(`Purchase successful! \n\n${game.title}`);
    } catch (error) {
      console.error("Purchase failed: ", error);
    } finally {
      setBuying(false);
    }
  };

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <h2>Failed to load details</h2>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 text-white">
      <div className="relative grid max-h-[90vh] w-full max-w-6xl grid-cols-1 gap-8 overflow-y-auto scrollbar-none rounded-2xl bg-zinc-900 p-8 lg:grid-cols-2">
        <button
          onClick={() => navigate(-1)}
          className="absolute right-5 top-5 z-50 cursor-pointer"
        >
          <X size={28} />
        </button>
        <div>
          <div className="">
            <img
              src={game.image[selectedImage]}
              alt={game.title}
              className="mt-6 h-120 w-80 rounded-xl object-cover"
            />
          </div>

          <div className="mt-4 flex gap-4">
            {game.image.map((image, index) => (
              <button
                key={image}
                onClick={() => setSelectedImage(index)}
                className={`overflow-hidden rounded-lg border-2 ${
                  selectedImage === index
                    ? "border-white"
                    : "border-transparent"
                }`}
              >
                <img
                  src={image}
                  alt={`${game.title} ${index + 1}`}
                  className="h-20 w-32 object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-2xl bg-zinc-900 p-8">
          <h1 className="mt-6 text-3xl font-bold">{game.title}</h1>

          <div className="mt-4 flex gap-3 text-gray-400">
            <p className="mt-4 text-gray-500">{game.category}</p>
          </div>

          <p className="mt-6 leading-7 text-gray-300">{game.description}</p>

          <p className="mt-8 text-3xl font-bold">${game.price}</p>

          <div className="mt-8 flex gap-4">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={adding}
              className="flex-1 rounded-lg bg-amber-500 px-6 py-3 font-semibold text-black transition hover:bg-amber-400"
            >
              {adding ? "Adding..." : "Add to Cart"}
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={buying}
              className="flex-1 rounded-lg border border-amber-500 px-6 py-3 font-semibold text-amber-500 transition hover:bg-amber-500 hover:text-black"
            >
              {buying ? "Processing" : "Buy Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameDetails;
