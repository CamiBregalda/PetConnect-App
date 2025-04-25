// src/components/TaskInput.js
import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const TaskInput = (props) => {
  const {
    titleValue,
    onTitleChange,
    idadeValue,
    onIdadeValue,
    ocupacaoValue,
    onOcupacaoValue,
    cpfValue,
    onCpfValue,
    emailValue,
    onEmailValue,
    telefoneValue, // Corrigido para telefoneValue
    onTelefoneValue,
    enderecoValue,
    onEnderecoValue,
    onAddTask,
  } = props; // Recebendo valores e funções via props

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>Candidatar-se como Voluntário!</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome Completo"
        value={titleValue}
        onChangeText={onTitleChange} // Chama a função do App.js para atualizar o state
      />
      <TextInput
      style={styles.input}
      placeholder="Idade"
      value={idadeValue}
      onChangeText={onIdadeValue}
    />
    <TextInput
        style={styles.input}
        placeholder="Ocupação"
        value={ocupacaoValue}
        onChangeText={onOcupacaoValue}
      />
      <TextInput
        style={styles.input}
        placeholder="CPF"
        value={cpfValue}
        onChangeText={onCpfValue}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={emailValue}
        onChangeText={onEmailValue}
      />
      <TextInput
        style={styles.input}
        placeholder="Telefone"
        value={telefoneValue}
        onChangeText={onTelefoneValue}
      />
      <TextInput
        style={styles.input}
        placeholder="Endereço"
        value={enderecoValue}
        onChangeText={onEnderecoValue}
      />
      <Button
        title="Candidatar-se"
        onPress={onAddTask} // Chama a função do App.js para adicionar a tarefa
        color="#8A2BE2" // Cor do botão iOS
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
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

export default TaskInput;