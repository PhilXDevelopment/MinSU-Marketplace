import { Navigate } from "react-router-dom";

interface GuestRouteProps {
  children: JSX.Element;
}

const GuestRoute = ({ children }: GuestRouteProps) => {
  const user = localStorage.getItem("user"); // check if logged in

  if (user) {
    // If user is logged in, redirect to dashboard/home
    return <Navigate to="/marketplace" replace />;
  }

  // Otherwise, allow access to guest page
  return children;
};

export default GuestRoute;
