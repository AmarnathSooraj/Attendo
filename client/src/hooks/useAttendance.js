import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { clockIn, clockOut, getAttendanceHistory } from '../services/attendanceService';
import { getUser, clearSession } from '../utils/storage';

export const useAttendance = (navigation) => {
  const [user, setUser] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUser();
    fetchHistory();
  }, []);

  const loadUser = async () => {
    const stored = await getUser();
    if (stored) setUser(stored);
  };

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      const data = await getAttendanceHistory();
      if (data.success) setHistory(data.history);
    } catch (e) {
      console.error('History fetch error:', e);
    } finally {
      setHistoryLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await getAttendanceHistory();
      if (data.success) setHistory(data.history);
    } catch (e) {
      console.error('History refresh error:', e);
    } finally {
      setRefreshing(false);
    }
  };

  const handleAttendance = async (action) => {
    try {
      setLoading(true);
      const data = action === 'start' ? await clockIn() : await clockOut();

      if (data.success) {
        if (action === 'start') {
          setIsRunning(true);
          Alert.alert('Clocked In', 'Your session has started.');
        } else {
          setIsRunning(false);
          Alert.alert('Clocked Out', 'Your session has been logged.');
          fetchHistory();
        }
      } else {
        Alert.alert('Error', data.message);
        if (data.message.includes('already started')) setIsRunning(true);
        if (data.message.includes('No active')) setIsRunning(false);
      }
    } catch (e) {
      Alert.alert('Error', 'Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await clearSession();
    navigation.replace('Login');
  };

  return {
    user,
    isRunning,
    loading,
    history,
    historyLoading,
    refreshing,
    onRefresh,
    handleAttendance,
    handleLogout,
  };
};
