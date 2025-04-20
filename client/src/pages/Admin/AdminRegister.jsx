import React, { useState } from 'react';

const AdminRegister = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/admin/register-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.success) {
        setResponseMessage('Admin registered successfully!');
      } else {
        setResponseMessage(result.message);
      }
    } catch (error) {
      setResponseMessage('Registration failed, please try again.');
    }
  };

  return (
    <div className="register-container">
      <h1>Admin Registration</h1>
      <form id="admin-register-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Register</button>
      </form>

      <div
        id="response-message"
        style={{ color: responseMessage.includes('success') ? 'green' : 'red' }}
      >
        {responseMessage}
      </div>
    </div>
  );
};

export default AdminRegister;
