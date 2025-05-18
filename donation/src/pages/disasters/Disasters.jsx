import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CSVLink } from "react-csv";
import api from "api/apiService";
import endpoints from "api/endpoints";
import { ROLES } from "constants/roles";
import { useAuth } from "context/AuthContext";

const Disasters = () => {
    const [disasters, setDisasters] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [notificationLoading, setNotificationLoading] = useState(false);
    const { user } = useAuth();

    const isDistributor = user?.role === ROLES.DISTRIBUTOR;
    const isAdmin = user?.role === ROLES.ADMIN;

    const fetchDisasters = async () => {
        setLoading(true);
        try {
            const response = await api.get(endpoints.disasters.all);
            setDisasters(response.data);
            setError("");
        } catch (err) {
            setError("Failed to fetch disasters.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this disaster?")) return;
        try {
            await api.delete(endpoints.disasters.delete(id));
            setDisasters((prev) => prev.filter((d) => d.id !== id));
            setError("");
        } catch (err) {
            setError("Failed to delete disaster.");
            console.error(err);
        }
    };

    const handleNotify = async (userId, disasterId) => {
        try {
            setNotificationLoading(true);
            await api.post(endpoints.disasters.notify(userId, disasterId));
            await fetchDisasters();
        } catch (err) {
            setError("Failed to send notification.");
            console.error(err);
        } finally {
            setNotificationLoading(false);
        }
    };

    useEffect(() => {
        fetchDisasters();
    }, []);

    const csvData = disasters.map(disaster => ({
        "Title": disaster.title,
        "Description": disaster.description,
        "Location": disaster.location,
        "Type": disaster.type,
        "Region": disaster.region,
        "Severity": disaster.severity.charAt(0).toUpperCase() + disaster.severity.slice(1),
        "Notification Sent": disaster.notify_users ? "Yes" : "No",
        "Created At": new Date(disaster.created_at).toLocaleString(),
        "Updated At": new Date(disaster.updated_at).toLocaleString(),
        "Status": disaster.status || "Active"
    }));

    return (
        <div className="container py-5">
            <h2 className="mb-4">Disasters</h2>

            <div className="d-flex justify-content-between mb-3">
                <div>
                    {isAdmin && (
                        <CSVLink 
                            data={csvData}
                            filename={`disasters_export_${new Date().toISOString().split('T')[0]}.csv`}
                            className="btn btn-info me-2"
                        >
                            Export to CSV
                        </CSVLink>
                    )}
                </div>
                <div>
                    {isAdmin && (
                        <Link to="/dashboard/admin/disasters/create" className="btn btn-success">
                            Create Disaster
                        </Link>
                    )}
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {loading && <div className="text-center">Loading disasters...</div>}

            <div className="table-responsive">
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
                                        {isAdmin && (
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
                                                disabled={notificationLoading}
                                                onClick={() => handleNotify(user.id, disaster.id)}
                                            >
                                                {notificationLoading ? "Sending..." : "Notify Donors"}
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {disasters.length === 0 && !loading && (
                            <tr>
                                <td colSpan="8" className="text-center">
                                    No disasters found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Disasters;