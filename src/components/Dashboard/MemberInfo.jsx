import PropTypes from 'prop-types';

const MemberInfo = ({ user }) => {
  if (!user) return <p>No member information found.</p>;

  return (
      <section className="user-info-container">
        <p className="profile-detail-label">Member details</p>
        <h2>{user.name || 'Unnamed member'}</h2>
        <div className="additional-info">
          <p><strong>Age:</strong> {user.age || 'Not provided'}</p>
          <p><strong>Gender:</strong> {user.gender || 'Not provided'}</p>
          <p><strong>Occupation:</strong> {user.occupation || 'Not provided'}</p>
          <p><strong>Hobbies:</strong> {user.hobbies?.join(', ') || 'Not provided'}</p>
        </div>
      </section>
  );
};

export default MemberInfo;

MemberInfo.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    gender: PropTypes.string,
    occupation: PropTypes.string,
    hobbies: PropTypes.arrayOf(PropTypes.string),
  }),
};