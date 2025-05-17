import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login with current path for redirect after login
    return (
      <Navigate 
        to={`/login?redirect=${location.pathname}${location.search}`} 
      />
    );
  }

  return children;
};
export default ProtectedRoute;