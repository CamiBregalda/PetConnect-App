import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { urlIp } from '@env';


export default function InicialUser() {
  const route = useRoute();
  const { userId } = route.params;
  const [userInfo, setUserInfo] = useState(null);
  const navigation = useNavigation();

  const temFoto = true;
  const getUserInfo = async () => {
    try {

      const response = await fetch(`http://${urlIp}:3000/users/${userId}`, {

        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Erro ao buscar usuário');
      }
      const data = await response.json();
      setUserInfo(data);
      console.log('userInfo:', data);
    }
    catch (error) {
      console.error('Erro ao buscar informações do usuário:', error);
    }
  }

  useEffect(() => {
    getUserInfo();

  }, []);

  return (
    <View style={styles.container}>


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
            <Text style={styles.label}>{userInfo ? userInfo.nome : 'Carregando...'}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AtualizarUser', { userId: userId })}>
              <Ionicons name="create-outline" size={20} color="#555" />
            </TouchableOpacity>
          </View>
          <Text style={styles.description}>{userInfo ? userInfo.descricao : ''}</Text>
        </View>


        <View style={styles.infoBox}>
          <View style={styles.headerRow}>
            <Text style={styles.label}>Endereço:</Text>
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
