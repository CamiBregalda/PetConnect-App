import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { urlIp } from '@env';
import MapView from './../../components/MapView'; 

export default function InicialUser() {
  const route = useRoute();
  const { userId } = route.params;
  const [userInfo, setUserInfo] = useState(null);
  const navigation = useNavigation();


  const handleAdminAbrigo = async () => {
    try {
      const response = await fetch(`http://${urlIp}:3000/admAbrigo/${userId}/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar abrigo');
      }

      const data = await response.json();

      fetch(`http://${urlIp}:3000/admAbrigo/${data.id}/abrigo`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });;
      if (resAdmin.status === 404) {
        navigation.navigate('CadastroAbrigo');
        return;
      }
      if (!resAdmin.ok) {
        throw new Error('Não foi possível verificar dados do abrigo.');
      }
      const adminData = await resAdmin.json();
      console.log('🏠 handleAdminAbrigo adminData =', adminData);
      const abrigoId = adminData.abrigoId || adminData.idAbrigo || adminData.id;
      if (!abrigoId) {
        throw new Error('Campo abrigoId não retornado pela API de admAbrigo.');
      }
      navigation.navigate('AtualizarAbrigo', { userId, abrigoId });
    } catch (err) {
      console.error('Erro ao buscar adminAbrigo:', err);
      Alert.alert('Erro', err.message.includes('abrigoId') ? err.message : 'Falha na conexão ao servidor.');
    }
  };

  // Configura header com saudação e botão de casa
  useLayoutEffect(() => {
    navigation.setOptions({
      title: userInfo ? `${userInfo.nome}` : 'Usuário',
      headerStyle: { backgroundColor: '#9333ea' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
      headerTitleAlign: 'center',
      headerRight: () => (
        <TouchableOpacity onPress={handleAdminAbrigo} style={styles.homeButton}>
          <Ionicons name="home-outline" size={24} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, userInfo]);

  // Busca informações do usuário
  const getUserInfo = async () => {
    try {
      const response = await fetch(`http://${urlIp}:3000/users/${userId}`);
      const data = await response.json();
      setUserInfo(data);
    } catch (error) {
      console.error('Erro ao buscar informações do usuário:', error);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  if (!userInfo) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Foto de perfil */}
      <Image
        source={{
          uri:
            userInfo.imagemUrl ||
            userInfo.avatarUrl ||
            'https://via.placeholder.com/150'
        }}
        style={styles.profileImage}
      />

      {/* Card com nome, descrição e botão de editar */}
      <View style={styles.infoBox}>
        <View style={styles.headerRow}>
          <Text style={styles.label}>{userInfo.nome}</Text>
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => navigation.navigate('AtualizarUser', { userId })}
          >
            <Ionicons name="create-outline" size={20} color="#9333ea" />
          </TouchableOpacity>
        </View>
        <Text style={styles.description}>
          {userInfo.descricao || 'Sem descrição cadastrada.'}
        </Text>
      </View>

      {/* Endereço e Mapa */}
      <View style={styles.infoBox}>
        <Text style={styles.label}>Endereço:</Text>
        <Text style={styles.addressText}>
          {userInfo.endereco
            ? `${userInfo.endereco.rua}, ${userInfo.endereco.numero} - ${userInfo.endereco.bairro}, ${userInfo.endereco.cidade} - ${userInfo.endereco.estado}, ${userInfo.endereco.cep}`
            : 'Sem endereço.'}
        </Text>
        <View style={styles.mapContainer}>
          {userInfo.endereco && (
            <MapView enderecoAbrigo={userInfo.endereco} />
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginVertical: 20,
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
  editProfileButton: {
    padding: 4,
  },
  homeButton: {
    marginRight: 16,
  },
  addressText: {
    marginTop: 8,
    textAlign: 'center',
    color: '#333',
    fontSize: 14,
  },
  mapContainer: {
    marginTop: 8,
    width: '100%',
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
  },
});
