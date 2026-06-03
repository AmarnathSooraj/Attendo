import API_URL from '../constants/api';
import { getToken } from '../utils/storage';

const authHeader = async () => {
  const token = await getToken();
  return { Authorization: `Bearer ${token}` };
};

export const clockIn = async () => {
  const headers = await authHeader();
  const response = await fetch(`${API_URL}/attendance/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
  });
  return await response.json();
};

export const clockOut = async () => {
  const headers = await authHeader();
  const response = await fetch(`${API_URL}/attendance/end`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
  });
  return await response.json();
};

export const getAttendanceHistory = async () => {
  const headers = await authHeader();
  const response = await fetch(`${API_URL}/attendance/history`, {
    headers,
  });
  return await response.json();
};
