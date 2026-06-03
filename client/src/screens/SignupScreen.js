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
import { useSignup } from '../hooks/useSignup';

export default function SignupScreen({ navigation }) {
  const {
    name, setName,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    loading,
    handleSignup,
  } = useSignup(navigation);

  return (
    <AuthLayout
      imageSource={require('../../assets/signup.png')}
      text='Create your account to start tracking attendance.'
    >
      <View style={style.view}>
        <Text style={style.heading}>Sign Up</Text>
        <View style={style.innerView}>
          <TextInput
            style={style.input}
            placeholder='Full Name'
            placeholderTextColor='#999'
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={style.input}
            placeholder='Email'
            placeholderTextColor='#999'
            value={email}
            onChangeText={setEmail}
            keyboardType='email-address'
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
          <TextInput
            style={style.input}
            placeholder='Confirm Password'
            placeholderTextColor='#999'
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <TouchableOpacity style={style.button} onPress={handleSignup} disabled={loading}>
            {loading
              ? <ActivityIndicator color='#fff' />
              : <Text style={style.text}>Sign Up</Text>
            }
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={style.loginText}>
              Already have an account? <Text style={style.loginLink}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
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
  view: {
    justifyContent: 'center',
    flex: 1,
    gap: 20,
  },
  innerView: {
    gap: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 16,
  },
  text: {
    textAlign: 'center',
    fontWeight: '400',
    color: '#fff',
    fontSize: 18,
  },
  loginText: {
    textAlign: 'center',
    color: Colors.grey,
    fontSize: 14,
  },
  loginLink: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
});