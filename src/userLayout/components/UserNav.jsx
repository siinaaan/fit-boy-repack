import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

function UserNav(){
    return(
        <>
        <Navbar/>
        <Link to="/games">Games</Link>

        <main>
            <Outlet />
        </main>
        </>
    )
}

export default UserNav;