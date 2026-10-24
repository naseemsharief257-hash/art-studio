import { Link } from "react-router-dom";
import { useState } from "react";
import API_URL from "../services/api";

function AdminDashboard() {
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [bookings, setBookings] = useState([]);
    const [potteryRequests, setPotteryRequests] = useState([]);

    const [loadingBookings, setLoadingBookings] = useState(false);
    const [loadingPottery, setLoadingPottery] = useState(false);

    const token = localStorage.getItem("token");

    const fetchBookings = async () => {
        setLoadingBookings(true);
        setError("");

        try {
            const response = await fetch(
                `${API_URL}/wall-bookings/admin`,
                {
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

            setBookings(data);
        } catch (error) {
            setError("Failed to load wall bookings");
        } finally {
            setLoadingBookings(false);
        }
    };

    const fetchPotteryRequests = async () => {
        setLoadingPottery(true);
        setError("");

        try {
            const response = await fetch(
                `${API_URL}/pottery/admin`,
                {
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

            setPotteryRequests(data);
        } catch (error) {
            setError("Failed to load pottery requests");
        } finally {
            setLoadingPottery(false);
        }
    };

    const updateBooking = async (id, action) => {
        setMessage("");
        setError("");

        try {
            const response = await fetch(
                `${API_URL}/wall-bookings/${id}/${action}`,
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

            setMessage(
                action === "confirm"
                    ? "Booking confirmed successfully!"
                    : "Booking declined successfully!"
            );

            fetchBookings();
        } catch (error) {
            setError("Failed to update booking");
        }
    };

    const updatePottery = async (id, action) => {
        setMessage("");
        setError("");

        try {
            const response = await fetch(
                `${API_URL}/pottery/${id}/${action}`,
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

            setMessage(
                action === "accept"
                    ? "Pottery request accepted successfully!"
                    : "Pottery request declined successfully!"
            );

            fetchPotteryRequests();
        } catch (error) {
            setError("Failed to update pottery request");
        }
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>

            <p>
                <Link to="/admin">
                    Dashboard
                </Link>
                {" | "}
                <Link to="/admin/paintings">
                    Manage Paintings
                </Link>
            </p>

            {message && <p>{message}</p>}
            {error && <p>{error}</p>}

            <hr />

            <h2>Wall Painting Bookings</h2>

            <button onClick={fetchBookings}>
                Load Wall Bookings
            </button>

            {loadingBookings && (
                <p>Loading wall bookings...</p>
            )}

            {!loadingBookings && bookings.length === 0 && (
                <p>No wall bookings found.</p>
            )}

            {bookings.map((booking) => (
                <div key={booking._id}>
                    <p>
                        Customer: {booking.customer?.name}
                    </p>

                    <p>
                        Email: {booking.customer?.email}
                    </p>

                    <p>
                        Date:{" "}
                        {new Date(
                            booking.date
                        ).toLocaleDateString()}
                    </p>

                    <p>
                        Wall Size: {booking.wallSize} sq ft
                    </p>

                    <p>
                        Price: ₹{booking.price}
                    </p>

                    <p>
                        Address: {booking.address}
                    </p>

                    <p>
                        Status: {booking.status}
                    </p>

                    {booking.status === "requested" && (
                        <>
                            <button
                                onClick={() =>
                                    updateBooking(
                                        booking._id,
                                        "confirm"
                                    )
                                }
                            >
                                Confirm
                            </button>

                            <button
                                onClick={() =>
                                    updateBooking(
                                        booking._id,
                                        "decline"
                                    )
                                }
                            >
                                Decline
                            </button>
                        </>
                    )}

                    <hr />
                </div>
            ))}

            <h2>Pottery Requests</h2>

            <button onClick={fetchPotteryRequests}>
                Load Pottery Requests
            </button>

            {loadingPottery && (
                <p>Loading pottery requests...</p>
            )}

            {!loadingPottery && potteryRequests.length === 0 && (
                <p>No pottery requests found.</p>
            )}

            {potteryRequests.map((request) => (
                <div key={request._id}>
                    <p>
                        Customer: {request.customer?.name}
                    </p>

                    <p>
                        Email: {request.customer?.email}
                    </p>

                    <p>
                        Item: {request.item}
                    </p>

                    <p>
                        Glaze: {request.glaze}
                    </p>

                    <p>
                        Quantity: {request.quantity}
                    </p>

                    <p>
                        Needed By:{" "}
                        {new Date(
                            request.neededBy
                        ).toLocaleDateString()}
                    </p>

                    <p>
                        Status: {request.status}
                    </p>

                    {request.status === "requested" && (
                        <>
                            <button
                                onClick={() =>
                                    updatePottery(
                                        request._id,
                                        "accept"
                                    )
                                }
                            >
                                Accept
                            </button>

                            <button
                                onClick={() =>
                                    updatePottery(
                                        request._id,
                                        "decline"
                                    )
                                }
                            >
                                Decline
                            </button>
                        </>
                    )}

                    <hr />
                </div>
            ))}
        </div>
    );
}

export default AdminDashboard;