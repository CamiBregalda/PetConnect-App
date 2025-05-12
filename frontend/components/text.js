import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';

const TextLoginInput = () => {
  const [username, onChangeUsername] = React.useState('');
  const [password, onChangePassword] = React.useState('');

  return (
    <>
      <View>
        <TextInput
          style={styles.input}
          onChangeText={onChangeUsername}
          value={username}
          placeholder="Username"
          keyboardType="Username"
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangePassword}
          value={password}
          placeholder="Password"
          keyboardType="Password"
        />
      </View>
    </>
  );
};

const TextCadastroUserInput = () => {
  const [name, onChangeName] = React.useState('');
  const [cpf, onChangeCpf] = React.useState('');
  const [email, onChangeEmail] = React.useState('');
  const [telefone, onChangeTelefone] = React.useState('');
  const [endereco, onChangeEndereco] = React.useState('');

  return (
    <>
      <View>
        <TextInput
          style={styles.input}
          onChangeText={onChangeName}
          value={name}
          placeholder="Name"
          keyboardType="Text"
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangeCpf}
          value={cpf}
          placeholder="CPF"
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

export default TextLoginInput;