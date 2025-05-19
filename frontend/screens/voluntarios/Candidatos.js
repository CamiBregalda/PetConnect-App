import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

function ListaCandidatosScreen() {
  const [candidatos, setCandidatos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const buscarCandidatos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = 'http://192.168.3.20:3000/candidaturas';

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro ao buscar candidatos: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
      }

      const data = await response.json();
      setCandidatos(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      buscarCandidatos();
    }, [buscarCandidatos])
  );

  const exibirDetalhes = (userId, candidaturaId) => {
    console.log(`ID da candidatura: ${candidaturaId}`);
    navigation.navigate('PerfilCandidato', { userId: userId, candidaturaId: candidaturaId });
  };

  if (loading) {
    return <View style={styles.container}><ActivityIndicator size="large" color="#8A2BE2" /></View>;
  }

  if (error) {
    return <View style={styles.container}><Text style={styles.errorText}>Erro ao buscar informações: {error}</Text></View>;
  }

  if (candidatos) {
    if (Array.isArray(candidatos) && candidatos.length > 0) {
      return (
        <View style={styles.container}>
          {candidatos.map((candidato, idx) => (
            <TouchableOpacity key={idx} style={styles.box} onPress={() => exibirDetalhes(candidato.userId, candidato.id)}>
              <Text style={styles.text}>Nome: {candidato.nome}</Text>
              <Text style={styles.text}>Idade: {candidato.idade}</Text>
              <Text style={styles.text}>Contato: {candidato.telefone}</Text>
              <Text style={styles.text}>Email: {candidato.email}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Text style={styles.emptyText}>Não há inscrições no momento.</Text>
        </View>
      );
    }
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
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#555',
  },
});

export default ListaCandidatosScreen;