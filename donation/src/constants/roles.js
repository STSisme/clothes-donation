export const ROLES = Object.freeze({
  ADMIN: "admin",
  DONOR: "donor",
  DISTRIBUTOR: "distributor",
});

export const PERMISSIONS = Object.freeze({
  [ROLES.ADMIN]: {
    manageOrganizations: true,
    verifyUsers: true,
    manageDisasters: true,
    updateDonations: true,
    removeUsers: true,
  },
  [ROLES.DONOR]: {
    donate: true,
    viewNGOs: true,
    viewOwnDonations: true,
    updateProfile: true,
  },
  [ROLES.DISTRIBUTOR]: {
    viewDisasters: true,
    manageRelief: true,
    updateProfile: true,
  },
});

export const ROUTES_BY_ROLE = {
  [ROLES.ADMIN]: [
    { path: "/dashboard/admin", label: "Dashboard" },
    { path: "/organizations/create", label: "Create Organizations" },
    { path: "/VerifyDistributors", label: "Verify Distributors" },
    { path: "/ManageDisasters", label: "Manage Disasters" },
    { path: "/UpdateDonations", label: "Update Donations" },
    { path: "/RemoveUsers", label: "Remove Users" },
  ],
  [ROLES.DONOR]: [
    { path: "/dashboard/donor", label: "Dashboard" },
    { path: "/donate", label: "Donate" },
    { path: "/donations/donor", label: "My Donations" },
    { path: "/profile/donor", label: "My Profile" },
    { path: "/all-ngos", label: "View NGOs" },
  ],
  [ROLES.DISTRIBUTOR]: [
    { path: "/dashboard/distributor", label: "Dashboard" },
    { path: "/DisastersRelief", label: "Disaster Relief" },
    { path: "/profile/distributor", label: "My Profile" },
  ],
};

export const ALLOWED_ROLES = Object.values(ROLES);
