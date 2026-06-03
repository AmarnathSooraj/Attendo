import { useState } from 'react';
import { Alert } from 'react-native';
import { login } from '../services/authService';
import { saveToken, saveUser } from '../utils/storage';

export const useAuth = (navigation) => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const trimmedId = employeeId.trim();

    if (!trimmedId || !password) {
      Alert.alert('Error', 'Please enter your Employee ID and password.');
      return;
    }

    try {
      setLoading(true);
      const data = await login(trimmedId, password);

      if (data.success) {
        // Save token and navigate directly to Dashboard
        await saveToken(data.token);
        await saveUser(data.user);
        navigation.replace('Dashboard');
      } else {
        Alert.alert('Login Failed', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return {
    employeeId,
    setEmployeeId,
    password,
    setPassword,
    loading,
    handleLogin,
  };
};
