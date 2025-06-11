import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { urlIp } from '@env';
import MapView from './../../components/MapView';

export default function InicialUser() {
  const navigation = useNavigation();
  const route = useRoute();
  const userId = route.params?.userId;

  const [userInfo, setUserInfo] = useState(null);

  const getUserInfo = async () => {
    try {
      if (!userId) throw new Error('ID do usuário não fornecido.');
      const response = await fetch(`http://${urlIp}:3000/users/${userId}`);
      if (!response.ok) throw new Error('Erro ao buscar informações do usuário.');
      const data = await response.json();
      setUserInfo(data);
    } catch (error) {
      console.error('Erro ao buscar informações do usuário:', error);
      Alert.alert('Erro', error.message || 'Falha na conexão ao servidor.');
    }
  };

  useEffect(() => {
    getUserInfo();
  }, [userId]);

  const handleAdminAbrigo = async () => {
  try {
    if (!userId) throw new Error('ID do usuário não fornecido.');

    const resAdminRecord = await fetch(`http://${urlIp}:3000/admAbrigo/${userId}/user`);

    const text = await resAdminRecord.text();
    console.log('resAdminRecord status:', resAdminRecord.status);
    console.log('resAdminRecord body:', text);

    let adminData;
    try {
      adminData = JSON.parse(text);
    } catch {
      adminData = text;
    }

    const noRecord =
      resAdminRecord.status === 404 ||
      resAdminRecord.status === 204 ||
      adminData == null ||
      (typeof adminData === 'string' && adminData.trim() === '') ||
      (Array.isArray(adminData) && adminData.length === 0) ||
      (typeof adminData === 'object' && !adminData.id && !adminData.adminAbrigoId);

    if (noRecord) {
      navigation.navigate('CadastroAbrigo', { userId });
      return;
    }

    if (Array.isArray(adminData)) {
      adminData = adminData[0];
    }

    const adminAbrigoId = adminData.id || adminData.adminAbrigoId;
    if (!adminAbrigoId) {
      console.warn('Nenhum ID encontrado em adminData:', adminData);
      navigation.navigate('CadastroAbrigo', { userId });
      return;
    }

    const resAbrigo = await fetch(`http://${urlIp}:3000/admAbrigo/${adminAbrigoId}/abrigo`);
    if (resAbrigo.status === 404 || resAbrigo.status === 204) {
      navigation.navigate('CadastroAbrigo', { userId });
      return;
    }
    if (!resAbrigo.ok) throw new Error('Erro ao buscar dados do abrigo.');
    const abrigoData = await resAbrigo.json();
    const abrigoId =
      abrigoData.abrigo?.id ??
      abrigoData.abrigoId ??
      abrigoData.id ??
      abrigoData.idAbrigo;
    if (!abrigoId) throw new Error('Campo abrigoId não retornado pela API.');

    navigation.navigate('Main', { userId, abrigoId });

  } catch (err) {
    console.error('Erro no handleAdminAbrigo:', err);
    Alert.alert('Erro', err.message || 'Falha na conexão ao servidor.');
  }
};

  useLayoutEffect(() => {
    navigation.setOptions({
      title: userInfo ? `${userInfo.nome}` : 'Usuário',
      headerStyle: { backgroundColor: '#9333ea' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
      headerTitleAlign: 'center',
      headerRight: () => (
        <TouchableOpacity onPress={handleAdminAbrigo} style={styles.homeButton}>
          <Ionicons name="home-outline" size={30} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, userInfo]);

  if (!userInfo) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: `http://${urlIp}:3000/users/${userId}/imagem?${Date.now()}` }}
        style={styles.profileImage}
        onError={(e) => console.log('Erro img usuário:', e.nativeEvent.error)}
      />
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
        <Text style={styles.description}>{userInfo.descricao || 'Sem descrição cadastrada.'}</Text>
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Endereço:</Text>
        <Text style={styles.addressText}>
          {userInfo.endereco
            ? `${userInfo.endereco.rua}, ${userInfo.endereco.cidade} - ${userInfo.endereco.estado}, ${userInfo.endereco.cep}`
            : 'Sem endereço.'}
        </Text>
        <View style={styles.mapContainer}>
          {userInfo.endereco && <MapView enderecoAbrigo={userInfo.endereco} />}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  container: {
    alignItems: 'center', 
    padding: 16, 
    backgroundColor: '#f5f5f5'
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#e0e0e0',
    marginBottom: 20,
  },
  infoBox: {
    width: '90%', 
    backgroundColor: '#fff', 
    borderRadius: 10, padding: 16,
    marginBottom: 16, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, 
    shadowRadius: 2, 
    elevation: 2
  },
  headerRow: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 8
  },
  label: { 
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333', 
  },
  description: { 
    fontSize: 16,
    color: '#555',
    textAlign: 'justify',
    lineHeight: 22,
  },
  editProfileButton: { 
    size:30,
    color: 'white',
  },
  homeButton: { 
    marginRight: 16 
  },
  addressText: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 20,
  },
  mapContainer: {
   width: '100%',
    height: 200, // Defina a altura desejada para o mapa
    borderRadius: 8,
    overflow: 'hidden', // Importante para o borderRadius do WebView funcionar
    backgroundColor: '#e0e0e0',
  },
});
