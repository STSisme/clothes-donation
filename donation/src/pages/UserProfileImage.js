import React, { useState } from 'react';
import axios from 'axios';

const UploadProfileImage = ({ userId }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = event => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('userId', userId);  // Pass the userId to associate the image

    try {
      const res = await axios.post('http://localhost:5000/api/uploadProfileImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(res.data);  // Handle the response here (e.g., display a success message)
    } catch (err) {
      console.error('Image upload error:', err);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Profile Image</button>
    </div>
  );
};

export default UploadProfileImage;
