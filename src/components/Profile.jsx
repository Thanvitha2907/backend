// src/components/Profile.jsx
import { useState, useEffect } from 'react';
import ProfileUpload from './ProfileUpload';

function Profile() {
  const [profileImage, setProfileImage] = useState('/assets/tb.jpg');
  const [showUpload, setShowUpload] = useState(false);
  
  // Fetch most recent profile image on component mount
  useEffect(() => {
    const fetchLatestImage = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/files');
        if (response.ok) {
          const data = await response.json();
          // If there are uploaded files, use the most recent one
          if (data.success && data.files && data.files.length > 0) {
            // Assume the last file is the most recent
            setProfileImage(data.files[data.files.length - 1]);
          }
        }
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };
    
    fetchLatestImage();
  }, []);
  
  const handleUploadSuccess = (filePath) => {
    setProfileImage(filePath);
    setShowUpload(false);
  };
  
  return (
    <section id="about">
      <h2>About Me</h2>
      <div className="profile-image-container">
        <img id="image" src={profileImage} alt="My Profile Picture" />
        <button 
          className="change-image-btn"
          onClick={() => setShowUpload(!showUpload)}
        >
          {showUpload ? 'Cancel' : 'Change Image'}
        </button>
      </div>
      
      {showUpload && <ProfileUpload onUploadSuccess={handleUploadSuccess} />}
      
      <p>Welcome to my personal website! I'm passionate about technology, sports, and cooking. Currently pursuing my career in computer science, I love to learn new technologies and solve challenging problems.</p>
    </section>
  );
}

export default Profile;