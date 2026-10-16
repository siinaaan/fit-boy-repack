import React from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
import CartLoader from '../components/cartLoader'
import BackNavigationGuard from '../components/BackNavigationGuard'
import WishlistLoader from '../components/WishlistLoader'

function Home() {
  return (
    <div>
      <BackNavigationGuard />
      <CartLoader />
      <WishlistLoader />
      <Navbar/>

      <main className='pt-20 sm:pt-24'>
        <Outlet/>
      </main>
    </div>
  )
}

export default Home