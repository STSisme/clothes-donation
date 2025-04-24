import React from 'react';

const TextInput = ({ label, name, value, onChange, placeholder, required }) => {
  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="form-control"
        required={required}
      />
    </div>
  );
};

export default TextInput;
