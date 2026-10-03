import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { hasValidAuthToken } from '../utils/auth.js';

const ProtectedRoute = ({ children }) => {
  return hasValidAuthToken() ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};