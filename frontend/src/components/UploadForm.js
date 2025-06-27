import React, { useState } from 'react';
import axios from 'axios';
import './UploadForm.css';

const UploadForm = () => {
  const [fileName, setFileName] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const uploaded = e.target.files[0];
    if (uploaded) {
      setFile(uploaded);
      setFileName(uploaded.name);
    } else {
      setFile(null);
      setFileName('');
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", desc);
  formData.append("file", file);

  try {
    const response = await fetch("http://localhost:8080/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("✅ File uploaded!");
    } else {
      alert("❌ Upload failed.");
    }
  } catch (err) {
    console.error(err);
    alert("❌ Upload error.");
  }
};



  return (
    <div className="wrapper">
      <div className="card">
        <h1>Upload Your Creative Work</h1>
        <p className="subtitle">Monetize your content directly on blockchain</p>
        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input
            type="text"
            placeholder="Enter a title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Description</label>
          <textarea
            placeholder="Brief description"
            required
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>

          <label>Upload File</label>
          <input type="file" onChange={handleFileChange} required />
          {fileName && <p className="filename">📁 {fileName}</p>}

          <button type="submit">🚀 Upload Content</button>
        </form>
      </div>
    </div>
  );
};

export default UploadForm;
