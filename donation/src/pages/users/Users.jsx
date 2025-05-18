import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CSVLink } from "react-csv";
import api from "api/apiService";
import endpoints from "api/endpoints";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(endpoints.users.all);
            setUsers(response.data);
        } catch (err) {
            setError("Failed to fetch users.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            await api.delete(endpoints.users.delete(id));
            setUsers((prev) => prev.filter((user) => user.id !== id));
        } catch (err) {
            setError("Failed to delete user.");
            console.error(err);
        }
    };

    const handleVerify = async (id) => {
        try {
            const res = await api.put(endpoints.users.approve(id));
            const updatedUser = res.data;
        
            setUsers((prev) =>
              prev.map((user) =>
                user.id === id ? { ...user, is_verified: updatedUser.is_verified } : user
              )
            );
            setError("");
        } catch (err) {
            setError("Failed to approve User.");
            console.error(err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Prepare CSV data
    const csvData = users.map(user => ({
        "Full Name": user.full_name,
        "Email": user.email,
        "Phone": user.phone_number,
        "Address": user.address,
        "Role": user.role,
        "Verified": user.is_verified ? "Yes" : "No",
        "Profile Image": user.profile_image ? `http://localhost:5000/uploads/${user.profile_image}` : 'None',
        "Created At": new Date(user.created_at).toLocaleString(),
        "Updated At": new Date(user.updated_at).toLocaleString()
    }));

    return (
        <div className="container py-5">
            <h2 className="mb-4">Users</h2>
            <div className="d-flex justify-content-between mb-3">
                <div>
                    <CSVLink 
                        data={csvData}
                        filename={"users_export.csv"}
                        className="btn btn-info me-2"
                    >
                        Export to CSV
                    </CSVLink>
                </div>
                <div>
                    <Link to="/dashboard/admin/users/create" className="btn btn-success">
                        Create New User
                    </Link>
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {isLoading && <div className="text-center">Loading users...</div>}

            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead className="table-light">
                        <tr>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Profile Image</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Role</th>
                            <th>Is Verified</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.full_name}</td>
                                <td>{user.email}</td>
                                <td className="d-flex align-items-center justify-content-center">
                                    <img
                                        src={user.profile_image ? `http://localhost:5000/uploads/${user.profile_image}` : "/path/to/default-image.jpg"}
                                        alt={`${user.full_name}'s profile`}
                                        className="img-thumbnail"
                                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                    />
                                </td>
                                <td>{user.phone_number}</td>
                                <td>{user.address}</td>
                                <td>{user.role}</td>
                                <td>
                                    <span className={`badge ${user.is_verified ? "bg-success" : "bg-danger"}`}>
                                        {user.is_verified ? "True" : "False"}
                                    </span>
                                </td>
                                <td>
                                    <div className="d-flex flex-column gap-2">
                                        {!user.is_verified && (
                                            <button
                                                onClick={() => handleVerify(user.id)}
                                                className="btn btn-sm btn-success m-0"
                                            >
                                                Verify
                                            </button>
                                        )}
                                        <Link
                                            to={`/dashboard/admin/users/update/${user.id}`}
                                            className="btn btn-sm btn-primary"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="btn btn-sm btn-danger m-0"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && !isLoading && (
                            <tr>
                                <td colSpan="8" className="text-center">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;