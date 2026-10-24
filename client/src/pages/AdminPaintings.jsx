import { useEffect, useState } from "react";
import API_URL from "../services/api";

function AdminPaintings() {
    const [paintings, setPaintings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const [editingId, setEditingId] = useState(null);

    const token = localStorage.getItem("token");

    const fetchPaintings = async () => {
        try {
            const response = await fetch(
                `${API_URL}/paintings/admin`,
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

    const clearForm = () => {
        setTitle("");
        setArtist("");
        setDescription("");
        setPrice("");
        setImageUrl("");
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            const url = editingId
                ? `${API_URL}/paintings/${editingId}`
                : `${API_URL}/paintings`;

            const method = editingId ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    artist,
                    description,
                    price: Number(price),
                    imageUrl
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message);
                return;
            }

            setMessage(
                editingId
                    ? "Painting updated successfully!"
                    : "Painting added successfully!"
            );

            clearForm();
            fetchPaintings();

        } catch (error) {
            setError("Failed to save painting");
        }
    };

    const startEditing = (painting) => {
        setEditingId(painting._id);
        setTitle(painting.title);
        setArtist(painting.artist);
        setDescription(painting.description);
        setPrice(painting.price);
        setImageUrl(painting.imageUrl);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    if (loading) {
        return <p>Loading paintings...</p>;
    }

    return (
        <div>
            <h1>Admin - Manage Paintings</h1>

            {message && <p>{message}</p>}
            {error && <p>{error}</p>}

            <h2>
                {editingId
                    ? "Edit Painting"
                    : "Add New Painting"}
            </h2>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <br /><br />

                <input
                    type="text"
                    placeholder="Artist"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    required
                />

                <br /><br />

                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) =>
                        setDescription(e.target.value)
                    }
                    required
                />

                <br /><br />

                <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />

                <br /><br />

                <input
                    type="text"
                    placeholder="Image URL"
                    value={imageUrl}
                    onChange={(e) =>
                        setImageUrl(e.target.value)
                    }
                    required
                />

                <br /><br />

                <button type="submit">
                    {editingId
                        ? "Update Painting"
                        : "Add Painting"}
                </button>

                {editingId && (
                    <button
                        type="button"
                        onClick={clearForm}
                    >
                        Cancel Edit
                    </button>
                )}

            </form>

            <hr />

            <h2>All Paintings</h2>

            {paintings.length === 0 ? (
                <p>No paintings found.</p>
            ) : (
                paintings.map((painting) => (
                    <div key={painting._id}>

                        <h3>{painting.title}</h3>

                        <p>
                            Artist: {painting.artist}
                        </p>

                        <p>
                            Price: ₹{painting.price}
                        </p>

                        <p>
                            Status:{" "}
                            {painting.available
                                ? "Available"
                                : "Sold"}
                        </p>

                        {painting.available && (
                            <button
                                onClick={() =>
                                    startEditing(painting)
                                }
                            >
                                Edit
                            </button>
                        )}

                        <hr />

                    </div>
                ))
            )}
        </div>
    );
}

export default AdminPaintings;