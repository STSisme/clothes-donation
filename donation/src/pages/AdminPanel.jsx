import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import './AdminPanel.css'; 
import VerifyDistributors from './VerifyDistributors';
import ManageDisasters from './ManageDisasters';
import UpdateDonations from './UpdateDonations';
import RemoveUsers from './RemoveUsers';

const AdminPanel = () => {
    return (
        <div className="admin-panel">
          <div className="sidebar">
            <ul>
              <li><Link to="/VerifyDistributors.jsx">Verify Distributors</Link></li>
              <li><Link to="/ManageDistributors.jsx">Manage Distributors</Link></li>
              <li><Link to="/UpdateDonations.jsx">Update Donations</Link></li>
              <li><Link to="/RemoveUsers.jsx">Remove Users</Link></li>
            </ul>
          </div>
          
          <div className="admin">
            <ManageDisasters/>
            <RemoveUsers/>
            <UpdateDonations/>
            <VerifyDistributors/>   
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
      );
    };
export default AdminPanel;

