import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function EventosAdm() {
  const navigation = useNavigation();

   useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#9333ea',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerTitleAlign: 'center',
      title: 'Eventos', // ou o título que desejar
    });
  }, [navigation]);

  // Lista simulada de eventos
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
      
      <TouchableOpacity
        style={styles.botaoCriar}
        onPress={() => navigation.navigate('CriarEvento')}
      >
        <Text style={styles.textoBotao}>Criar Evento</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll}>
        {eventos.map((evento) => (
          <View key={evento.id} style={styles.cardContainer}>
            
            <TouchableOpacity style={styles.editIcon} onPress={() => navigation.navigate('EditarEvento', { evento })}>
              <Ionicons name="create-outline" size={20} color="#555" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('EventoDetalheAdm', { evento })}
            >
              <Text style={styles.titulo}>{evento.titulo}</Text>
              <Text style={styles.descricao}>{evento.descricao}</Text>
              <Image source={evento.imagem} style={styles.imagem} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    paddingTop: 20,
  },
  scroll: {
    paddingBottom: 120,
    paddingHorizontal: 16,
  },
  voltar: {
    marginLeft: 16,
    marginBottom: 10,
  },
  voltarTexto: {
    color: '#9333ea',
    fontSize: 16,
  },
  botaoCriar: {
    backgroundColor: '#9333ea',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    position: 'relative',
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  descricao: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  imagem: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  editIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 2,
  },
  editImage: {
    width: 20,
    height: 20,
    tintColor: '#555',
  },
});
