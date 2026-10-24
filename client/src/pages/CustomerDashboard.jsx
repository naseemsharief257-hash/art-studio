import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function CustomerDashboard() {
    const { user, logout } = useAuth();

    return (
        <div>
            <h1>Art Studio</h1>

            <h2>Welcome, {user?.name}!</h2>

            <p>Role: {user?.role}</p>

            <button onClick={logout}>
                Logout
            </button>

            <hr />

            <h3>Customer Dashboard</h3>

            <p>
                <Link to="/paintings">
                    Paintings
                </Link>
            </p>

            <p>
                <Link to="/orders">
                    My Orders
                </Link>
            </p>

            <p>
                <Link to="/wall-painting">
                    Wall Painting
                </Link>
            </p>

            <p>
                <Link to="/pottery">
                    Custom Pottery
                </Link>
            </p>
        </div>
    );
}

export default CustomerDashboard;