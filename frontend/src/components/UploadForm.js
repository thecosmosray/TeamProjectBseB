import React, { useState } from 'react';
import './UploadForm.css';
import { useNavigate } from 'react-router-dom';
import { uploadFile } from '../services/canisterService';

const UploadForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !file) {
      alert('❗ Please fill in all fields.');
      return;
    }

    setIsUploading(true);
    setStatus('🔄 Uploading to canister...');

    try {
      console.log('Uploading to canister:', { title, description, file: file.name });
      
      const result = await uploadFile(title, description, file);
      
      if (result.hash && result.hash.length > 0) {
        const hash = result.hash[0]; // Extract from Optional
        alert(`✅ Upload successful!\nOwnership ID: ${hash}`);
        setStatus('✅ Upload successful!');
        setTitle('');
        setDescription('');
        setFile(null);

        setTimeout(() => {
          navigate('/'); // back to landing page
        }, 2000);
      } else {
        setStatus('❌ Upload failed: No hash returned');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setStatus(`❌ Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
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
          disabled={isUploading}
        />
        <textarea
          placeholder="Enter Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          disabled={isUploading}
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          required
          disabled={isUploading}
        />
        <button type="submit" disabled={isUploading}>
          {isUploading ? '🔄 Uploading...' : 'Upload'}
        </button>
      </form>

      {file && <p>📎 Selected file: {file.name}</p>}
      {status && <p className="upload-status">{status}</p>}
    </div>
  );
};

export default UploadForm;
