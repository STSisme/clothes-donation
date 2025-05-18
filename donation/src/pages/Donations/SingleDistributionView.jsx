import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "api/apiService";
import endpoints from "api/endpoints";

const SingleDistributionView = () => {
  const { id } = useParams();
  const [distribution, setDistribution] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDistribution = async () => {
      try {
        const res = await api.get(endpoints.distributions.single(id));
        setDistribution(res.data);
      } catch (err) {
        setError("Failed to load distribution.");
        console.error(err);
      }
    };

    fetchDistribution();
  }, [id]);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!distribution) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Distribution Details</h2>
      <div className="border rounded p-3 shadow-sm">
        <h4>Distributed to: {distribution.distributed_to}</h4>

        {distribution.distributed_to !== "disaster" ? (
          <>
            <p><strong>Name:</strong> {distribution.recipient_name}</p>
            <p><strong>Contact:</strong> {distribution.recipient_contact}</p>
            <p><strong>Address:</strong> {distribution.recipient_address}</p>
          </>
        ) : (
          <p><strong>Disaster ID:</strong> {distribution.disaster_id}</p>
        )}

        <p><strong>Date:</strong> {new Date(distribution.distribution_date).toLocaleString()}</p>

        <h5>Donation Info:</h5>
        <ul>
          <li>Method: {distribution.donation.donation_method}</li>
          <li>Status: {distribution.donation.donation_status}</li>
          <li>Note: {distribution.donation.donation_note}</li>
        </ul>

        <h5>Items:</h5>
        <div className="row">
          {distribution.items.map((item) => (
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
    </div>
  );
};

export default SingleDistributionView;
