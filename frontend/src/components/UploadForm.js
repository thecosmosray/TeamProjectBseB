import React, { useState } from 'react';
import './UploadForm.css';
import { useNavigate } from 'react-router-dom';

const UploadForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !file) {
      alert('❗ Please fill in all fields.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', file); // field name must be "file" (backend expects it)

    try {
      console.log('Uploading:', { title, description, file });
      const response = await fetch('http://localhost:8080/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        alert(`✅ Upload successful!\nOwnership ID: ${result.hash}`);
        setStatus('✅ Upload successful!');
        setTitle('');
        setDescription('');
        setFile(null);

        setTimeout(() => {
          navigate('/'); // back to landing page
        }, 2000);
      } else {
        setStatus('❌ Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setStatus('❌ Upload failed. Please try again.');
    }
  };

  return (
    <div className="upload-form-container">
      <h2>📤 Upload Your Content</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Enter Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <button type="submit">Upload</button>
      </form>

      {file && <p>📎 Selected file: {file.name}</p>}
      {status && <p className="upload-status">{status}</p>}
    </div>
  );
};

export default UploadForm;
