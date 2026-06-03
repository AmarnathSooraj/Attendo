import { useState } from 'react';
import { Alert } from 'react-native';
import { verifyOtp, signup, login } from '../services/authService';
import { saveToken, saveUser } from '../utils/storage';

export const useOtp = (navigation, route) => {
  const { employeeId, email, password, name, flow = 'signup' } = route.params;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async () => {
    if (otp.length < 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit OTP.');
      return;
    }

    try {
      setLoading(true);
      const data = await verifyOtp(employeeId, otp);

      if (data.success) {
        await saveToken(data.token);
        await saveUser(data.user);
        navigation.replace('Dashboard');
      } else {
        Alert.alert('Verification Failed', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      // Resend OTP via signup route
      const data = await signup(name, email, password);

      if (data.success) {
        Alert.alert('OTP Resent', 'A new OTP has been sent to your email.');
        setOtp('');
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not connect to server.');
    } finally {
      setResending(false);
    }
  };

  return {
    otp,
    setOtp,
    loading,
    resending,
    employeeId,
    email,
    flow,
    handleVerify,
    handleResend,
  };
};
