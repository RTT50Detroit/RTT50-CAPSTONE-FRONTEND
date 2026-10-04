import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { hasValidAuthToken, isMasterUser } from '../utils/auth.js';

const ProtectedRoute = ({ children, requiredRole }) => {
  if (!hasValidAuthToken()) return <Navigate to="/login" replace />;
  if (requiredRole === 'master' && !isMasterUser()) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string,
};