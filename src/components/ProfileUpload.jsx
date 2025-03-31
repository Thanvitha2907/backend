// src/components/ProfileUpload.jsx
import { useState } from 'react';

function ProfileUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setUploadStatus({
        type: 'error',
        message: 'Please select a file first'
      });
      return;
    }
    
    setUploading(true);
    setUploadStatus(null);
    
    try {
      // Create form data
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      // Upload the file
      const response = await fetch('http://localhost:5000/api/upload-profile', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUploadStatus({
          type: 'success',
          message: 'File uploaded successfully!'
        });
        
        // Pass the file path to parent component if needed
        if (onUploadSuccess && data.filePath) {
          onUploadSuccess(data.filePath);
        }
        
        // Reset file selection
        setFile(null);
      } else {
        setUploadStatus({
          type: 'error',
          message: data.message || 'Failed to upload file'
        });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus({
        type: 'error',
        message: 'Error connecting to server'
      });
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="profile-upload">
      <h3>Update Profile Picture</h3>
      {uploadStatus && (
        <div className={`status-message ${uploadStatus.type}`}>
          {uploadStatus.message}
        </div>
      )}
      <form onSubmit={handleUpload}>
        <div>
          <label htmlFor="profilePicture">Select Image:</label>
          <input
            type="file"
            id="profilePicture"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </div>
        <button type="submit" disabled={uploading || !file}>
          {uploading ? 'Uploading...' : 'Upload Picture'}
        </button>
      </form>
    </div>
  );
}

export default ProfileUpload;