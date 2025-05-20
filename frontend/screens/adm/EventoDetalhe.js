import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function EventoDetalhe() {
  const navigation = useNavigation();
  const route = useRoute();
  const { evento } = route.params;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Objetivo */}
        <View style={styles.card}>
          <Text style={styles.label}>Objetivo do Evento:</Text>
          <Text style={styles.text}>{evento.objetivo || 'Um Evento muito legal! :D'}</Text>
        </View>

        {/* Endereço */}
        <View style={styles.card}>
          <Text style={styles.label}>Endereço:</Text>
          <Image source={require('../../img/PET.png')} style={styles.mapa} />
          <Text style={styles.text}>Rua Fulano de Tall, 666</Text>
        </View>

        {/* Datas */}
        <View style={styles.card}>
          <Text style={styles.label}>Data:</Text>
          <View style={styles.row}>
            <Text>Início: {evento.dataInicio || '12/05/2024'}</Text>
            <Text>Fim: {evento.dataFim || '25/05/2024'}</Text>
          </View>
        </View>

        {/* Fotos */}
        <View style={styles.card}>
          <Text style={styles.label}>Fotos</Text>
          <View style={styles.row}>
            <Image source={require('../../img/Gato.png')} style={styles.foto} />
            <Image source={require('../../img/Gato.png')} style={styles.foto} />
          </View>
        </View>

        {/* Detalhes */}
        <View style={styles.card}>
          <Text style={styles.label}>Detalhes:</Text>
          <Text style={styles.text}>{evento.detalhes || 'AAAAAAA'}</Text>
        </View>
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f1f1', paddingTop: 50 },
  scroll: { paddingBottom: 120, paddingHorizontal: 16 },
  backButton: { marginLeft: 16, marginBottom: 10 },
  backText: { color: '#9333ea', fontSize: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    marginBottom: 6,
  },
  text: { color: '#555', fontSize: 14 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
  mapa: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 8,
  },
  foto: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 8,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 12,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  navIcon: { width: 28, height: 28, resizeMode: 'contain' },
  navIconCenter: { width: 32, height: 32, resizeMode: 'contain' },
});
