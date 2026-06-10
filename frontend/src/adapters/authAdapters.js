const BASE = '/api/auth';

export const fetchMe = async () => {
  const res = await fetch(`${BASE}/me`);
  if (!res.ok) return null;
  return res.json(); // { user_id, username } or null
};

export const fetchRegister = async (username, password) => {
  const res = await fetch(`${BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Registration failed.');
  return data;
};

export const fetchLogin = async (username, password) => {
  const res = await fetch(`${BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed.');
  return data;
};

export const fetchLogout = async () => {
  const res = await fetch(`${BASE}/logout`, { method: 'DELETE' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Logout failed.');
  return data;
};
