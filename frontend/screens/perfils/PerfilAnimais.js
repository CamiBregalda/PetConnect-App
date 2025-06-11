import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { urlIp } from '@env';

function PerfilAnimal({ route }) {
  const { animalId, abrigoId, userId } = route.params; 
  const [animalDetalhes, setAnimalDetalhes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    if (animalDetalhes) {
      navigation.setOptions({
        title: animalDetalhes.nome || 'Perfil do Animal', 
        headerShown: true,
        headerStyle: {
          backgroundColor: '#8A2BE2',
        },
        headerTintColor: 'white',
        headerTitleAlign: 'center',
      });
    } else {
      navigation.setOptions({
        title: 'Perfil do Animal',
        headerShown: true,
        headerStyle: {
          backgroundColor: '#8A2BE2',
        },
        headerTintColor: 'white',
        headerTitleAlign: 'center',
      });
    }
  }, [navigation, animalDetalhes]);

  useEffect(() => {
    const buscarDetalhesAnimal = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://${urlIp}:3000/animais/${animalId}`);
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status}`);
        }
        const data = await response.json();
        setAnimalDetalhes(data);
      } catch (err) {
        console.error('Erro ao buscar detalhes do animal:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (animalId) {
      buscarDetalhesAnimal();
    } else {
      setError("ID do animal não fornecido.");
      setLoading(false);
    }
  }, [animalId]);

  if (loading) {
    return (
      <View style={styles.centeredMessageContainer}>
        <ActivityIndicator size="large" color="#8A2BE2" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredMessageContainer}>
        <Text style={styles.errorText}>Erro ao buscar detalhes: {error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            if (animalId) {
              setLoading(true);
              setError(null);

              setAnimalDetalhes(null);

              const reFetch = async () => {
                setLoading(true);
                setError(null);
                try {
                  const response = await fetch(`http://${urlIp}:3000/animais/${animalId}`);
                  if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);
                  const data = await response.json();
                  setAnimalDetalhes(data);
                } catch (err) {
                  console.error('Erro ao buscar detalhes do animal:', err);
                  setError(err.message);
                } finally {
                  setLoading(false);
                }
              };
              reFetch();
            }
          }}
        >
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!animalDetalhes) {
    return (
      <View style={styles.centeredMessageContainer}>
        <Text style={styles.errorText}>Nenhum detalhe do animal encontrado.</Text>
      </View>
    );
  }
  const InfoRow = ({ label, value, style }) => (
    <View style={[styles.infoRowBase, style]}>
      <Text style={styles.label}>{label}: </Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
  return (
    <ScrollView style={styles.scrollContainer}>
      <Image
        source={{ uri: `http://${urlIp}:3000/animais/${animalDetalhes.id}/imagem?${Date.now()}` }}
        style={styles.animalHeaderImage}
        resizeMode="cover"
      />
      <View style={styles.detailsContainer}>

        <View style={styles.infoGridContainer}>
          <InfoRow label="Nome" value={animalDetalhes.nome} style={styles.infoGridItem} />
          <InfoRow label="Sexo" value={animalDetalhes.sexo} style={styles.infoGridItem} />

          <InfoRow label="Data de Nascimento" value={animalDetalhes.dataNascimento} style={styles.infoGridItemWide} />
          <InfoRow label="Espécie" value={animalDetalhes.especie} style={styles.infoGridItem} />
          <InfoRow label="Raça" value={animalDetalhes.raca} style={styles.infoGridItem} />
          <InfoRow label="Porte" value={animalDetalhes.porte} style={styles.infoGridItem} />
          <InfoRow label="Castrado(a)" value={animalDetalhes.castrado ? 'Sim' : 'Não'} style={styles.infoGridItem} />

          <InfoRow label="Doenças" value={animalDetalhes.doencas || 'Nenhuma informada'} style={styles.infoGridItemWide} />
          <InfoRow label="Deficiências" value={animalDetalhes.deficiencias || 'Nenhuma informada'} style={styles.infoGridItemWide} />
          <InfoRow label="Sobre" value={animalDetalhes.informacoes || 'Nenhuma informação adicional'} style={styles.infoGridItemWide} />
        </View>

        {animalDetalhes?.idDono && (
          <TouchableOpacity
            style={styles.abrigoButton}
            onPress={() => navigation.navigate('Main', { abrigoId: animalDetalhes.idDono, userId: userId })}
          >
            <Text style={styles.abrigoButtonText}>Ver Abrigo</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  animalHeaderImage: {
    width: '100%',
    height: 300,
  },
  detailsContainer: { 
    padding: 10,
  },
  infoGridContainer: { 
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoRowBase: {
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12, 
    borderColor: '#8A2BE2',
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
    alignItems: 'flex-start',
  },
  infoGridItem: { 
    width: '48.5%', 
    marginBottom: 10,
  },
  infoGridItemWide: { 
    width: '100%',
    marginBottom: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#555',
    marginRight: 5, 
  },
  value: {
    fontSize: 15,
    color: '#333',
    flexShrink: 1, 
  },
  centeredMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#8A2BE2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  abrigoButton: {
    marginTop: 20,
    backgroundColor: '#8A2BE2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 50,
  },
  abrigoButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default PerfilAnimal;