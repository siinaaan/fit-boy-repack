import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useState } from "react";

import { getGameById } from "../api/gameApi";

function GameDetails() {
  const { id } = useParams();

  const {
    data: game,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["game", id],
    queryFn: () => getGameById(id),
  });

  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <h2>Failed to load details</h2>;
  }

  return (
    <div className="min-h-screen bg-zinc-900 p-6 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <div className="">
            <img
              src={game.image[selectedImage]}
              alt={game.title}
              className="mt-6 h-150 max-w-full rounded-xl object-cover"
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
            <button className="flex-1 rounded-lg bg-amber-500 px-6 py-3 font-semibold text-black transition hover:bg-amber-400">
              Add to Cart
            </button>
            <button className="flex-1 rounded-lg border border-amber-500 px-6 py-3 font-semibold text-amber-500 transition hover:bg-amber-500 hover:text-black">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameDetails;
