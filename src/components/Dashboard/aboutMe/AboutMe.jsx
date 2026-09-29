import { useState } from 'react';
import PropTypes from 'prop-types';
import './AboutMe.css';


const AboutMe = ({ user, canEdit }) => {
  const [bio, setBio] = useState(user || 'No biography added yet.');

  const handleEdit = () => {
    const updatedBio = prompt("Edit your bio:", bio);
    if (updatedBio !== null) {
      setBio(updatedBio);
    }
  };

  return (
      <div className="user-bio">
        <h2>Bio</h2>
        <p>{bio}</p>
        {canEdit && <button onClick={handleEdit}>Edit Bio</button>}
      </div>
  );
};

export default AboutMe;

AboutMe.propTypes = {
  user: PropTypes.string,
  canEdit: PropTypes.bool,
};