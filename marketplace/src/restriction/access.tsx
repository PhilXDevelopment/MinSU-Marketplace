
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: JSX.Element;
}
const PrivateRoute = ({ children }: PrivateRouteProps) => {

  const user = localStorage.getItem("user"); // check if logged in

  if (!user) {
    return <Navigate to="/auth/signin" replace />;
  }
  return children;
};

export default PrivateRoute;
