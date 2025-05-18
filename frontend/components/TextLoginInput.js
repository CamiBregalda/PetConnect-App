import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';

const TextLoginInput = ({ username, onChangeUsername, password, onChangePassword, errors }) => {
  const getInputStyle = (fieldError) => [
    styles.input,
    fieldError && styles.inputError,
  ];

  return (
    <>
      <View>
        <TextInput
          style={getInputStyle(errors.username)}
          onChangeText={onChangeUsername}
          value={username}
          placeholder="Username"
          keyboardType="Username"
        />
        <TextInput
          style={getInputStyle(errors.password)}
          onChangeText={onChangePassword}
          value={password}
          placeholder="Password"
          keyboardType="Password"
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    width: 280,
    height: 40,
    margin: 10,
    borderRadius: 30,
    borderWidth: 0.2,
    borderBottomWidth: 1,
    padding: 10,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
    shadowColor: 'red',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
  },
});

export default TextLoginInput;