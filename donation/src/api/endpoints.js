const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
  },
  organizations: {
    all: '/organizations',
    create: '/organizations/create',
    delete: (id) => `/organizations/delete/${id}`,
    detail: (id) => `/organizations/detail/${id}`,
    update: (id) => `/organizations/update/${id}`,
  },
  donations: {
    all: '/donations',
    allWithItems: '/donations/items',
    getAllByOrganization: (id) => `/donations/organizations/${id}`,
    getAllByDonor: (id) => `/donations/donors/${id}`,
    create: '/donations/create',
    detail: (id) => `/donations/detail/${id}`,
    update: (id) => `/donations/update/${id}`,
    delete: (id) => `/donations/delete/${id}`,
    approve: (id) => `/donations/approve/${id}`,
    leaderboard: "/donations/leaderboard"
  },
  users: {
    all: '/users',
    create: '/users/create',
    approve: (id) => `/users/approve/${id}`,
    detail: (id) => `/users/detail/${id}`,
    update: (id) => `/users/update/${id}`,
    delete: (id) => `/users/delete/${id}`,
    usersWithRole: (role) => `/users/${role}`
  },
  disasters: {
    all: '/disasters',
    create: '/disasters/create',
    detail: (id) => `/disasters/detail/${id}`,
    update: (id) => `/disasters/update/${id}`,
    delete: (id) => `/disasters/delete/${id}`,
    notify: (userId, disasterId) => `/disasters/notify/${userId}/${disasterId}`
  },
  distributions: {
    all: (id) => `/distributions/all/${id}`,
    single: (id) => `/distributions/${id}`,
    getByDonor: (id) => `/distributions/donors/${id}`,
    create: '/distributions/create'
  }
};

export default endpoints;
