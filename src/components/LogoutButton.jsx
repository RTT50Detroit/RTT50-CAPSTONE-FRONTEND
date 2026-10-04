import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem('authToken');
    const apiUrl = (import.meta.env.VITE_APP_BASE_URL || '').replace(/\/$/, '');

    try {
      if (token) {
        await axios.post(`${apiUrl}/api/login/logout`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      await axios.post(`${apiUrl}/api/auth/session/logout`);
    } catch (error) {
      console.error('Error updating online status on logout:', error);
    } finally {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
      navigate('/login');
    }
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Logout
    </button>
  );
};

export default LogoutButton;