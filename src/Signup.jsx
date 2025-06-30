import { useState } from 'react';
import { apiRequest } from './api.jsx';

export default function Signup({ onSignup }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('RIDER');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await apiRequest('/auth/signup', 'POST', { name, email, password, role });
      setSuccess('Signup successful! You can now log in.');
      onSignup && onSignup();
    } catch (err) {
      setError('Signup failed: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Name"
        className="w-full border rounded px-3 py-2 bg-white text-gray-900"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full border rounded px-3 py-2 bg-white text-gray-900"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full border rounded px-3 py-2 bg-white text-gray-900"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <select
        className="w-full border rounded px-3 py-2 bg-white text-gray-900"
        value={role}
        onChange={e => setRole(e.target.value)}
      >
        <option value="RIDER">Rider</option>
        <option value="DRIVER">Driver</option>
      </select>
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        Sign Up
      </button>
    </form>
  );
} 