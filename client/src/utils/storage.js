import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveToken = async (token) => {
  await AsyncStorage.setItem('token', token);
};

export const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

export const saveUser = async (user) => {
  await AsyncStorage.setItem('user', JSON.stringify(user));
};

export const getUser = async () => {
  const stored = await AsyncStorage.getItem('user');
  return stored ? JSON.parse(stored) : null;
};

export const clearSession = async () => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('user');
};
