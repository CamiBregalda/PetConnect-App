import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

function PerfilAnimal({ route }) {
  const { animalId } = route.params;
  const [AnimalDetalhes, setAnimalDetalhes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasTriedLoading, setHasTriedLoading] = useState(false);

  useEffect(() => {
    const buscarDetalhesAnimal = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://192.168.3.7:3000/animais/${animalId}`);
        const data = await response.json();
        setAnimalDetalhes(data);
      } catch (err) {
        console.error('Erro:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    buscarDetalhesAnimal();
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
            
            const buscarDetalhesAnimal = async () => {
              try {
                const response = await fetch(`http://192.168.3.7:3000/animais/${animalId}`);
                const data = await response.json();
                if (!data || !data.id) {
                  throw new Error('Dados do Animal inválidos');
                }
                setAnimalDetalhes(data);
                setLoading(false);
                setHasTriedLoading(true);
              } catch (err) {
                setError(err.message);
                setLoading(false);
                setHasTriedLoading(true);
              }
            };
            buscarDetalhesAnimal();
          }}
        >
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!AnimalDetalhes && hasTriedLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Nenhum Animal encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes do Animal</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Nome:</Text>
        <Text style={styles.value}>{AnimalDetalhes.nome}</Text>

        <Text style={styles.label}>Sexo:</Text>
        <Text style={styles.value}>{AnimalDetalhes.sexo}</Text>

        <Text style={styles.label}>Data de Nascimento:</Text>
        <Text style={styles.value}>{AnimalDetalhes.dataNascimento}</Text>

        <Text style={styles.label}>Especie:</Text>
        <Text style={styles.value}>{AnimalDetalhes.especie}</Text>

        <Text style={styles.label}>Porte:</Text>
        <Text style={styles.value}>{AnimalDetalhes.porte}</Text>

        <Text style={styles.label}>Castrado(a):</Text>
        <Text style={styles.value}>{AnimalDetalhes.castrado}</Text>

        <Text style={styles.label}>Doencas:</Text>
        <Text style={styles.value}>{AnimalDetalhes.doencas}</Text>
        
        <Text style={styles.label}>Doencas:</Text>
        <Text style={styles.value}>{AnimalDetalhes.doencas}</Text>

        <Text style={styles.label}>Doenças:</Text>
        <Text style={styles.value}>{AnimalDetalhes.doencas}</Text>

        <Text style={styles.label}>Deficiências:</Text>
        <Text style={styles.value}>{AnimalDetalhes.deficiencias}</Text>

        <Text style={styles.label}>Sobre:</Text>
        <Text style={styles.value}>{AnimalDetalhes.doencas}</Text>
      </View>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    marginTop: 40,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#8A2BE2',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
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

export default PerfilAnimal;