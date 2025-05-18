import React from "react";
import { Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import UserProfile from "../pages/ProfilePage";
import ProtectedRoute from "./ProtectedRoutes";
import Stats from "components/Stats";

import { ALLOWED_ROLES, ROLES } from "../constants/roles";
import Organizations from "pages/organizations/Organizations";
import Users from "pages/users/Users";
import Disasters from "pages/disasters/Disasters";
import DisasterForm from "pages/disasters/DisasterForm";
import Donations from "pages/Donations/Donations";
import DonationForm from "pages/Donations/DonationForm";
import UserForm from "pages/users/UserForm";
import OrganizationForm from "pages/organizations/OrganizationForm";
import DonationDetail from "pages/Donations/DonationDetail";
import DonationDistribution from "pages/Donations/DonationDistribution";
import DonationDistributionView from "pages/Donations/DonationDistributionsView";
import Distributions from "pages/Donations/Distributions";
import SingleDistributionView from "pages/Donations/SingleDistributionView";

const donorRoutes = [
  // Dashboard
  <Route
    path="/dashboard/admin"
    element={
      <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
        <Dashboard />
      </ProtectedRoute>
    }
  />,
  <Route
    path="/dashboard/donor"
    element={
      <ProtectedRoute allowedRoles={[ROLES.DONOR]}>
        <Dashboard />
      </ProtectedRoute>
    }
  />,
  <Route
    path="/dashboard/distributor"
    element={
      <ProtectedRoute allowedRoles={[ROLES.DISTRIBUTOR]}>
        <Dashboard />
      </ProtectedRoute>
    }
  />,

  // Donor Specific
  <Route
    path="/dashboard/donor/organizations"
    element={
      <ProtectedRoute allowedRoles={[ROLES.DONOR]}>
        <Organizations />
      </ProtectedRoute>
    }
  />,

  // Profile
  <Route
    key="profile-donor"
    path="/profile/donor"
    element={
      <ProtectedRoute allowedRoles={[ROLES.DONOR]}>
        <UserProfile />
      </ProtectedRoute>
    }
  />,
  <Route
    key="profile-distributor"
    path="/profile/distributor"
    element={
      <ProtectedRoute allowedRoles={[ROLES.DISTRIBUTOR]}>
        <UserProfile />
      </ProtectedRoute>
    }
  />,
  <Route
    key="profile-admin"
    path="/profile/admin"
    element={
      <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
        <UserProfile />
      </ProtectedRoute>
    }
  />,

  // Stats
  <Route
    key="dashboard-stats-admin"
    path="/dashboard/admin/stats"
    element={
      <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
        <Stats />
      </ProtectedRoute>
    }
  />,
  <Route
    key="dashboard-stats-donor"
    path="/dashboard/donor/stats"
    element={
      <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
        <Stats />
      </ProtectedRoute>
    }
  />,
  <Route
    key="dashboard-stats-distributor"
    path="/dashboard/distributor/stats"
    element={
      <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
        <Stats />
      </ProtectedRoute>
    }
  />,

  // Admin Management
  <Route
    path="/dashboard/admin/organizations"
    element={
      <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
        <Organizations />
      </ProtectedRoute>
    }
  />,
  <Route
    path="/dashboard/admin/organizations/create"
    element={
      <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
        <OrganizationForm />
      </ProtectedRoute>
    }
  />,
  <Route
    path="/dashboard/admin/organizations/update/:id"
    element={
      <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
        <OrganizationForm isEdit />
      </ProtectedRoute>
    }
  />,
  <Route
    path="/dashboard/admin/users"
    element={
      <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
        <Users />
      </ProtectedRoute>
    }
  />,
  <Route
    path="/dashboard/admin/users/create"
    element={
      <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
        <UserForm />
      </ProtectedRoute>
    }
  />,
  <Route
    path="/dashboard/admin/users/update/:id"
    element={
      <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
        <UserForm isEdit />
      </ProtectedRoute>
    }
  />,
  <Route
    path="/dashboard/admin/disasters"
    element={
      <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
        <Disasters />
      </ProtectedRoute>
    }
  />,
  <Route
    path="/dashboard/admin/disasters/create"
    element={
      <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
        <DisasterForm />
      </ProtectedRoute>
    }
  />,
  <Route
    path="/dashboard/admin/disasters/update/:id"
    element={
      <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
        <DisasterForm isEdit />
      </ProtectedRoute>
    }
  />,
  <Route
    path="/dashboard/admin/donations"
    element={
      <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
        <Donations />
      </ProtectedRoute>
    }
  />,
  <Route
    path="/dashboard/admin/donations/create"
    element={
      <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
        <DonationForm />
      </ProtectedRoute>
    }
  />,
  <Route
    path="/dashboard/admin/donations/update/:id"
    element={
      <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
        <DonationForm isEdit />
      </ProtectedRoute>
    }
  />,

  // Donor Specific
  <Route
    path="/dashboard/donor/donations/donate"
    element={
      <ProtectedRoute allowedRoles={[ROLES.DONOR]}>
        <DonationForm />
      </ProtectedRoute>
    }
  />,

  <Route
    path="/dashboard/donor/donations/"
    element={
      <ProtectedRoute allowedRoles={[ROLES.DONOR]}>
        <Donations />
      </ProtectedRoute>
    }
  />,


  <Route
    path="/dashboard/donations/view/:id"
    element={
      <ProtectedRoute allowedRoles={ALLOWED_ROLES}>
        <DonationDetail />
      </ProtectedRoute>
    }
  />,

  // Distributor Specific
  <Route
    path="/dashboard/distributor/donations"
    element={
      <ProtectedRoute allowedRoles={[ROLES.DISTRIBUTOR]}>
        <Donations />
      </ProtectedRoute>
    }
  />,
  <Route
    path="/dashboard/distributor/donations/distribute"
    element={
      <ProtectedRoute allowedRoles={[ROLES.DISTRIBUTOR]}>
        <DonationDistribution />
      </ProtectedRoute>
    }
  />,

  <Route
    path="/dashboard/distributor/donations/distributions"
    element={
      <ProtectedRoute allowedRoles={[ROLES.DISTRIBUTOR]}>
        <DonationDistributionView />
      </ProtectedRoute>
    }
  />,

  <Route
    path="/dashboard/distributor/distributions"
    element={
      <ProtectedRoute allowedRoles={[ROLES.DISTRIBUTOR]}>
        <Distributions />
      </ProtectedRoute>
    }
  />,
  <Route
    path="/dashboard/distributor/distributions/view/:id"
    element={
      <ProtectedRoute allowedRoles={[ROLES.DISTRIBUTOR]}>
        <SingleDistributionView />
      </ProtectedRoute>
    }
  />,
  <Route
    path="/dashboard/distributor/disasters"
    element={
      <ProtectedRoute allowedRoles={[ROLES.DISTRIBUTOR]}>
        <Disasters />
      </ProtectedRoute>
    }
  />,
];

export default donorRoutes;
