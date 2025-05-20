import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import TextEnderecoInput from './TextEnderecoInput';

const TextCadastroUserInput = ({ nome, onChangeNome, cpf, onChangeCpf, telefone, onChangeTelefone, idade, onChangeIdade, ocupacao, onChangeOcupacao, endereco, onChangeEndereco }) => {
  return (
    <>
      <View>
        <TextInput
          style={styles.input}
          onChangeText={onChangeNome}
          value={nome}
          placeholder="Nome"
          keyboardType="Nome"
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
          onChangeText={onChangeTelefone}
          value={telefone}
          placeholder="Telefone"
          keyboardType="Telefone"
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangeIdade}
          value={idade}
          placeholder="Idade"
          keyboardType="Idade"
        />
        
        <TextInput
          style={styles.input}
          onChangeText={onChangeOcupacao}
          value={ocupacao}
          placeholder="Ocupação"
          keyboardType="Ocupação"
        />
        <TextEnderecoInput 
          endereco={endereco} 
          onChangeEndereco={onChangeEndereco} 
          errors={null}
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
  }
});

export default TextCadastroUserInput;