import { useEffect, useState } from "react";
import API_URL from "../services/api";

function WallPainting() {
    const [date, setDate] = useState("");
    const [wallSize, setWallSize] = useState("");
    const [address, setAddress] = useState("");

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const price = wallSize ? Number(wallSize) * 150 : 0;

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/wall-bookings`,
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
            setError("Failed to load bookings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const createBooking = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/wall-bookings`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        date,
                        wallSize: Number(wallSize),
                        address
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message);
                return;
            }

            setMessage(
                "Wall painting booking requested successfully!"
            );

            setDate("");
            setWallSize("");
            setAddress("");

            fetchBookings();

        } catch (error) {
            setError("Failed to create booking");
        }
    };

    const cancelBooking = async (id) => {
        setMessage("");
        setError("");

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/wall-bookings/${id}/cancel`,
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
                "Wall booking cancelled successfully!"
            );

            fetchBookings();

        } catch (error) {
            setError("Failed to cancel booking");
        }
    };

    const canCancelBooking = (booking) => {
        if (booking.status === "cancelled") {
            return false;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const bookingDate = new Date(booking.date);
        bookingDate.setHours(0, 0, 0, 0);

        const differenceInTime = bookingDate - today;
        const differenceInDays =
            differenceInTime / (1000 * 60 * 60 * 24);

        return differenceInDays >= 3;
    };

    if (loading) {
        return <p>Loading wall bookings...</p>;
    }

    return (
        <div>
            <h1>Wall Painting</h1>

            <h2>Book a Wall Painting</h2>

            <form onSubmit={createBooking}>

                <label>Painting Date</label>
                <br />

                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />

                <br /><br />

                <label>Wall Size (sq ft)</label>
                <br />

                <input
                    type="number"
                    min="10"
                    max="500"
                    value={wallSize}
                    onChange={(e) => setWallSize(e.target.value)}
                    required
                />

                <br /><br />

                <p>Price: ₹{price}</p>

                <label>Address</label>
                <br />

                <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                />

                <br /><br />

                <button type="submit">
                    Request Booking
                </button>

            </form>

            {message && <p>{message}</p>}

            {error && <p>{error}</p>}

            <hr />

            <h2>My Wall Bookings</h2>

            {bookings.length === 0 ? (
                <p>No wall bookings found.</p>
            ) : (
                bookings.map((booking) => (
                    <div key={booking._id}>

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

                        {canCancelBooking(booking) && (
                            <button
                                onClick={() =>
                                    cancelBooking(booking._id)
                                }
                            >
                                Cancel Booking
                            </button>
                        )}

                        <hr />

                    </div>
                ))
            )}
        </div>
    );
}

export default WallPainting;