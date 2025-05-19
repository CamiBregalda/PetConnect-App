// 📄 frontend/screens/user/InfoScreen.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function InfoScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('UserTabs')} style={styles.backButton}>
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Foto de perfil */}
        <View style={styles.profileCircle} />

        {/* Nome e descrição */}
        <View style={styles.infoBox}>
          <View style={styles.headerRow}>
            <Text style={styles.label}>Nome completo</Text>
            <Ionicons name="create-outline" size={20} color="#555" />
          </View>
          <Text style={styles.description}>Minha descrição super hiper mega legal!</Text>
        </View>

        {/* Endereço + Mapa */}
        <View style={styles.infoBox}>
          <View style={styles.headerRow}>
            <Text style={styles.label}>Endereço:</Text>
            <Ionicons name="create-outline" size={20} color="#555" />
          </View>
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapText}>[Mapa do Google aqui]</Text>
          </View>
          <Text style={styles.addressText}>Rua Fulano de Tall, 666</Text>
        </View>
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f1f1' },
  backButton: { marginTop: 50, marginLeft: 16 },
  backText: { color: '#9333ea', fontSize: 16 },
  scrollContainer: { alignItems: 'center', paddingVertical: 20, paddingBottom: 120 },
  profileCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#9333ea',
    marginBottom: 20,
  },
  infoBox: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  description: { fontSize: 14, color: '#555' },
  mapPlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  mapText: { color: '#555', fontSize: 12 },
  addressText: { marginTop: 8, textAlign: 'center', color: '#333', fontSize: 14 },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  navText: { fontSize: 14, color: '#9333ea' },
});
