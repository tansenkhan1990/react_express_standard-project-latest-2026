import { useAppSelector } from '../hooks/useAppSelector';

const Profile: React.FC = () => {
  const { currentUser } = useAppSelector((state) => state.auth);

  const profileDetails = [
    { label: 'Full Name', value: currentUser?.name },
    { label: 'Email Address', value: currentUser?.email },
    {
      label: 'Member Since',
      value: currentUser?.createdAt
        ? new Date(currentUser.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : 'N/A',
    },
    { label: 'User ID', value: currentUser?.id },
  ];

  return (
    <div className="page-profile">
      <div className="page-header">
        <h1>Profile</h1>
        <p className="page-subtitle">Your account details</p>
      </div>

      <div className="profile-card">
        <div className="profile-avatar-section">
          <div className="profile-avatar-large">
            {currentUser?.name
              ?.split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase() || '?'}
          </div>
          <h2>{currentUser?.name}</h2>
          <span className="profile-badge">Verified Account</span>
        </div>

        <div className="profile-details">
          {profileDetails.map((detail) => (
            <div key={detail.label} className="detail-row">
              <span className="detail-label">{detail.label}</span>
              <span className="detail-value">{detail.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
