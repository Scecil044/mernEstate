import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function Layout() {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo ? <Outlet /> : <Navigate to="/login" />;
}
