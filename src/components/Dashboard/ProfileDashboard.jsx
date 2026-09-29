// File: ProfileDashboard.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom"; // Necessary to get the "id" from the query string
import ProfileImage from "./ProfileImage.jsx";
import MemberInfo from "./MemberInfo.jsx";
import AboutMe from './aboutMe/AboutMe.jsx';
import axios from "axios";

const ProfileDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams(); // Get query params from the URL
  const id = searchParams.get("id"); // Extract the "id" parameter
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!id) {
          setError("No profile ID provided.");
          return;
        }

        const apiUrl = import.meta.env.VITE_APP_BASE_URL.replace(/\/$/, '');
        const response = await axios.get(`${apiUrl}/api/members/${id}`, { // Use the `id` to fetch specific user
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Error fetching user profile.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [id, token]);

  if (isLoading) return <p>Loading profile...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
      <div className="profile-dashboard">
        <h1>Profile Dashboard</h1>
        {userData ? (
            <>
                <ProfileImage
                  profileImageUrl={userData.profileImageUrl || userData.profileImage}
                />
              <MemberInfo user={userData} />
              <AboutMe user={userData.aboutme} />
            </>
        ) : (
             <p>No user data found.</p>
         )}
      </div>
  );
};

export default ProfileDashboard;