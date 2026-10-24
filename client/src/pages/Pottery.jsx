import { useEffect, useState } from "react";
import API_URL from "../services/api";

function Pottery() {
    const [item, setItem] = useState("Kulhad");
    const [glaze, setGlaze] = useState("Kumkum Red");
    const [quantity, setQuantity] = useState(1);
    const [neededBy, setNeededBy] = useState("");

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [editingId, setEditingId] = useState(null);

    const items = [
        "Kulhad",
        "Surahi",
        "Matka",
        "Diya set",
        "Gamla"
    ];

    const glazes = [
        "Kumkum Red",
        "Haldi Yellow",
        "Mehendi Green",
        "Indigo Blue",
        "Sandalwood Beige",
        "Charcoal Black"
    ];

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/pottery`,
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

            setRequests(data);
        } catch (error) {
            setError("Failed to load pottery requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const createOrUpdateRequest = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            const token = localStorage.getItem("token");

            const url = editingId
                ? `${API_URL}/pottery/${editingId}`
                : `${API_URL}/pottery`;

            const method = editingId ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    item,
                    glaze,
                    quantity: Number(quantity),
                    neededBy
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message);
                return;
            }

            setMessage(
                editingId
                    ? "Pottery request updated successfully!"
                    : "Pottery request created successfully!"
            );

            clearForm();
            fetchRequests();

        } catch (error) {
            setError("Failed to save pottery request");
        }
    };

    const startEditing = (request) => {
        setEditingId(request._id);
        setItem(request.item);
        setGlaze(request.glaze);
        setQuantity(request.quantity);

        const date = new Date(request.neededBy)
            .toISOString()
            .split("T")[0];

        setNeededBy(date);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const clearForm = () => {
        setEditingId(null);
        setItem("Kulhad");
        setGlaze("Kumkum Red");
        setQuantity(1);
        setNeededBy("");
    };

    const cancelRequest = async (id) => {
        setMessage("");
        setError("");

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/pottery/${id}/cancel`,
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

            setMessage("Pottery request cancelled successfully!");

            fetchRequests();

        } catch (error) {
            setError("Failed to cancel pottery request");
        }
    };

    if (loading) {
        return <p>Loading pottery requests...</p>;
    }

    return (
        <div>
            <h1>Custom Pottery</h1>

            <h2>
                {editingId
                    ? "Edit Pottery Request"
                    : "Create Pottery Request"}
            </h2>

            <form onSubmit={createOrUpdateRequest}>

                <label>Pottery Item</label>
                <br />

                <select
                    value={item}
                    onChange={(e) => setItem(e.target.value)}
                >
                    {items.map((itemName) => (
                        <option
                            key={itemName}
                            value={itemName}
                        >
                            {itemName}
                        </option>
                    ))}
                </select>

                <br /><br />

                <label>Glaze</label>
                <br />

                <select
                    value={glaze}
                    onChange={(e) => setGlaze(e.target.value)}
                >
                    {glazes.map((glazeName) => (
                        <option
                            key={glazeName}
                            value={glazeName}
                        >
                            {glazeName}
                        </option>
                    ))}
                </select>

                <br /><br />

                <label>Quantity</label>
                <br />

                <input
                    type="number"
                    min="1"
                    max="12"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                />

                <br /><br />

                <label>Needed By</label>
                <br />

                <input
                    type="date"
                    value={neededBy}
                    onChange={(e) => setNeededBy(e.target.value)}
                    required
                />

                <br /><br />

                <button type="submit">
                    {editingId
                        ? "Update Request"
                        : "Submit Request"}
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

            {message && <p>{message}</p>}

            {error && <p>{error}</p>}

            <hr />

            <h2>My Pottery Requests</h2>

            {requests.length === 0 ? (
                <p>No pottery requests found.</p>
            ) : (
                requests.map((request) => (
                    <div key={request._id}>

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
                                        startEditing(request)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        cancelRequest(request._id)
                                    }
                                >
                                    Cancel Request
                                </button>
                            </>
                        )}

                        <hr />

                    </div>
                ))
            )}
        </div>
    );
}

export default Pottery;