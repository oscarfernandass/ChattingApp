import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [verificationId, setVerificationId] = useState(null);

  const handleSendCode = async () => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setVerificationId(confirmation.verificationId);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleVerifyCode = async () => {
    try {
      const credential = auth.PhoneAuthProvider.credential(verificationId, confirmationCode);
      await auth().signInWithCredential(credential);
      const user = auth().currentUser;
      await storeUserData(user.uid);
      navigation.navigate('Users');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const storeUserData = async (userId) => {
    try {
      await AsyncStorage.setItem('USERNAME', name);
      await AsyncStorage.setItem('UID', userId);
      await AsyncStorage.setItem('MOBILE', phoneNumber);
      
      await firestore().collection('users').doc(userId).set({
        mobile: phoneNumber,
        userId: userId,
        name: name,
      });
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <Button title="Send Code" onPress={handleSendCode} />

      {verificationId && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Verification Code"
            value={confirmationCode}
            onChangeText={setConfirmationCode}
          />
          <Button title="Verify Code" onPress={handleVerifyCode} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  input: {
    width: '80%',
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    fontSize: 16,
    color: 'black',
  },
});

export default Login;
