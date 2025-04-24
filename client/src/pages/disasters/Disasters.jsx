import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "api/apiService";
import endpoints from "api/endpoints";
import { ROLES } from "constants/roles";
import { useAuth } from "context/AuthContext";

const Disasters = () => {
    const [disasters, setDisasters] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const isDistributor = user?.role === ROLES.DISTRIBUTOR;

    const fetchDisasters = async () => {
        try {
            const response = await api.get(endpoints.disasters.all);
            setDisasters(response.data);
        } catch (err) {
            setError("Failed to fetch disasters.");
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this disaster?")) return;
        try {
            await api.delete(endpoints.disasters.delete(id));
            setDisasters((prev) => prev.filter((d) => d.id !== id));
        } catch (err) {
            setError("Failed to delete disaster.");
            console.error(err);
        }
    };

    const handleNotify = async (userId, disasterId) => {
        try {
            setLoading(true);
            await api.post(endpoints.disasters.notify(userId, disasterId));
            await fetchDisasters();
        } catch (err) {
            setError("Failed to send notification.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDisasters();
    }, []);

    return (
        <div className="container py-5">
            <h2 className="mb-4">Disasters</h2>

            {!isDistributor && (
                <div className="d-flex justify-content-end mb-3">
                    <Link to="/dashboard/admin/disasters/create" className="btn btn-success">
                        Create Disaster
                    </Link>
                </div>
            )}

            {error && <div className="alert alert-danger">{error}</div>}

            <table className="table table-bordered table-hover">
                <thead className="table-light">
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Location</th>
                        <th>Type</th>
                        <th>Region</th>
                        <th>Severity</th>
                        <th>Notify Users</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {disasters.map((disaster) => (
                        <tr key={disaster.id}>
                            <td>{disaster.title}</td>
                            <td>{disaster.description}</td>
                            <td>{disaster.location}</td>
                            <td>{disaster.type}</td>
                            <td>{disaster.region}</td>
                            <td>
                                <span
                                    className={`badge ${disaster.severity === "low"
                                            ? "bg-success"
                                            : disaster.severity === "moderate"
                                                ? "bg-warning text-dark"
                                                : disaster.severity === "high"
                                                    ? "bg-danger"
                                                    : "bg-dark"
                                        }`}
                                >
                                    {disaster.severity.charAt(0).toUpperCase() + disaster.severity.slice(1)}
                                </span>
                            </td>
                            <td>{disaster.notify_users ? "Yes" : "No"}</td>
                            <td>
                                <div className="d-flex flex-column gap-2">
                                    {!isDistributor && (
                                        <>
                                            <Link
                                                to={`/dashboard/admin/disasters/update/${disaster.id}`}
                                                className="btn btn-sm btn-primary"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(disaster.id)}
                                                className="btn btn-sm btn-danger"
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                    {isDistributor && !disaster.notify_users && (
                                        <button
                                            className="btn btn-sm btn-warning"
                                            disabled={loading}
                                            onClick={() => handleNotify(user.id, disaster.id)}
                                        >
                                            {loading ? "Sending..." : "Notify Donors"}
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                    {disasters.length === 0 && (
                        <tr>
                            <td colSpan="8" className="text-center">
                                No disasters found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Disasters;
