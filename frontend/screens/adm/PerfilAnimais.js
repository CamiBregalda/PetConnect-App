import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';

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
          <View style={styles.imageView}>
            <Image
              source={{ uri: `http://192.168.3.7:3000/animais/${AnimalDetalhes.id}/imagem` }}
              style={styles.imgAdm}
            />
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Nome:</Text>
            <Text style={styles.value}>{AnimalDetalhes.nome}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Sexo:</Text>
            <Text style={styles.value}>{AnimalDetalhes.sexo}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Data de Nascimento:</Text>
            <Text style={styles.value}>{AnimalDetalhes.dataNascimento}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Especie:</Text>
            <Text style={styles.value}>{AnimalDetalhes.especie}</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.label}>Especie:</Text>
            <Text style={styles.value}>{AnimalDetalhes.raca}</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.label}>Porte:</Text>
            <Text style={styles.value}>{AnimalDetalhes.porte}</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.label}>Castrado(a):</Text>
            <Text style={styles.value}>{AnimalDetalhes.castrado ? 'Sim' : 'Não'}</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.label}>Doencas:</Text>
            <Text style={styles.value}>{AnimalDetalhes.doencas}</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.label}>Deficiências:</Text>
            <Text style={styles.value}>{AnimalDetalhes.deficiencias}</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.label}>Sobre:</Text>
            <Text style={styles.value}>{AnimalDetalhes.informacoes}</Text>
          </View>
        </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    display: 'flex',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  imageView: {
    alignItems: 'center',
  },
  imgAdm: {
    marginTop: 20,
    width: 250,
    height: 250,
    borderRadius: 15,
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
    display: 'flex',
    backgroundColor: 'white',
    borderRadius: 15,
    margin: 5,
    padding: 15,
    elevation: 2,
    flexDirection: 'row',
    borderColor: '#8A2BE2',
    borderWidth: 1,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    color: '#333',

  },
});

export default PerfilAnimal;