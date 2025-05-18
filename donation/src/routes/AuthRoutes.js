import Login from "pages/LoginPage";
import Register from "pages/RegisterPage";
import { Route } from "react-router-dom";

const authRoutes = [
  <Route key="login" path="/login" element={<Login />} />,
  <Route key="register" path="/register" element={<Register />} />,
  <Route key={"register-distributor"} path="/register/distributor" element={<Register />} />
];

export default authRoutes;
