'use client';

import { useState, useEffect, useRef } from 'react';

export default function ImageUploader({ label, onUpload }) {
  const [uploading, setUploading] = useState(false);
  const pasteInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const uploadFile = async (file) => {
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setUploading(false);
      if (data.url) onUpload(data.url);
      else alert('Upload failed');
    } catch (err) {
      setUploading(false);
      alert('Upload error: ' + err.message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    uploadFile(file);
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          uploadFile(file);
          e.preventDefault();
          break;
        }
      }
    }
  };

  useEffect(() => {
    const input = pasteInputRef.current;
    if (!input) return;

    input.addEventListener('paste', handlePaste);
    return () => input.removeEventListener('paste', handlePaste);
  }, []);

  return (
    <div className="my-4 flex justify-between">
      <label className="block mb-2 text-gray-700 font-semibold">{label}</label>

      {/* Paste Image Input (only detects paste) */}
      <input
        ref={pasteInputRef}
        placeholder="Click here and press Ctrl+V to paste image"
        className="w-[30%] border p-2 text-sm text-gray-600 rounded mb-2 focus:outline-blue-400 bg-white"

        onPaste={handlePaste}
        onChange={() => {}} // Prevent React warning
      />

      {/* File Picker Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-[30%] text-sm text-gray-600
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-md file:border-0
                   file:text-sm file:font-semibold
                   file:bg-blue-100 file:text-blue-700
                   hover:file:bg-blue-200
                   cursor-pointer transition-colors duration-200"
      />

      {uploading && (
        <p className="mt-2 text-sm text-blue-600 italic">Uploading...</p>
      )}

      
    </div>
  );
}
