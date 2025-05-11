import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function PerfilAnimal({ route }) {
  const { animalId, abrigoId, animal } = route.params;
  const [AnimalDetalhes, setAnimalDetalhes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasTriedLoading, setHasTriedLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const buscarDetalhesAnimal = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://192.168.3.7:3000/animais/${animalId}`);
        const data = await response.json();
        setAnimalDetalhes(data);
      } catch (err) {
        console.error('Erro ao buscar detalhes do animal:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    buscarDetalhesAnimal();
  }, [animalId]);

  const goToHomeAdm = (abrigoId) => {
    if (abrigoId) {
      console.log(`ID do Dono (Abrigo): ${abrigoId}`);
      navigation.navigate('Main', { screen: 'Home', params: { abrigoId: abrigoId } });
    } else {
      Alert.alert('Erro', 'ID do abrigo não encontrado para navegar.');
    }
  };

  if (loading && !hasTriedLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#8A2BE2" />
      </View>
    );
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
        <Text style={styles.errorText}>Nenhum animal encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => goToHomeAdm(abrigoId)}>
          <Image
            source={require('../../img/Chat.png')}
            style={styles.homeIcon}
          />
        </TouchableOpacity>
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
          <Text style={styles.label}>Raça:</Text>
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
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 10,
  },
  homeIcon: {
    width: 30,
    height: 30,
    tintColor: '#8A2BE2',
  },
  imageView: {
    alignItems: 'center',
    marginTop: 60,
  },
  imgAdm: {
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
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: '#333',
    flex: 2,
  },
});

export default PerfilAnimal;