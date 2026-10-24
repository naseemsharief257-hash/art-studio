import { useEffect, useState } from "react";
import API_URL from "../services/api";

function Paintings() {
    const [paintings, setPaintings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const fetchPaintings = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${API_URL}/paintings`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message);
                return;
            }

            setPaintings(data);
        } catch (error) {
            setError("Failed to load paintings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPaintings();
    }, []);

    const buyPainting = async (id) => {
        setMessage("");
        setError("");

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/paintings/${id}/buy`,
                {
                    method: "POST",
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

            setMessage("Painting purchased successfully!");

            fetchPaintings();
        } catch (error) {
            setError("Purchase failed");
        }
    };

    if (loading) {
        return <p>Loading paintings...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>Available Paintings</h1>

            {message && <p>{message}</p>}

            {paintings.length === 0 ? (
                <p>No paintings available.</p>
            ) : (
                paintings.map((painting) => (
                    <div key={painting._id}>
                        <h2>{painting.title}</h2>

                        <p>Artist: {painting.artist}</p>

                        <p>{painting.description}</p>

                        <p>Price: ₹{painting.price}</p>

                        <img
                            src={`/${painting.imageUrl}`}
                            alt={painting.title}
                            width="200"
                        />

                        <br />

                        <button
                            onClick={() => buyPainting(painting._id)}
                        >
                            Buy Painting
                        </button>

                        <hr />
                    </div>
                ))
            )}
        </div>
    );
}

export default Paintings;