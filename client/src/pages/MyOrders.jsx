import { useEffect, useState } from "react";
import API_URL from "../services/api";

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${API_URL}/orders`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message);
                return;
            }

            setOrders(data);
        } catch (error) {
            setError("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const cancelOrder = async (id) => {
        setMessage("");
        setError("");

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/orders/${id}/cancel`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message);
                return;
            }

            setMessage("Order cancelled successfully!");

            fetchOrders();
        } catch (error) {
            setError("Failed to cancel order");
        }
    };

    if (loading) {
        return <p>Loading orders...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>My Orders</h1>

            {message && <p>{message}</p>}

            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                orders.map((order) => (
                    <div key={order._id}>
                        <h2>{order.painting?.title}</h2>

                        <p>
                            Price: ₹{order.painting?.price}
                        </p>

                        <p>
                            Status: {order.status}
                        </p>

                        {order.status === "placed" && (
                            <button
                                onClick={() => cancelOrder(order._id)}
                            >
                                Cancel Order
                            </button>
                        )}

                        <hr />
                    </div>
                ))
            )}
        </div>
    );
}

export default MyOrders;