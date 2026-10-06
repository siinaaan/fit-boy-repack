import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate,Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { logout } from '../features/authSlice';

function Navbar() {
  const dispatch = useDispatch();

  const user = useSelector(
    (state) => state.auth.user
  );

  const cartItems = useSelector(
    (state) => state.cart.items
  );

  const cartCount = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  )

  const handleLogout = () => {
    dispatch(logout())

    toast.success("Logged out successfully!")
  }
  const navigate = useNavigate()
  return (
    <nav className='flex  justify-between m-4 p-4 border-b'>

      <Link to="/">
        <h1>FitBoy Repacks</h1>
      </Link>

        

        <Link to ="/">
          <h3 className='text-amber-600'>Home</h3>
        </Link>


        <input type="text"
        placeholder='Search Games'
        />

        <button onClick={()=>navigate("/games")}>
          Games
        </button>
        <Link to="/wishlist">
        Wishlist
        </Link>

        <Link to="/cart">
          Cart ({cartCount})
        </Link>
        

        {user?(
          <button onClick={handleLogout}>
          Logout
        </button>
        ):(
          <button onClick={()=> navigate("/login")}>
            Login
          </button>
        )}
        
    </nav>
  )
}

export default Navbar