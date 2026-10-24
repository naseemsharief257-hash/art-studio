import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerDashboard from "./pages/CustomerDashboard";
import Paintings from "./pages/Paintings";
import MyOrders from "./pages/MyOrders";
import WallPainting from "./pages/WallPainting";
import Pottery from "./pages/Pottery";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPaintings from "./pages/AdminPaintings";

function ProtectedRoute({ children, role }) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (role && user.role !== role) {
        return (
            <Navigate
                to={user.role === "admin" ? "/admin" : "/customer"}
                replace
            />
        );
    }

    return children;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/customer"
                    element={
                        <ProtectedRoute role="customer">
                            <CustomerDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/paintings"
                    element={
                        <ProtectedRoute>
                            <Paintings />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/orders"
                    element={
                        <ProtectedRoute role="customer">
                            <MyOrders />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/wall-painting"
                    element={
                        <ProtectedRoute role="customer">
                            <WallPainting />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/pottery"
                    element={
                        <ProtectedRoute role="customer">
                            <Pottery />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute role="admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/paintings"
                    element={
                        <ProtectedRoute role="admin">
                            <AdminPaintings />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/"
                    element={
                        <Navigate to="/login" replace />
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;