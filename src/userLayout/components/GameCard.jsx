import React from 'react'
import { Link } from 'react-router-dom'

function GameCard({game}) {
  return (
    <div>
        <Link to={`/games/${game.id}`}>
        <img src={game.image[0]} alt={game.title} 
        className='h-120 w-full object-cover'
        />
        </Link>

        
        <div className='p-4'>
        <Link to={`/games/${game.id}`}>
            <h2 className='text-xl font-bold'>
                {game.title}
            </h2>
        </Link>

            <p className='mt-1 text-sm text-gray-400'>
                {game.category}
            </p>
            <p className='mt-3 text-lg font-semibold'>
                ${game.price}
            </p>

            <button className='mt-4 w-full rounded-lg bg-[#8b0d1a] px-4 py-2 font-semibold text-black hover:bg-[#fb3640]'>
                Add to Cart
            </button>
        </div>
    </div>
  )
}

export default GameCard