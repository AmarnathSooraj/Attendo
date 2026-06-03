import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AuthLayout from '../components/AuthLayout';
import Colors from '../constants/colors';
import { useAuth } from '../hooks/useAuth';

export default function LoginScreen({ navigation }) {
  const {
    employeeId,
    setEmployeeId,
    password,
    setPassword,
    loading,
    handleLogin,
  } = useAuth(navigation);

  return (
    <AuthLayout
      imageSource={require('../../assets/login.png')}
      text='Track your attendance seamlessly and stay updated.'
    >
      <View style={style.innerView}>
        <Text style={style.heading}>Login</Text>
        <TextInput
          style={style.input}
          placeholder='Employee ID'
          placeholderTextColor='#999'
          value={employeeId}
          onChangeText={setEmployeeId}
          autoCapitalize='none'
        />
        <TextInput
          style={style.input}
          placeholder='Password'
          placeholderTextColor='#999'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Text style={style.forgot}>Forgot Password?</Text>
        <TouchableOpacity style={style.button} onPress={handleLogin} disabled={loading}>
          {loading
            ? <ActivityIndicator color='#fff' />
            : <Text style={style.text}>Login</Text>
          }
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={style.signupText}>
            Don't have an account? <Text style={style.signupLink}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
}

const style = StyleSheet.create({
  heading: {
    fontWeight: '400',
    fontSize: 36,
    letterSpacing: -1.2,
  },
  innerView: {
    marginTop: 40,
    justifyContent: 'center',
    gap: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    color: '#000',
  },
  forgot: {
    textAlign: 'right',
    color: Colors.primary,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 16,
  },
  text: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '400',
    fontSize: 18,
  },
  signupText: {
    textAlign: 'center',
    color: Colors.grey,
    fontSize: 14,
  },
  signupLink: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
});