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
    <View style={styles.divCadastro}>
    <ScrollView>
      
        
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
        
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  divCadastro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', // Centraliza o conteúdo na tela de login
    backgroundColor: 'white',
    padding: 20, // Adicionado um padding para o conteúdo não ficar nas bordas
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 40,
  },
  botao: {
    backgroundColor: '#8A2BE2',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 80,
    elevation: 3,
    marginTop: 50,
  },
  textoBotao: {
    color: 'white',
    fontSize: 16,
  },
});

export default Voluntariarse;