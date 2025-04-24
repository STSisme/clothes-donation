import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import './AdminPanel.css';
import Header from '../../components/header';
import VerifyDistributors from './VerifyDistributors';
import ManageDisasters from './ManageDisasters';
import UpdateDonations from '../Distributor/UpdateDonations';
import RemoveUsers from './RemoveUsers';


const AdminPanel = () => {
    return (
      <>
        <Header />
        <div className="admin-panel">

          <div className="admin">
            <h2>Admin Dashboard</h2>
            <p>Welcome to the Admin Panel. You can manage the system from the following sections:</p>
            <ul>
              <li><Link to="/VerifyDistributors.jsx">Verify and Approve Distributors</Link></li>
              <li><Link to="/ManageDisasters.jsx">Manage and Update Disaster Information</Link></li>
              <li><Link to="/UpdateDonations.jsx">Update Donation Status</Link></li>
              <li><Link to="/RemoveUsers.jsx">Remove Users from the System</Link></li>
            </ul>
          </div>

          <div className="admin-content">
            <Routes>
              <Route path='/VerifyDistributors.jsx' element={<VerifyDistributors />} />
              <Route path="/ManageDisasters.jsx" element={<ManageDisasters />} />
              <Route path="/UpdateDonations.jsx" element={<UpdateDonations />} />
              <Route path="/RemoveUsers.jsx" element={<RemoveUsers />} />
            </Routes>
          </div>
        </div>
      </>
    );
};

export default AdminPanel;
