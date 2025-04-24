import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TextInput from "components/form/TextInput";
import PhoneNumberInput from "components/form/PhoneNumberInput";
import PasswordInput from "components/form/PasswordInput";
import api from "api/apiService";
import endpoints from "api/endpoints";

const UserForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    phone_number: "",
    address: "",
    role: "donor",
    organization_id: null,
    profile_image: null,
    is_verified: 0,
  });

  const [organizations, setOrganizations] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await api.get(endpoints.organizations.all);
        setOrganizations(response.data);
      } catch (error) {
        console.error("Failed to load organizations", error);
      }
    };

    fetchOrganizations();

    if (isEdit && id) {
      const fetchUser = async () => {
        try {
          const res = await api.get(endpoints.users.detail(id));
          const user = res.data;
          
          setFormData({
            ...user,
            password: "",
            profile_image: null,
          });
        } catch (error) {
          console.error("Failed to load user", error);
        }
      };

      fetchUser();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, files, checked, type } = e.target;
    let val = value;
    
    if(type === 'file') {
       val = files ? files[0] : null;
    }else if(type === 'checkbox') {
       val = checked;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      full_name,
      email,
      password,
      phone_number,
      address,
      role,
      organization_id,
      profile_image,
      is_verified,
    } = formData;

    if (!full_name || !email || (!isEdit && !password) || !phone_number || !address || !role) {
      setErrorMessage("Please fill all required fields.");
      return;
    }

    const data = new FormData();
    data.append("full_name", full_name);
    data.append("email", email);
    if (password) data.append("password", password);
    data.append("phone_number", phone_number);
    data.append("address", address);
    data.append("role", role);
    data.append("is_verified", is_verified);
    if (role === "distributor") data.append("organization_id", organization_id);
    if (profile_image) data.append("profile_image", profile_image);

    try {
      const response = isEdit
        ? await api.put(endpoints.users.update(id), data, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        : await api.post(endpoints.users.create, data, {
            headers: { "Content-Type": "multipart/form-data" },
          });

      if ([200, 201].includes(response.status)) {
        alert(`User ${isEdit ? "updated" : "created"} successfully!`);
        navigate("/dashboard/admin/users");
      } else {
        throw new Error("Failed to submit user.");
      }
    } catch (error) {
      console.error("User form submission error:", error);
      setErrorMessage(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 shadow-lg p-5 rounded">
          <h2 className="text-center mb-4">{isEdit ? "Edit User" : "Create User"}</h2>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <TextInput label="Full Name" name="full_name" value={formData.full_name} onChange={handleChange} required />
            <TextInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            <PasswordInput label="Password" name="password" value={formData.password} onChange={handleChange} required={!isEdit} />
            <PhoneNumberInput label="Phone Number" name="phone_number" value={formData.phone_number} onChange={handleChange} required />
            <TextInput label="Address" name="address" value={formData.address} onChange={handleChange} required />

            <div className="mb-3">
              <label className="form-label">Role</label>
              <select className="form-select" name="role" value={formData.role} onChange={handleChange}>
                <option value="donor">Donor</option>
                <option value="distributor">Distributor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {formData.role === "distributor" && (
              <div className="mb-3">
                <label className="form-label">Organization</label>
                <select
                  className="form-select"
                  name="organization_id"
                  value={formData.organization_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select an organization</option>
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>{org.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">Profile Image</label>
              <input
                type="file"
                className="form-control"
                name="profile_image"
                onChange={handleChange}
                accept="image/*"
              />
            </div>

            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="mx-3"
                name="is_verified"
                value=""
                onChange={handleChange}
                checked={formData.is_verified}
              />
              <label className="form-check-label" htmlFor="is_verified">Is Verified</label>
            </div>

            <button type="submit" className="btn btn-primary w-100 m-0">
              {isEdit ? "Update User" : "Create User"}
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

export default UserForm;