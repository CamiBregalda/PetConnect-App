import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function VoluntariosEvento() {
  const navigation = useNavigation();

  // Lista simulada de voluntários
  const voluntarios = [
    { id: 1, nome: 'Laura', imagem: require('../../img/teste.png') },
    { id: 2, nome: 'Flavia', imagem: require('../../img/teste.png') },
    { id: 3, nome: 'Joao', imagem: require('../../img/teste.png') },
  ];

  return (
    <View style={styles.container}>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.voltar}>
        <Ionicons name="arrow-back" size={28} color="#222" />
      </TouchableOpacity>

      <Text style={styles.titulo}>Voluntários do Evento</Text>

      <View style={styles.listaContainer}>
        {voluntarios.map((v) => (
          <View key={v.id} style={styles.voluntarioItem}>
            <Image source={v.imagem} style={styles.avatar} />
            <Text style={styles.nome}>{v.nome}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f1f1', paddingTop: 50 },
  voltar: { marginLeft: 16, marginBottom: 10 },
  voltarTexto: { color: '#9333ea', fontSize: 16 },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  listaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    flexWrap: 'wrap',
    rowGap: 20,
  },
  voluntarioItem: {
    alignItems: 'center',
    width: 80,
  },
  avatar: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 6,
  },
  nome: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
  },
});
