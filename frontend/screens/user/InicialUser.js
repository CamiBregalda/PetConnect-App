import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function InicialUser() {
  const navigation = useNavigation();
  const route = useRoute();

  const temFoto = true;

  return (
    <View style={styles.container}>
      
      <TouchableOpacity onPress={() => navigation.navigate('TelaPrincipal')} style={styles.backButton}>
        <Image source={require('../../img/seta.png')} style={styles.backIcon} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {temFoto ? (
          <Image source={require('../../img/teste.png')} style={styles.profileImage} />
        ) : (
          <View style={styles.profilePlaceholder}>
            <Text style={styles.placeholderText}>Sem foto</Text>
          </View>
        )}

        
        <View style={styles.infoBox}>
          <View style={styles.headerRow}>
            <Text style={styles.label}>Nome completo</Text>
            <Ionicons name="create-outline" size={20} color="#555" />
          </View>
          <Text style={styles.description}>Minha descrição super hiper mega legal!</Text>
        </View>

  
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

      
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('AnimaisUser')}>
          <Image source={require('../../img/Animais_Active.png')} style={styles.navIcon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('InicialUser')}>
          <Image source={require('../../img/Home_Active.png')} style={styles.navIconCenter} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('RegistroAbandono')}>
          <Image source={require('../../img/Profile_Active.png')} style={styles.navIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f1f1' },
  backButton: { marginTop: 50, marginLeft: 16 },
  backIcon: { width: 24, height: 24, resizeMode: 'contain' },
  scrollContainer: { alignItems: 'center', paddingVertical: 20, paddingBottom: 120 },

  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  profilePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#9333ea',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  placeholderText: {
    color: '#fff',
    fontSize: 14,
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
    paddingBottom: 55,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  navIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  navIconCenter: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
});
