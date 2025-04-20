import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery'; 
import 'popper.js'; 
import 'bootstrap/dist/js/bootstrap.min';

import { AuthProvider, useAuth } from './context/AuthContext';
import AdminRegister from './pages/Admin/AdminRegister';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import AllNGOs from './pages/Home/AllNGOsDisplay';
import DistributorRegistrationForm from './pages/Distributor/DistributorRegistratorForm';
import Donate from './pages/Donor/Donate';
import DonorDashboard from './pages/Donor/DonorDashboard';
import UserProfile from './pages/Donor/UserProfile';
import UploadProfileImage from './pages/Donor/UserProfile';
import MyDonations from './pages/Donor/MyDonations';
import DistributorDashboard from './pages/Distributor/DistributorDashboard';
import UserProfileDistributor from './pages/Donor/USerProfileDistributor';
import TrackingAndReportingPage from './pages/Donor/Tracking';
import DisastersRelief from './pages/Home/DisastersReleif';
import AdminPanel from './pages/Admin/AdminPanel';
import VerifyDistributors from './pages/Admin/VerifyDistributors';
import UpdateDonations from './pages/Donor/UpdateDonations';
import RemoveUsers from './pages/Admin/RemoveUsers';
import ManageDisasters from './pages/Admin/ManageDisasters';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/all-ngos" element={<AllNGOs />} />
          <Route path="/distributor-registration" element={<DistributorRegistrationForm />} />
          <Route path="/AdminRegister" element={<AdminRegister />} />

          {/* Protected Routes */}
          <Route 
            path="/donate" 
            element={
              <ProtectedRoute allowedRoles={['Donor']}>
                <Donate />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/DonorDashboard" 
            element={
              <ProtectedRoute allowedRoles={['Donor']}>
                <DonorDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/UserProfile" 
            element={
              <ProtectedRoute allowedRoles={['Donor']}>
                <UserProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/UserProfileImage" 
            element={
              <ProtectedRoute allowedRoles={['Donor']}>
                <UploadProfileImage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/MyDonations" 
            element={
              <ProtectedRoute allowedRoles={['Donor']}>
                <MyDonations />
              </ProtectedRoute>
            } 
          />

          {/* Distributor */}
          <Route 
            path="/DistributorDashboard" 
            element={
              <ProtectedRoute allowedRoles={['Distributor']}>
                <DistributorDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/UserProflieDistributor" 
            element={
              <ProtectedRoute allowedRoles={['Distributor']}>
                <UserProfileDistributor />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tracking" 
            element={
              <ProtectedRoute allowedRoles={['Distributor']}>
                <TrackingAndReportingPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/disastersrelief" 
            element={
              <ProtectedRoute allowedRoles={['Distributor', 'Admin']}>
                <DisastersRelief />
              </ProtectedRoute>
            } 
          />

          {/* Admin */}
          <Route 
            path="/AdminPanel" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/VerifyDistributors" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <VerifyDistributors />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/UpdateDonations" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <UpdateDonations />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/RemoveUsers" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <RemoveUsers />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ManageDisasters" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <ManageDisasters />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
