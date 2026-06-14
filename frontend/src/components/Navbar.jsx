import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";

import "../styles/Navbar.css"

const Navbar = () => {


const navigate = useNavigate();

const { logout } = useAuth();

const handleLogout = () => {

    logout();

    navigate("/");
};

return (

    <nav className="navbar">

        <div className="navbar-logo">

            <Link to="/dashboard">
                Finova
            </Link>

        </div>

        <div className="navbar-links">

            <Link to="/dashboard">
                Dashboard
            </Link>

            <Link to="/transactions">
                Transactions
            </Link>

            <Link to="/accounts">
                Accounts
            </Link>

            <button
                className="logout-btn"
                onClick={handleLogout}
            >
                Logout
            </button>

        </div>

    </nav>
);


};

export default Navbar;
