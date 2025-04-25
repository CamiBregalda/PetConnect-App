// src/components/TaskItem.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TaskItem = ({ task }) => { // Removendo onToggleComplete
  const { id, title, idade, ocupacao, cpf, email, telefone, endereco } = task;

  return (
    <View style={styles.itemContainer}>
      <View style={styles.infoContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.itemTitle}>{title}</Text>
          <Text style={styles.itemDetail}>Idade: {idade}</Text>
          <Text style={styles.itemDetail}>Ocupação: {ocupacao}</Text>
          <Text style={styles.itemDetail}>CPF: {cpf}</Text>
          <Text style={styles.itemDetail}>Email: {email}</Text>
          <Text style={styles.itemDetail}>Telefone: {telefone}</Text>
          <Text style={styles.itemDetail}>Endereço: {endereco}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: 'row', // Ícone/Texto e Botão na mesma linha
    alignItems: 'center',
    justifyContent: 'space-between', // Espaçar elementos internos
    borderWidth: 1,
    borderColor: '#eee',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Ocupa espaço disponível, empurrando o botão para a direita
    marginRight: 10, // Espaço antes do botão
  },
  textContainer: {
    flex: 1, // Permite que o texto quebre a linha se necessário
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemDetail: {
    fontSize: 13,
    color: '#666',
  },
});

export default TaskItem;