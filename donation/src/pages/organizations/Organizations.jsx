import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "api/apiService";
import endpoints from "api/endpoints";
import { useAuth } from "context/AuthContext";
import { ROLES } from "constants/roles";
import { CSVLink } from "react-csv"; // Import CSVLink

const Organizations = () => {
  const [organizations, setOrganizations] = useState([]);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrganizations = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(endpoints.organizations.all);
      setOrganizations(response.data);
    } catch (err) {
      setError("Failed to fetch organizations.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this organization?")) return;

    try {
      await api.delete(endpoints.organizations.delete(id));
      setOrganizations((prev) => prev.filter((org) => org.id !== id));
    } catch (err) {
      setError("Failed to delete organization.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const isDonor = user?.role === ROLES.DONOR;
  const isAdmin = user?.role === ROLES.ADMIN;

  const csvData = organizations.map(org => ({
    Name: org.name,
    Description: org.description,
    Phone: org.phone_number,
    Address: org.address,
    Latitude: org.latitude,
    Longitude: org.longitude,
    Image_URL: org.image_url ? `http://localhost:5000/uploads/${org.image_url}` : 'No Image',
    Created_At: new Date(org.created_at).toLocaleString(),
    Updated_At: new Date(org.updated_at).toLocaleString()
  }));

  return (
    <div className="container py-5">
      <h2 className="mb-4">Organizations</h2>

      {!isDonor && (
        <div className="d-flex justify-content-between mb-3">
          <div>
            {isAdmin && (
              <CSVLink 
                data={csvData}
                filename={"organizations_export.csv"}
                className="btn btn-info me-2"
              >
                Export to CSV
              </CSVLink>
            )}
          </div>
          <div>
            <Link to="/dashboard/admin/organizations/create" className="btn btn-success">
              Create Organization
            </Link>
          </div>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}
      {isLoading && <div className="text-center">Loading organizations...</div>}

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Image</th>
              {!isDonor && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {organizations.map((org) => (
              <tr key={org.id}>
                <td>{org.name}</td>
                <td>{org.description}</td>
                <td>{org.phone_number}</td>
                <td>{org.address}</td>
                <td>{org.latitude}</td>
                <td>{org.longitude}</td>
                <td>
                  {org.image_url ? (
                    <img 
                      src={`http://localhost:5000/uploads/${org.image_url}`} 
                      alt={org.name} 
                      style={{ width: "80px", height: "auto" }} 
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                {!isDonor && (
                  <td>
                    <div className="d-flex justify-content-center flex-column gap-2">
                      <Link 
                        to={`/dashboard/admin/organizations/update/${org.id}`} 
                        className="btn btn-sm btn-primary"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(org.id)}
                        className="btn btn-sm btn-danger m-0"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {organizations.length === 0 && !isLoading && (
              <tr>
                <td colSpan={isDonor ? "7" : "8"} className="text-center">
                  No organizations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Organizations;