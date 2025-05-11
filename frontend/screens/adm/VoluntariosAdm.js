import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { AbrigoContext } from './../../AppContext';
import { useNavigation } from '@react-navigation/native';

function Voluntarios() {
  const { currentAbrigoId } = useContext(AbrigoContext);
  const [Cuidadores, setCuidadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const buscarCuidadoresDoAbrigo = async () => {
      if (!currentAbrigoId) {
        setLoading(false);
        setCuidadores([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const apiUrl = `http://192.168.3.7:3000/abrigos/${currentAbrigoId}/Cuidadores`;

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Erro ao buscar voluntários: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
        }

        const data = await response.json();
        setCuidadores(data.cuidadores);
        setLoading(false);
        console.log('Cuidadores: Voluntários do abrigo carregados:', data);
      } catch (err) {
        console.error('Cuidadores: Erro ao buscar voluntários:', err);
        setError(err.message);
        setLoading(false);
        setCuidadores([]);
      }
    };

    buscarCuidadoresDoAbrigo();
  }, [currentAbrigoId]);

  const exibirPerfil = (cuidador) => {
    navigation.navigate('PerfilCuidador', { userId: cuidador.id });
  };

  if (loading) {
    return <View style={styles.container}><ActivityIndicator size="large" color="#8A2BE2" /></View>;
  }

  if (error) {
    return <View style={styles.container}><Text style={styles.errorText}>Erro ao buscar voluntários: {error}</Text></View>;
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.whiteContainer}>
        {Cuidadores.length > 0 ? (
          <View style={styles.listContainer}>
            {Cuidadores.map((cuidador, idx) => (
              <View key={idx} style={styles.itemContainer}>
                <TouchableOpacity key={cuidador.id} style={styles.listItem} onPress={() => exibirPerfil(cuidador)}>
                  <Image
                    source={{ uri: `http://192.168.3.7:3000/cuidadores/${cuidador.id}/imagem` }}
                    style={styles.listImage} />
                </TouchableOpacity>
                <Text style={styles.listItemText}>{cuidador.nome}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text>Nenhum voluntário associado a este abrigo.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#E0E0E0', // Fundo cinza claro para a tela
    padding: 20, // Adicione um pouco de padding ao redor do container branco
    
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '100%', // Ocupa toda a largura disponível
    alignItems: 'center',
  },
  listContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start', 
  },
  itemContainer: {
    padding: 10,
    marginBottom: 15,
    marginTop: 15,
    width: '50%',
    alignItems: 'center',
  },
  listImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 15,
    resizeMode: 'cover',
  },
  listItem: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
  },
  listItemText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Voluntarios;