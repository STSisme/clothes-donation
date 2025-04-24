import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "jquery";
import "popper.js";
import "bootstrap/dist/js/bootstrap.min";

import Home from "pages/Home";
import { AuthProvider } from "context/AuthContext";
import Layout from "components/Layout";
import authRoutes from "routes/AuthRoutes";
import dashboardRoutes from "routes/DashboardRoutes";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            {authRoutes}
            {dashboardRoutes}
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
