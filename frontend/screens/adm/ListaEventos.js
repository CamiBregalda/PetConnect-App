import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ListaEventos() {
  const navigation = useNavigation();

  // Simulação de eventos
  const eventos = [
    {
      id: 1,
      titulo: 'Evento 1',
      descricao: 'Evento maneiro!!',
      imagem: require('../../img/teste.png'),
    },
    {
      id: 2,
      titulo: 'Evento 2',
      descricao: 'Evento super maneiro!!',
      imagem: require('../../img/teste.png'),
    },
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll}>
        {eventos.map((evento) => (
          <TouchableOpacity
            key={evento.id}
            style={styles.eventoBox}
            onPress={() => navigation.navigate('EventoDetalhe', { evento })}
          >
            <Text style={styles.eventoTitulo}>{evento.titulo}</Text>
            <Text style={styles.eventoDescricao}>{evento.descricao}</Text>
            <Image source={evento.imagem} style={styles.eventoImagem} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    paddingTop: 50,
  },
  scroll: {
    paddingBottom: 120,
    paddingHorizontal: 16,
  },
  backButton: {
    marginLeft: 16,
    marginBottom: 10,
  },
  backText: {
    color: '#9333ea',
    fontSize: 16,
  },
  eventoBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  eventoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  eventoDescricao: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  eventoImagem: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    resizeMode: 'cover',
  },
});
