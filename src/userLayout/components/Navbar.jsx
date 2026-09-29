import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';

function Navbar() {
  const dispatch = useDispatch();

  const user = useSelector(
    (state) => state.auth.user
  );

  const handleLogout = () => {
    dispatch(logout())
  }
  return (
    <nav className='flex justify-between m-4 p-4 border-b'>

      <Link to="/">
        <h1>LOOT-NATION</h1>
      </Link>

        

        <Link to ="/">
          <h3 className='text-amber-600'>Home</h3>
        </Link>


        <input type="text"
        placeholder='Search Games'
        />

        <Link to="/wishlist">
        Wishlist
        </Link>

        <Link to="/cart">
          Cart
        </Link>
        

        <button onClick={handleLogout}>
          Logout
        </button>
        
    </nav>
  )
}

export default Navbar