import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import TextEnderecoInput from './TextEnderecoInput';

const TextCadastroUserInput = ({ name, onChangeName, cpf, onChangeCpf, email, onChangeEmail, senha, onChangeSenha, telefone, onChangeTelefone, endereco, onChangeEndereco, errors }) => {
  const getInputStyle = (fieldError) => [
    styles.input,
    fieldError && styles.inputError,
  ];
  
  return (
    <>
      <View>
        <TextInput
          style={getInputStyle(errors.name)}
          onChangeText={onChangeName}
          value={name}
          placeholder="Nome"
          keyboardType="Name"
        />
        <TextInput
          style={getInputStyle(errors.cpf)}
          onChangeText={onChangeCpf}
          value={cpf}
          placeholder="CPF"
          keyboardType="Cpf"
        />
        <TextInput
          style={getInputStyle(errors.email)}
          onChangeText={onChangeEmail}
          value={email}
          placeholder="Email"
          keyboardType="Email"
        />
        <TextInput
          style={getInputStyle(errors.senha)}
          onChangeText={onChangeSenha}
          value={senha}
          placeholder="Senha"
          keyboardType="Senha"
        />
        <TextInput
          style={getInputStyle(errors.telefone)}
          onChangeText={onChangeTelefone}
          value={telefone}
          placeholder="Telefone"
          keyboardType="Telefone"
        />
        
        <TextEnderecoInput 
          endereco={endereco} 
          onChangeEndereco={onChangeEndereco} 
          errors={errors.endereco}
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

export default TextCadastroUserInput;