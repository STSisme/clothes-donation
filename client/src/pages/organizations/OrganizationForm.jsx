import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { useAuth } from "context/AuthContext";
import TextInput from "components/form/TextInput";
import PhoneNumberInput from "components/form/PhoneNumberInput";
import FileInput from "components/form/FileInput";
import endpoints from "api/endpoints";
import api from "api/apiService";

const OrganizationForm = ({ isEdit }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    phone_number: "",
    address: "",
    latitude: "",
    longitude: "",
    image_url: null,
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isEdit && id) {
      const fetchOrganization = async () => {
        try {
          const response = await api.get(endpoints.organizations.detail(id));
          setFormData({
            ...response.data,
            image_url: null,
          });
        } catch (error) {
          console.error("Failed to fetch organization", error);
        }
      };

      fetchOrganization();
    }
  }, [isEdit, id]);

  if (!isAuthenticated || user.role !== "admin") {
    return <Navigate to="/login" />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      image_url: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) data.append(key, value);
    });

    try {
      const response = isEdit
        ? await api.put(`${endpoints.organizations.update}/${id}`, data, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        : await api.post(endpoints.organizations.create, data, {
            headers: { "Content-Type": "multipart/form-data" },
          });

      if (response.status !== 200) {
        throw new Error("Failed to submit organization.");
      }

      alert(`Organization ${isEdit ? "updated" : "created"} successfully!`);
      navigate("/dashboard/admin/organizations");
    } catch (error) {
      console.error("Submission error:", error);
      setErrorMessage(error.message || "Something went wrong.");
    }
  };

  return (
    <div className="container py-5">
      <div className="row align-items-center justify-content-center">
        <div className="col-lg-8 shadow-lg p-5 rounded">
          <h2 className="text-center mb-4">
            {isEdit ? "Edit Organization" : "Create Organization"}
          </h2>

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <TextInput
              label="Organization Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter organization name"
              required
            />

            <TextInput
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter organization description"
              required
            />

            <PhoneNumberInput
              label="Phone Number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
            />

            <TextInput
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
              required
            />

            <TextInput
              label="Latitude"
              name="latitude"
              type="number"
              step="any"
              value={formData.latitude}
              onChange={handleChange}
              placeholder="Enter latitude"
              required
            />

            <TextInput
              label="Longitude"
              name="longitude"
              type="number"
              step="any"
              value={formData.longitude}
              onChange={handleChange}
              placeholder="Enter longitude"
              required
            />

            <FileInput
              label="Image"
              name="image_url"
              onChange={handleFileChange}
              accept="image/*"
              required={!isEdit}
            />

            <button type="submit" className="btn btn-primary w-100">
              {isEdit ? "Update Organization" : "Create Organization"}
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

export default OrganizationForm;
