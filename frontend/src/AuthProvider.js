// src/AuthProvider.js
import { AuthClient } from '@dfinity/auth-client';

export const logout = async () => {
  const authClient = await AuthClient.create();
  await authClient.logout();
  window.location.href = '/'; // Redirect to landing page
};