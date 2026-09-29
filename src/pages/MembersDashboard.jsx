import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import ProfileCards from "../components/ProfileCard/ProfileCards"; // Ensure path is correct

const MembersDashboard = () => {
  const [profiles, setProfiles] = useState([]); // State to store profiles
  const [isLoading, setIsLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState(null); // State to manage errors
  const apiUrl = import.meta.env.VITE_APP_BASE_URL; // Backend URL from env variable
  const token = localStorage.getItem("authToken"); // Get token from local storage
  let loginName = "Member";

  try {
    const tokenPayload = jwtDecode(token);
    loginName = tokenPayload.loginName || tokenPayload.username ||
      tokenPayload.name || tokenPayload.email || loginName;
  } catch {
    // Keep the dashboard usable when the token has no readable identity claim.
  }

  // Function to fetch profiles
  const fetchProfiles = async () => {
    try {
      setIsLoading(true); // Start loading
      setError(null); // Clear previous errors

      // Axios GET request
      const response = await axios.get(`${apiUrl}/api/members`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfiles(response.data || []); // Set profiles in state
    } catch (err) {
      console.error("Error fetching profiles:", err);
      setError(
          err.response?.data?.message || "Failed to load profile cards. Please try again."
      );
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // Fetch profiles on component mount
  useEffect(() => {
    fetchProfiles();
  }, []);

  return (
      <div>
        <h1>Dashboard</h1>
        <p>Login name: {loginName}</p>

        {/* Loading Indicator */}
        {isLoading && <p>Loading profiles...</p>}

        {/* Error Message */}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Profile Cards Section */}
        {!isLoading && !error && (
            <section>
              <h2>Profile Cards</h2>
              {profiles.length === 0 ? (
                  <p>No profiles found.</p> // No profiles message
              ) : (
                   <ProfileCards profiles={profiles} /> // Pass profiles as props
               )}
            </section>
        )}
      </div>
  );
};

export default MembersDashboard;