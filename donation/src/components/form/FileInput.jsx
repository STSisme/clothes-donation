import React from 'react';

const FileInput = ({ label, name, onChange, accept }) => {
  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <input
        type="file"
        name={name}
        onChange={onChange}
        accept={accept}
        className="form-control"
      />
    </div>
  );
};

export default FileInput;
