import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';

function PerfilCandidato({ route }) {
  const { userId } = route.params;
  const [candidatoDetalhes, setCandidatoDetalhes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasTriedLoading, setHasTriedLoading] = useState(false);

  useEffect(() => {
    const buscarDetalhesCandidato = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://192.168.3.7:3000/users/${userId}`);
        const data = await response.json();
        setCandidatoDetalhes(data);
      } catch (err) {
        console.error('Erro:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    buscarDetalhesCandidato();
  }, []);

  if (loading && !hasTriedLoading) {
    return <View style={styles.container}><ActivityIndicator size="large" color="#8A2BE2" /></View>;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro ao buscar detalhes: {error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setError(null);
            setLoading(true);
            setHasTriedLoading(false);
            
            const buscarDetalhesCandidato = async () => {
              try {
                const response = await fetch(`http://192.168.3.7:3000/users/${userId}`);
                const data = await response.json();
                if (!data || !data.id) {
                  throw new Error('Dados do candidato inválidos');
                }
                setCandidatoDetalhes(data);
                setLoading(false);
                setHasTriedLoading(true);
              } catch (err) {
                setError(err.message);
                setLoading(false);
                setHasTriedLoading(true);
              }
            };
            buscarDetalhesCandidato();
          }}
        >
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!candidatoDetalhes && hasTriedLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Nenhum candidato encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes do Candidato</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Nome:</Text>
        <Text style={styles.value}>{candidatoDetalhes.nome}</Text>

        <Text style={styles.label}>Idade:</Text>
        <Text style={styles.value}>{candidatoDetalhes.idade}</Text>

        <Text style={styles.label}>Contato:</Text>
        <Text style={styles.value}>{candidatoDetalhes.telefone}</Text>

        {candidatoDetalhes.email && (
          <>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{candidatoDetalhes.email}</Text>
          </>
        )}

        {candidatoDetalhes.endereco && (
          <>
            <Text style={styles.label}>Endereço:</Text>
            <Text style={styles.value}>{candidatoDetalhes.endereco}</Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
    marginTop: 40,
    
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
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
});

export default PerfilCandidato;