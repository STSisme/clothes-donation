import React, { useEffect, useState } from "react";
import api from "api/apiService";
import endpoints from "api/endpoints";
import { useNavigate } from "react-router-dom";
import { useAuth } from "context/AuthContext";

const DonationDistribution = () => {
    const navigate = useNavigate();
    const [donations, setDonations] = useState([]);
    const [disasters, setDisasters] = useState([]);
    const { user } = useAuth();

    const [form, setForm] = useState({
        donation_item_ids: [],
        donation_ids: [],
        distributed_count: 0,
        distributed_to: "disaster",
        disaster_id: "",
        recipient_name: "",
        recipient_contact: "",
        recipient_address: "",
        distributed_by: user.id,
        longitude: "",
        latitude: "",
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [donationRes, disasterRes] = await Promise.all([
                    api.get(endpoints.donations.allWithItems),
                    api.get(endpoints.disasters.all),
                ]);
                setDonations(donationRes.data);
                setDisasters(disasterRes.data);
            } catch (err) {
                console.error("Error fetching data", err);
            }
        };
        fetchData();
    }, []);

    const handleItemToggle = (itemId, donationId) => {
        setForm((prev) => {
            const updatedItemIds = prev.donation_item_ids.includes(itemId)
                ? prev.donation_item_ids.filter((id) => id !== itemId)
                : [...prev.donation_item_ids, itemId];

            const selectedItems = donations
                .flatMap((donation) => donation.items)
                .filter((item) => updatedItemIds.includes(item.id));

            const totalCount = selectedItems.reduce((sum, item) => sum + item.count, 0);

            return {
                ...prev,
                donation_item_ids: updatedItemIds,
                distributed_count: totalCount,
            };
        });
    };



    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post(endpoints.distributions.create, form);
            alert("Distribution recorded successfully.");
            navigate("/dashboard/distributor/donations");
        } catch (err) {
            console.error("Error submitting distribution", err);
            alert("Failed to submit distribution.");
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <div className="container mt-4">
            <h2 className="mb-4">Distribute Donation</h2>

            <div className="accordion mb-4" id="donationAccordion">
                {donations.map((donation, index) => (
                    <div className="accordion-item" key={donation.id}>
                        <h2 className="accordion-header" id={`heading-${index}`}>
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#collapse-${index}`}
                                aria-expanded="false"
                                aria-controls={`collapse-${index}`}
                            >
                                Donation #{donation.id} — {donation.status}
                            </button>
                        </h2>
                        <div
                            id={`collapse-${index}`}
                            className="accordion-collapse collapse"
                            aria-labelledby={`heading-${index}`}
                            data-bs-parent="#donationAccordion"
                        >
                            <div className="accordion-body">
                                {donation.items.length === 0 ? (
                                    <p>No items in this donation.</p>
                                ) : (
                                    <div className="row g-3">
                                        {donation.items.map((item) => {
                                            const available = item.count;
                                            const isSelected = form.donation_item_ids.includes(item.id);
                                            return (
                                                <div className="col-md-6" key={item.id}>
                                                    <div className={`card h-100 border ${isSelected ? "border-primary" : ""}`}>
                                                        <div className="row g-0">
                                                            {item.image_url && (
                                                                <div className="col-4">
                                                                    <img
                                                                        src={`http://localhost:5000/uploads/${item.image_url}`}
                                                                        className="img-fluid rounded-start"
                                                                        alt="Item"
                                                                    />
                                                                </div>
                                                            )}
                                                            <div className="col">
                                                                <div className="card-body">
                                                                    <div className="form-check mb-2">
                                                                        <input
                                                                            className="form-check-input"
                                                                            type="checkbox"
                                                                            checked={form.donation_item_ids.includes(item.id)}  // Check if the item is selected
                                                                            onChange={() => handleItemToggle(item.id, donation.id)} // Pass both item ID and donation ID
                                                                            disabled={item.count <= 0}  // Disable checkbox if no stock is available
                                                                        />

                                                                        <label className="form-check-label">
                                                                            <strong>{item.cloth_for}</strong> - {item.gender}
                                                                        </label>
                                                                    </div>
                                                                    <p className="card-text small mb-0">
                                                                        <strong>Season:</strong> {item.season}<br />
                                                                        <strong>Condition:</strong> {item.cloth_condition}<br />
                                                                        <strong>Available:</strong> {available}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Distribution Form */}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Distributed Count</label>
                    <input
                        type="number"
                        className="form-control"
                        name="distributed_count"
                        value={form.distributed_count}
                        onChange={handleChange}
                        readOnly
                    />
                    <div className="form-text">
                        Automatically calculated based on selected items.
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Distributed To</label>
                    <select
                        className="form-select"
                        name="distributed_to"
                        value={form.distributed_to}
                        onChange={handleChange}
                        required
                    >
                        <option value="disaster">Disaster</option>
                        <option value="individual">Individual</option>
                        <option value="institution">Institution</option>
                    </select>
                </div>

                {form.distributed_to === "disaster" && (
                    <div className="mb-3">
                        <label className="form-label">Disaster</label>
                        <select
                            className="form-select"
                            name="disaster_id"
                            value={form.disaster_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Select Disaster --</option>
                            {disasters.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.title} ({d.region})
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {(form.distributed_to === "individual" || form.distributed_to === "institution") && (
                    <>
                        <div className="mb-3">
                            <label className="form-label">Recipient Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="recipient_name"
                                value={form.recipient_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Recipient Contact</label>
                            <input
                                type="text"
                                className="form-control"
                                name="recipient_contact"
                                value={form.recipient_contact}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Recipient Address</label>
                            <textarea
                                className="form-control"
                                name="recipient_address"
                                rows="2"
                                value={form.recipient_address}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Longitude</label>
                            <input
                                type="text"
                                className="form-control"
                                name="longitude"
                                value={form.longitude || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Latitude</label>
                            <input
                                type="text"
                                className="form-control"
                                name="latitude"
                                value={form.latitude || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </>
                )}

                <button className="btn btn-primary" type="submit" disabled={submitting || form.donation_item_ids.length === 0}>
                    {submitting ? "Submitting..." : "Distribute"}
                </button>
            </form>
        </div>
    );
};

export default DonationDistribution;
