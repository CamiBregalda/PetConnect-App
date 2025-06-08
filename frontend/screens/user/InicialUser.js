import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { urlIp } from '@env';
import MapView from './../../components/MapView'; // Componente de mapa

export default function InicialUser() {
  const route = useRoute();
  const { userId } = route.params;
  const [userInfo, setUserInfo] = useState(null);
  const navigation = useNavigation();

  // Configura header com saudação e botão de edição
  useLayoutEffect(() => {
    navigation.setOptions({
      title: userInfo ? `${userInfo.nome}` : 'Usuário',
      headerStyle: { backgroundColor: '#9333ea' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
      headerTitleAlign: 'center',
      headerRight: () => (
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('AtualizarUser', { userId })}
        >
          <Ionicons name="create-outline" size={24} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, userInfo]);

  // Busca os dados do usuário
  const getUserInfo = async () => {
    try {
      const response = await fetch(`http://${urlIp}:3000/users/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Erro ao buscar usuário');
      const data = await response.json();
      setUserInfo(data);
    } catch (error) {
      console.error('Erro ao buscar informações do usuário:', error);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  // Formata o endereço completo
  const formatarEndereco = endereco => {
    if (!endereco) return 'Endereço não informado';
    const { rua, numero, bairro, cidade, estado, cep } = endereco;
    return `${rua || ''}${numero ? ', ' + numero : ''}${
      bairro ? ' - ' + bairro : ''
    }, ${cidade || ''}${estado ? ' - ' + estado : ''}${
      cep ? ' - CEP: ' + cep : ''
    }`.trim();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {/* Foto de perfil dinâmica */}
        <Image
          source={{
            uri:
              userInfo?.imagemUrl || userInfo?.avatarUrl ||
              'https://via.placeholder.com/150'
          }}
          style={styles.profileImage}
        />

        {/* Informações básicas */}
        <View style={styles.infoBox}>
          <View style={styles.headerRow}>
            <Text style={styles.label}>
              {userInfo ? userInfo.nome : 'Carregando...'}
            </Text>
          </View>
          <Text style={styles.description}>
            {userInfo?.descricao || 'Sem descrição cadastrada.'}
          </Text>
        </View>

        {/* Endereço e Mapa */}
        <View style={styles.infoBox}>
          <Text style={styles.label}>Endereço:</Text>
          <View style={styles.mapContainer}>
            {userInfo?.endereco ? (
              <MapView enderecoAbrigo={userInfo.endereco} />
            ) : (
              <Text style={styles.text}>Endereço não disponível para o mapa.</Text>
            )}
          </View>
          <Text style={styles.addressText}>
            {formatarEndereco(userInfo?.endereco)}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: 120,
  },
  editButton: {
    marginRight: 16,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    resizeMode: 'cover',
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
    alignItems: 'center',
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
  mapContainer: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
    marginTop: 8,
  },
  text: {
    color: '#555',
    fontSize: 12,
  },
  addressText: {
    marginTop: 8,
    textAlign: 'center',
    color: '#333',
    fontSize: 14,
  },
});
