import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function DistributorDetails() {
  const { id } = useParams(); // Get distributor ID from URL
  const [distributor, setDistributor] = useState(null);

  // Fetch the distributor details when the component is mounted
  useEffect(() => {
    fetch(`/distributor/${id}`)
      .then(response => response.json())
      .then(data => setDistributor(data))
      .catch(error => console.error('Error fetching distributor data:', error));
  }, [id]);

  // If distributor data isn't loaded yet, show loading state
  if (!distributor) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Distributor Details</h1>
      <div id="distributor-details">
        <h2>{distributor.name}</h2>
        <p><strong>Location:</strong> {distributor.location}</p>
        <p><strong>Email:</strong> {distributor.email}</p>
        <p><strong>Phone:</strong> {distributor.phone}</p>
        <p><strong>Description:</strong> {distributor.description}</p>
      </div>
    </div>
  );
}

export default DistributorDetails;
