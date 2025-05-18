import React from 'react';

const SelectInput = ({ label, name, value, options, onChange, required }) => {
  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="form-select"
        required={required}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
