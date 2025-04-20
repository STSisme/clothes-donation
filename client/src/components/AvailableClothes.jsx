import React, { useState, useEffect } from 'react';

const AvailableClothes = () => {
  const [filter, setFilter] = useState({
    type: '',
    condition: '',
    location: '',
  });

  const [availableClothes, setAvailableClothes] = useState([]);
  const [filteredClothes, setFilteredClothes] = useState([]);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  // Handle requesting allocation for a specific clothes type
  const handleRequestAllocation = (clothesType) => {
    alert(`Requested allocation for ${clothesType}`);
  };

  // Fetch available clothes data
  useEffect(() => {
    const fetchDonatedClothes = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/donated-clothes');
        const data = await response.json();

        // Filter out clothes that are already distributed
        const filteredClothes = data.filter(clothing => clothing.status !== 'distributed');
        setAvailableClothes(filteredClothes);
        setFilteredClothes(filteredClothes);
      } catch (error) {
        console.error('Error fetching clothes:', error);
      }
    };

    fetchDonatedClothes();
  }, []);

  // Filter clothes based on selected filters
  const handleFilterSubmit = () => {
    const filteredData = availableClothes.filter((clothing) => {
      return (
        (filter.type ? clothing.clothesDetails.type === filter.type : true) &&
        (filter.condition ? clothing.clothesDetails.condition === filter.condition : true) &&
        (filter.location ? clothing.donorInfo.location === filter.location : true)
      );
    });

    setFilteredClothes(filteredData); // Update the displayed clothes after filtering
  };

  return (
    <section className="available-clothes">
      <h3>Available Clothes for Distribution</h3>
      
      <div className="filter-options">
        {/* Filter by Type */}
        <select
          name="type"
          value={filter.type}
          onChange={handleFilterChange}
        >
          <option value="">Filter by Type</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="kids">Kids</option>
          <option value="winterwear">Winterwear</option>
          <option value="traditional">Traditional</option>
          <option value="accessories">Accessories</option>
        </select>

        {/* Filter by Condition */}
        <select
          name="condition"
          value={filter.condition}
          onChange={handleFilterChange}
        >
          <option value="">Filter by Condition</option>
          <option value="New">New</option>
          <option value="Gently Used">Gently Used</option>
          <option value="Worn">Worn</option>
        </select>

        {/* Filter by Location */}
        <select
          name="location"
          value={filter.location}
          onChange={handleFilterChange}
        >
          <option value="">Filter by Location</option>
          <option value="Nepal">Nepal</option>
          <option value="California">California</option>
          <option value="Florida">Florida</option>
        </select>

        {/* Filter Button */}
        <button onClick={handleFilterSubmit}>Apply Filters</button>
      </div>

      <div className="clothes-list">
        {filteredClothes.length > 0 ? (
          filteredClothes.map((clothing, index) => (
            <div key={index} className="clothes-item">
              <p>{clothing.clothesDetails.type} - {clothing.clothesDetails.quantity} Items</p>
              <button onClick={() => handleRequestAllocation(clothing.clothesDetails.type)}>
                Request Allocation
              </button>
            </div>
          ))
        ) : (
          <p>No available clothes for distribution.</p>
        )}
      </div>
    </section>
  );
};

export default AvailableClothes;
