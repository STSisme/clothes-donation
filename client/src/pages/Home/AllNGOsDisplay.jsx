import React, { useState, useEffect } from 'react';
import Header from '../../components/header';

function DistributorsList() {
  const [distributors, setDistributors] = useState([]);

  // Fetch distributor data when the component is mounted
  useEffect(() => {
    fetch('/distributors')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setDistributors(data))
      .catch(error => console.error('Error fetching distributor data:', error));
  }, []);

  return (
    <><Header />
    <div>
          <h1>NGOs and Distributors</h1>

          <div id="distributors-list">
              {distributors.map(distributor => (
                  <div key={distributor.id} className="distributor">
                      <h2>{distributor.name}</h2>
                      <button onClick={() => window.location.href = `/distributor/${distributor.id}`}>
                          Know More
                      </button>
                  </div>
              ))}
          </div>
      </div></>
  );
}

export default DistributorsList;
