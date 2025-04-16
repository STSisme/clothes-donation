import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery'; 
import 'popper.js'; 
import 'bootstrap/dist/js/bootstrap.min.js';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Donate from './pages/Donate';
import AllNGOs from './pages/AllNGOsDisplay';
import DistributorDashboard from './pages/DistributorDashboard';
import TrackingAndReportingPage from './pages/Tracking';
import DistributorRegistrationForm from './pages/DistributorRegistratorForm';
import DisastersRelief from './pages/DisastersReleif';
import AdminPanel from './pages/AdminPanel';
import UserProfileDistributor from './pages/USerProfileDistributor';
import UserProfile from './pages/UserProfile';
import UploadProfileImage from './pages/UserProfileImage';

import './App.css';
import VerifyDistributors from './pages/VerifyDistributors';
import UpdateDonations from './pages/UpdateDonations';
import RemoveUsers from './pages/RemoveUsers';
import ManageDisasters from './pages/ManageDisasters';
import { AuthProvider } from './context/AuthContext';
import AdminRegister from './pages/AdminRegister';
import DonorDashboard from './pages/DonorDashboard';
import MyDonations from './pages/MyDonations';


function App() {
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role || ''; // Assuming 'role' is stored as 'donor', 'distributor', or 'admin'
  const userId = user?.id;

  return (
    <>
      <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Login.js' element={<Login />} />
          <Route path='/register.js' element={<Register />} />
          <Route path='/donate.js' element={<Donate />} />
          <Route path='/all-ngos.js' element={<AllNGOs />} />
          <Route path='/UserProfile.js' element={<UserProfile />} />
          <Route path='/UserProfileImage.js' element={<UploadProfileImage />} />
          <Route path='/UserProflieDistributor.js' element={<UserProfileDistributor />} />
          <Route path='/DonorDashboard.jsx' element={<DonorDashboard />} />
          <Route path='/distributordashboard.js' element={<DistributorDashboard />} />
          <Route path='/tracking.jsx' element={<TrackingAndReportingPage />} />
          <Route path='/MyDonations.jsx' element={<MyDonations />} />
          <Route path='/DistributorRegistrationForm.jsx' element={<DistributorRegistrationForm />} />
          <Route path='/disastersrelief.jsx' element={<DisastersRelief />} />
          <Route path='/adminpanel.jsx' element={<AdminPanel />} />
          <Route path='/AdminRegister.jsx' element={<AdminRegister />} />
          <Route path='/ManageDisasters.jsx' element={<ManageDisasters />} />
          <Route path='/RemoveUsers.jsx' element={<RemoveUsers />} />
          <Route path='/UpdateDonations.jsx' element={<UpdateDonations />} />
          <Route path='/VerifyDistributors.jsx' element={<VerifyDistributors />} />
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  
  );
}

export default App;
