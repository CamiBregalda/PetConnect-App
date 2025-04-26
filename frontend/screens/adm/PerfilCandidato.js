import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

function PerfilCandidato({ route }) {
  const { userId } = route.params;
  const [candidatoDetalhes, setCandidatoDetalhes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const buscarDetalhesCandidato = async () => {
      try {
        const apiUrl = `http://192.168.3.7:3000/users/${userId}`; // Assumindo que você tem um endpoint para buscar por ID

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Erro ao buscar detalhes do candidato: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
        }

        const data = await response.json();
        setCandidatoDetalhes(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    buscarDetalhesCandidato();
  }, [userId]);

  if (loading) {
    return <View style={styles.container}><ActivityIndicator size="large" color="#8A2BE2" /></View>;
  }

  if (error) {
    return <View style={styles.container}><Text style={styles.errorText}>Erro ao buscar detalhes: {error}</Text></View>;
  }

  if (candidatoDetalhes) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Detalhes do Candidato</Text>
        <Text>Nome: {candidatoDetalhes.nome}</Text>
        <Text>Idade: {candidatoDetalhes.idade}</Text>
        <Text>Contato: {candidatoDetalhes.telefone}</Text>
        {candidatoDetalhes.email && <Text>Email: {candidatoDetalhes.email}</Text>}
        {candidatoDetalhes.endereco && <Text>Endereço: {candidatoDetalhes.endereco}</Text>}
        {/* Adicione outros campos detalhados aqui */}
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default PerfilCandidato;