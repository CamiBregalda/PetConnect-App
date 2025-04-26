import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function ListaCandidatosScreen() {
  const [cadastroInfo, setCadastroInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const buscarCadastro = async () => {
      try {
        const apiUrl = 'http://192.168.3.7:3000/users';

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Erro ao buscar informações: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
        }

        const data = await response.json();
        setCadastroInfo(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    buscarCadastro();
  }, []);

  const exibirDetalhes = (userId) => {
    navigation.navigate('Perfil', { userId: userId });
  };

  if (loading) {
    return <View style={styles.container}><ActivityIndicator size="large" color="#8A2BE2" /></View>;
  }

  if (error) {
    return <View style={styles.container}><Text style={styles.errorText}>Erro ao buscar informações: {error}</Text></View>;
  }

  if (cadastroInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Candidatos para Abrigo:</Text>
        {Array.isArray(cadastroInfo) && cadastroInfo.map((user, idx) => (
          <TouchableOpacity key={idx} style={styles.box} onPress={() => exibirDetalhes(user.id)}>
            <Text style={styles.text}>Nome: {user.nome}</Text>
            <Text style={styles.text}>Idade: {user.idade}</Text>
            <Text style={styles.text}>Contato: {user.telefone}</Text>
            {/* Adicione outros campos que você quer exibir na lista */}
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  box: {
    marginBottom: 10,
    backgroundColor: '#8A2BE2',
    padding: 15,
    borderRadius: 15,
  },
  text: {
    color: 'white',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ListaCandidatosScreen;