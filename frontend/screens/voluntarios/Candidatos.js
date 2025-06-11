import React, { useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { urlIp } from '@env';

function ListaCandidatosScreen() {
  const route = useRoute();
  const { abrigoId } = route.params || {};
  const [candidatos, setCandidatos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const buscarCandidatos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = `http://${urlIp}:3000/candidaturas/abrigo/${abrigoId}`;

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

  const exibirDetalhes = (userId, candidaturaId, abrigoId) => {
    navigation.navigate('PerfilCandidato', { userId: userId, candidaturaId: candidaturaId, abrigoId: abrigoId });
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
          {candidatos?.map((candidato, idx) => (
            candidato && candidato.nome ? (
              <TouchableOpacity
                key={idx}
                style={styles.box}
                onPress={() => exibirDetalhes(candidato.userId, candidato.id, candidato.abrigoId)}
              >
                <Text style={styles.text}>Nome: {candidato.nome}</Text>
                <Text style={styles.text}>Idade: {candidato.idade ?? 'Não informado'}</Text>
                <Text style={styles.text}>Contato: {candidato.telefone ?? 'Não informado'}</Text>
                <Text style={styles.text}>Email: {candidato.email ?? 'Não informado'}</Text>
              </TouchableOpacity>
            ) : null
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