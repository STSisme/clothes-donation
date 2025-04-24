import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "api/apiService";
import endpoints from "api/endpoints";

const DisasterForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    type: "",
    region: "",
    severity: "low",
    notify_users: false,
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    if (isEdit && id) {
      const fetchDisaster = async () => {
        try {
          const response = await api.get(endpoints.disasters.detail(id));
          setFormData({
            ...response.data,
            latitude: response.data.latitude || "",
            longitude: response.data.longitude || "",
          });
        } catch (error) {
          console.error("Failed to load disaster", error);
          setErrorMessage("Failed to load disaster.");
        }
      };
      fetchDisaster();
    }
  }, [isEdit, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await api.put(endpoints.disasters.update(id), formData);
        alert("Disaster updated successfully!");
      } else {
        await api.post(endpoints.disasters.create, formData);
        alert("Disaster created successfully!");
      }
      navigate("/dashboard/admin/disasters");
    } catch (error) {
      console.error("Disaster save error:", error);
      setErrorMessage(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 shadow-lg p-5 rounded">
          <h2 className="text-center mb-4">
            {isEdit ? "Edit Disaster" : "Create Disaster"}
          </h2>
          <form onSubmit={handleSubmit}>
            {[
              { label: "Title", name: "title" },
              { label: "Description", name: "description" },
              { label: "Location", name: "location" },
              { label: "Type", name: "type" },
              { label: "Region", name: "region" },
              { label: "Latitude", name: "latitude" },
              { label: "Longitude", name: "longitude" },
            ].map(({ label, name }) => (
              <div className="mb-3" key={name}>
                <label className="form-label">{label}</label>
                <input
                  type="text"
                  className="form-control"
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  required={["title", "description"].includes(name)}
                />
              </div>
            ))}

            <div className="mb-3">
              <label className="form-label">Severity</label>
              <select
                className="form-select"
                name="severity"
                value={formData.severity}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                name="notify_users"
                checked={formData.notify_users}
                onChange={handleChange}
                id="notify_users"
              />
              <label className="form-check-label" htmlFor="notify_users">
                Notify Users
              </label>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              {isEdit ? "Update Disaster" : "Create Disaster"}
            </button>

            {errorMessage && (
              <div className="alert alert-danger my-3">{errorMessage}</div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default DisasterForm;
