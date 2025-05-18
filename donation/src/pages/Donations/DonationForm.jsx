import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "api/apiService";
import endpoints from "api/endpoints";
import { ROLES } from "constants/roles";
import { useAuth } from "context/AuthContext";

const DonationForm = () => {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const { user } = useAuth();

    const [form, setForm] = useState({
        organization_id: null,
        donor_id: null,
        note: "",
        donation_method: "dropoff",
        pickup_address: "",
        pickup_time: "",
        status: "pending",
    });

    const [items, setItems] = useState([
        {
            cloth_for: "child",
            gender: "male",
            season: "winter",
            cloth_condition: "new",
            count: 1,
            image: null,
            donated_count: 0,
            status: "pending",
        },
    ]);

    const [organizations, setOrganizations] = useState([]);
    const [donors, setDonors] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        api.get(endpoints.organizations.all)
            .then((res) => setOrganizations(res.data))
            .catch(() => setError("Failed to load organizations."));

        if (user.role !== ROLES.DONOR) {
            api.get(endpoints.users.usersWithRole(ROLES.DONOR))
                .then((res) => setDonors(res.data))
                .catch(() => setError("Failed to load donors."));
        }else{
            setForm((prev) => ({
                ...prev,
                donor_id: user.id,
            }));
        }


        if (isEdit) {
            api.get(endpoints.donations.detail(id))
                .then((res) => {
                    const data = res.data;
                    setForm({
                        organization_id: data.organization_id,
                        donor_id: data.donor_id,
                        note: data.pickup_note || "",
                        donation_method: data.donation_method,
                        pickup_address: data.pickup_address || "",
                        pickup_time: data.pickup_time
                            ? data.pickup_time.slice(0, 16)
                            : "",
                        status: data.status,
                    });

                    setItems(data.items || []);
                })
                .catch(() => setError("Failed to load donation."));
        }
    }, [isEdit, id]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...items];
        updatedItems[index][field] = value;
        setItems(updatedItems);
    };

    const handleImageChange = (index, file) => {
        const updatedItems = [...items];
        updatedItems[index].image = file;
        setItems(updatedItems);
    };

    const addItem = () => {
        setItems([
            ...items,
            {
                cloth_for: "child",
                gender: "male",
                season: "winter",
                cloth_condition: "new",
                count: 1,
                image: null,
                donated_count: 0,
                status: "pending",
            },
        ]);
    };

    const removeItem = (index) => {
        setItems((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const fd = new FormData();
            Object.entries(form).forEach(([key, val]) => fd.append(key, val));

            items.forEach((item, idx) => {
                Object.entries(item).forEach(([key, val]) => {
                    if (key === "image" && val) {
                        fd.append(`items[${idx}][image]`, val);
                    } else {
                        fd.append(`items[${idx}][${key}]`, val);
                    }
                });
            });

            if (isEdit) {
                await api.put(endpoints.donations.update(id), fd, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } else {
                const response = await api.post(endpoints.donations.create, fd, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                alert("Doantion Successful Points added :" + response.data.awarded_points)
            }

            navigate(`/dashboard/${user.role}/donations`);
        } catch {
            setError("Failed to save donation.");
        }
    };

    return (
        <div className="container py-5">
            <h2 className="mb-4">{isEdit ? "Edit" : "Create"} Donation</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit} className="row g-3" encType="multipart/form-data">
                {user.role !== ROLES.DONOR && (
                    <div className="col-md-6">
                        <label className="form-label">Donor</label>
                        <select
                            className="form-select"
                            name="donor_id"
                            value={form.donor_id}
                            onChange={handleFormChange}
                            required
                        >
                            <option value="">Select Donor</option>
                            {donors.map((d) => (
                                <option key={d.id} value={d.id}>{d.full_name}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="col-md-6">
                    <label className="form-label">Organization</label>
                    <select
                        className="form-select"
                        name="organization_id"
                        value={form.organization_id}
                        onChange={handleFormChange}
                        required
                    >
                        <option value="">Select Organization</option>
                        {organizations.map((o) => (
                            <option key={o.id} value={o.id}>{o.name}</option>
                        ))}
                    </select>
                </div>

                <div className="col-md-6">
                    <label className="form-label">Donation Method</label>
                    <select
                        className="form-select"
                        name="donation_method"
                        value={form.donation_method}
                        onChange={handleFormChange}
                    >
                        <option value="dropoff">Dropoff</option>
                        <option value="pickup">Pickup</option>
                    </select>
                </div>

                {form.donation_method === "pickup" && (
                    <>
                        <div className="col-md-6">
                            <label className="form-label">Pickup Address</label>
                            <input
                                type="text"
                                className="form-control"
                                name="pickup_address"
                                value={form.pickup_address}
                                onChange={handleFormChange}
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Pickup Time</label>
                            <input
                                type="datetime-local"
                                className="form-control"
                                name="pickup_time"
                                value={form.pickup_time}
                                onChange={handleFormChange}
                                required
                            />
                        </div>
                    </>
                )}

                <div className="col-md-6">
                    <label className="form-label">Note</label>
                    <textarea
                        className="form-control"
                        name="note"
                        value={form.note}
                        onChange={handleFormChange}
                        rows={3}
                        placeholder="Optional notes"
                    />
                </div>

                {user.role !== ROLES.DONOR && (
                    <div className="col-md-6">
                        <label className="form-label">Status</label>
                        <select
                            className="form-select"
                            name="status"
                            value={form.status}
                            onChange={handleFormChange}
                        >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="distributed">Distributed</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                )}

                <hr className="my-4" />
                <h4>Donation Items</h4>

                {items.map((item, index) => (
                    <div className="row g-3 border rounded p-3 mb-3" key={index}>
                        <div className="col-md-2">
                            <label className="form-label">Cloth For</label>
                            <select
                                className="form-select"
                                value={item.cloth_for}
                                onChange={(e) => handleItemChange(index, "cloth_for", e.target.value)}
                            >
                                <option value="child">Child</option>
                                <option value="adult">Adult</option>
                            </select>
                        </div>

                        <div className="col-md-2">
                            <label className="form-label">Gender</label>
                            <select
                                className="form-select"
                                value={item.gender}
                                onChange={(e) => handleItemChange(index, "gender", e.target.value)}
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="unisexual">Unisexual</option>
                            </select>
                        </div>

                        <div className="col-md-2">
                            <label className="form-label">Season</label>
                            <select
                                className="form-select"
                                value={item.season}
                                onChange={(e) => handleItemChange(index, "season", e.target.value)}
                            >
                                <option value="winter">Winter</option>
                                <option value="seasonal">Seasonal</option>
                            </select>
                        </div>

                        <div className="col-md-2">
                            <label className="form-label">Condition</label>
                            <select
                                className="form-select"
                                value={item.cloth_condition}
                                onChange={(e) => handleItemChange(index, "cloth_condition", e.target.value)}
                            >
                                <option value="new">New</option>
                                <option value="gently_used">Gently Used</option>
                                <option value="needs_repair">Needs Repair</option>
                            </select>
                        </div>

                        <div className="col-md-2">
                            <label className="form-label">Count</label>
                            <input
                                type="number"
                                className="form-control"
                                min="1"
                                value={item.count}
                                onChange={(e) => handleItemChange(index, "count", e.target.value)}
                            />
                        </div>

                        {user.role !== ROLES.DONOR && (
                            <div className="col-md-2">
                                <label className="form-label">Donated Count</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={item.donated_count || 0}
                                    readOnly
                                />
                            </div>
                        )}

                        {user.role !== ROLES.DONOR && (
                            <div className="col-md-2">
                                <label className="form-label">Status</label>
                                <select
                                    className="form-select"
                                    value={item.status || "pending"}
                                    onChange={(e) => handleItemChange(index, "status", e.target.value)}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="partially_donated">Partially Donated</option>
                                    <option value="donated">Donated</option>
                                </select>
                            </div>
                        )}

                        <div className="col-md-2">
                            <label className="form-label">Image</label>
                            <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                onChange={(e) => handleImageChange(index, e.target.files[0])}
                            />
                        </div>

                        <div className="col-12 text-end">
                            {items.length > 1 && (
                                <button
                                    type="button"
                                    className="btn btn-danger btn-sm"
                                    onClick={() => removeItem(index)}
                                >
                                    Remove Item
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                <div className="col-12">
                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={addItem}
                    >
                        Add Another Item
                    </button>
                </div>

                <div className="col-12 text-end">
                    <button type="submit" className="btn btn-primary">
                        {isEdit ? "Update Donation" : "Create Donation"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DonationForm;
