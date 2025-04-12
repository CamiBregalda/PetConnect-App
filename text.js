import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';

const TextInputExample = () => {
  const [text, onChangeText] = React.useState('');
  const [teste, onChangeSenha] = React.useState('');

  return (
    <>
      <View>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={text}
          placeholder="Username"
          keyboardType="Text"
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangeSenha}
          value={teste}
          placeholder="Password"
          keyboardType="Teste"
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
});

export default TextInputExample;