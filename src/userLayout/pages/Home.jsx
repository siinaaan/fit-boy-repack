import React from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
import CartLoader from '../components/cartLoader'

import WishlistLoader from '../components/WishlistLoader'

function Home() {
  return (
    <div>
      <CartLoader />
      <WishlistLoader />
      <Navbar/>

      <main >
        <Outlet/>
      </main>
    </div>
  )
}

export default Home