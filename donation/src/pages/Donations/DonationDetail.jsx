import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import endpoints from "api/endpoints";
import api from "api/apiService";

const DonationDetail = () => {
    const { id } = useParams();
    const [donation, setDonation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDonation = async () => {
            try {
                const response = await api.get(endpoints.donations.detail(id));
                setDonation(response.data);
            } catch (error) {
                console.error("Failed to fetch donation detail", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDonation();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!donation) return <div>Donation not found.</div>;

    return (
        <div className="container my-5">
            <div className="card mx-auto p-5" style={{ maxWidth: '1200px' }}>
                <div className="card-body">
                    <h2 className="card-title mb-4">Donation Detail</h2>

                    <div className="row mb-4">
                        <div className="col-6"><strong>Organization ID:</strong> {donation.organization_id}</div>
                        <div className="col-6"><strong>Donor ID:</strong> {donation.donor_id}</div>
                        <div className="col-6"><strong>Method:</strong> {donation.donation_method}</div>
                        <div className="col-6"><strong>Status:</strong> {donation.status}</div>
                        {donation.donation_method === "pickup" && (
                            <>
                                <div className="col-6"><strong>Pickup Address:</strong> {donation.pickup_address || "N/A"}</div>
                                <div className="col-6"><strong>Pickup Time:</strong> {donation.pickup_time ? new Date(donation.pickup_time).toLocaleString() : "N/A"}</div>
                            </>
                        )}

                        <div className="col-12"><strong>Note:</strong> {donation.note || "N/A"}</div>
                        <div className="col-12"><strong>Created At:</strong> {new Date(donation.created_at).toLocaleString()}</div>
                    </div>

                    <h3 className="mb-3">Items Donated</h3>
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 gap-2">
                        {donation.items.length === 0 ? (
                            <div className="list-group-item">No items found.</div>
                        ) : (
                            donation.items.map((item, index) => (
                                <div key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div className="d-flex gap-3">
                                        {item.image_url && (
                                            <img
                                                src={`http://localhost:5000/uploads/${item.image_url}`}
                                                alt={`Item ${index + 1}`}
                                                className="img-thumbnail mr-4"
                                                style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                                            />
                                        )}
                                        <div>
                                            <div><strong>Cloth For:</strong> {item.cloth_for}</div>
                                            <div><strong>Gender:</strong> {item.gender}</div>
                                            <div><strong>Season:</strong> {item.season}</div>
                                            <div><strong>Condition:</strong> {item.cloth_condition}</div>
                                            <div><strong>Count:</strong> {item.count}</div>
                                            <div><strong>Donated Count:</strong> {item.donated_count}</div>
                                            <div><strong>Status:</strong> {item.status}</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonationDetail;
