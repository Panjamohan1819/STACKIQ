import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  const location = useLocation();

  // If no token exists, redirect to login but save the current location 
  // so we can send them back after they log in.
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;