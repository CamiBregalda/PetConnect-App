// src/components/TaskList.js
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import TaskItem from './TaskItem'; // Importa o componente de item

const TaskList = ({ tasks }) => { // Removendo onToggleComplete

  // Se não houver tarefas, mostra uma mensagem
  if (tasks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nenhuma tarefa cadastrada ainda!</Text>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      <Text style={styles.listTitle}>Candidatos</Text>
      <FlatList
        data={tasks} // Array de dados
        renderItem={({ item }) => ( // Função que renderiza cada item
          <TaskItem
            task={item} // Passa o objeto da tarefa como prop para TaskItem
          />
        )}
        keyExtractor={item => item.id} // Função para extrair uma chave única para cada item
        style={styles.flatList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1, // Ocupa o espaço restante
    marginTop: 10,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
  },
  flatList: {
    // Estilos específicos para a FlatList, se necessário
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});

export default TaskList;