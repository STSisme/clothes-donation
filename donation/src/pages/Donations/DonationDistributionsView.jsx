import { useEffect, useState } from "react";
import { useAuth } from "context/AuthContext";
import api from "api/apiService";
import endpoints from "api/endpoints";

const DonationDistributionView = () => {
    const [distributions, setDistributions] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        api.get(endpoints.distributions.all(user.id)).then((res) => {
            setDistributions(res.data);
        });
    }, [user.id]);

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Your Distributions</h2>
            {distributions.map((dist) => (
                <div key={dist.distribution_id} className="mb-5 border rounded p-3 shadow-sm">
                    <h4>Distributed to: {dist.distributed_to}</h4>

                    {dist.distributed_to !== "disaster" ? (
                        <>
                            <p><strong>Name:</strong> {dist.recipient_name}</p>
                            <p><strong>Contact:</strong> {dist.recipient_contact}</p>
                            <p><strong>Address:</strong> {dist.recipient_address}</p>
                        </>
                    ) : (
                        <p><strong>Disaster ID:</strong> {dist.disaster_id}</p>
                    )}

                    <p><strong>Date:</strong> {new Date(dist.distribution_date).toLocaleString()}</p>

                    <h5>Donation Info:</h5>
                    <ul>
                        <li>Method: {dist.donation.donation_method}</li>
                        <li>Status: {dist.donation.donation_status}</li>
                        <li>Note: {dist.donation.donation_note}</li>
                    </ul>

                    <h5>Items:</h5>
                    <div className="row">
                        {dist.items.map((item) => (
                            <div key={item.item_id} className="col-md-4">
                                <div className="card mb-3">
                                    {item.image_url && (
                                        <img
                                            src={`http://localhost:5000/uploads/${item.image_url}`}
                                            alt="Item"
                                            className="card-img-top"
                                        />
                                    )}
                                    <div className="card-body">
                                        <h6 className="card-title">{item.cloth_condition} - {item.gender}</h6>
                                        <p className="card-text">
                                            For: {item.cloth_for}<br />
                                            Season: {item.season}<br />
                                            Count: {item.count}<br />
                                            Donated Count: {item.donated_count}<br />
                                            Status: {item.status}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DonationDistributionView;
