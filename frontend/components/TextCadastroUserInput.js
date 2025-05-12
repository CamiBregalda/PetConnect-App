import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';

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
          keyboardType="Name"
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangeCpf}
          value={cpf}
          placeholder="CPF"
          keyboardType="Cpf"
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangeEmail}
          value={email}
          placeholder="email"
          keyboardType="Email"
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangeTelefone}
          value={telefone}
          placeholder="Telefone"
          keyboardType="Telefone"
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangeEndereco}
          value={endereco}
          placeholder="Endereco"
          keyboardType="Endereco"
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

export default TextCadastroUserInput;