import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API_URL from "../services/api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const registrationMessage = location.state?.message;

    const handleLogin = async (e) => {
        e.preventDefault();

        setMessage("");

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message);
                return;
            }

            login(data.user, data.token);

            if (data.user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/customer");
            }

        } catch (error) {
            setMessage("Server connection failed");
        }
    };

    return (
        <div>
            <h2>Login</h2>

            {registrationMessage && (
                <p>{registrationMessage}</p>
            )}

            <form onSubmit={handleLogin}>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <br /><br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <br /><br />

                <button type="submit">
                    Login
                </button>

            </form>

            {message && <p>{message}</p>}

            <p>
                Don't have an account?{" "}
                <Link to="/register">Register</Link>
            </p>
        </div>
    );
}

export default Login;