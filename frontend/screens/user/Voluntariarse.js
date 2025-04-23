import React, { useState } from 'react';
import { StyleSheet, View, Keyboard, ScrollView } from 'react-native';
import TaskInput from '../../src/components/TaskInput.js';
import TaskList from '../../src/components/TaskList.js';

function Voluntariarse() {  

  // State para armazenar a lista de tarefas
  const [tasks, setTasks] = useState([]);
  const [titleInput, setTitleInput] = useState('');
  const [idadeInput, setIdadeInput] = useState('');
  const [ocupacaoInput, setOcupacaoInput] = useState('');
  const [cpfInput, setCpfInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [telefoneInput, setTelefoneInput] = useState('');
  const [enderecoInput, setEnderecoInput] = useState('');

  const handleAddTask = () => {
    const newTask = {
      id: Date.now().toString(),
      title: titleInput,
      idade: idadeInput,
      ocupacao: ocupacaoInput,
      cpf: cpfInput,
      email: emailInput,
      telefone: telefoneInput,
      endereco: enderecoInput,
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
    setTitleInput('');
    setIdadeInput('');
    setOcupacaoInput('');
    setCpfInput('');
    setEmailInput('');
    setTelefoneInput('');
    setEnderecoInput('');
    Keyboard.dismiss();
  };

  return (
    <ScrollView style={styles.scrollView}>
      
        <View style={styles.taskContainer}>
          <TaskInput
            titleValue={titleInput}
            onTitleChange={setTitleInput}
            idadeValue={idadeInput}
            onIdadeValue={setIdadeInput}
            ocupacaoValue={ocupacaoInput}
            onOcupacaoValue={setOcupacaoInput}
            cpfValue={cpfInput}
            onCpfValue={setCpfInput}
            emailValue={emailInput}
            onEmailValue={setEmailInput}
            telefoneValue={telefoneInput}
            onTelefoneValue={setTelefoneInput}
            enderecoValue={enderecoInput}
            onEnderecoValue={setEnderecoInput}
            onAddTask={handleAddTask}
          />
          <TaskList tasks={tasks} />
        </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#E7E3E3',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  taskContainer: {
    width: '90%',
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
});

export default Voluntariarse;