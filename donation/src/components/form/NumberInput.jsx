import React from 'react';

const NumberInput = ({ label, name, value, onChange, placeholder, required, min, max }) => {
  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="form-control"
        required={required}
        min={min}
        max={max}
      />
    </div>
  );
};

export default NumberInput;
