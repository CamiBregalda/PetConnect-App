import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Image, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AbrigoContext } from './../../AppContext';

function AnimaisAdm() {
  const navigation = useNavigation();
  const { currentAbrigoId } = useContext(AbrigoContext);
  const [todosAnimais, setTodosAnimais] = useState([]);
  const [abrigoInfo, setAbrigoInfo] = useState(null); // Novo estado para as informações do abrigo
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const buscarDados = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [animaisResponse, abrigoResponse] = await Promise.all([
        fetch('http://192.168.3.7:3000/animais/'),
        fetch(`http://192.168.3.7:3000/abrigos/${currentAbrigoId}`), // Busca as informações do abrigo
      ]);

      if (!animaisResponse.ok || !abrigoResponse.ok) {
        const errorDetails = [];
        if (!animaisResponse.ok) errorDetails.push(`Erro ao buscar animais: ${animaisResponse.status}`);
        if (!abrigoResponse.ok) errorDetails.push(`Erro ao buscar abrigo: ${abrigoResponse.status}`);
        throw new Error(errorDetails.join('\n'));
      }

      const animaisData = await animaisResponse.json();
      const abrigoData = await abrigoResponse.json();

      setTodosAnimais(animaisData);
      setAbrigoInfo(abrigoData); // Armazena as informações do abrigo
      setLoading(false);
      navigation.setOptions({ title: abrigoData?.nome || 'Animais do Abrigo' }); // Define o título com o nome do abrigo
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError(err.message);
      setLoading(false);
      navigation.setOptions({ title: 'Erro ao Carregar' });
    }
  }, [currentAbrigoId, navigation]);

  const animaisDoAbrigo = React.useMemo(() => {
    if (currentAbrigoId && todosAnimais.length > 0) {
      return todosAnimais.filter(animal => animal.idDono === currentAbrigoId);
    }
    return [];
  }, [todosAnimais, currentAbrigoId]);

  const exibirDetalhesAnimal = (animal) => {
    navigation.navigate('PerfilAnimal', { animalId: animal.id });
  };

  useFocusEffect(
    useCallback(() => {
      if (currentAbrigoId) {
        buscarDados();
      } else {
        setLoading(false);
        setTodosAnimais([]);
        setAbrigoInfo(null);
        navigation.setOptions({ title: 'Animais do Abrigo' });
      }
    }, [currentAbrigoId, buscarDados, navigation])
  );

  if (loading) {
    return <View style={styles.container}><ActivityIndicator size="large" color="#8A2BE2" /></View>;
  }

  if (error) {
    return <View style={styles.container}><Text style={styles.errorText}>{error}</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{abrigoInfo?.nome ? `Animais de ${abrigoInfo.nome}` : 'Animais do Abrigo'}</Text>
      {animaisDoAbrigo.length > 0 ? (
        <FlatList
          data={animaisDoAbrigo}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => exibirDetalhesAnimal(item)} style={styles.animalItem}>
              {item.imagemUrl && (
                <Image
                  source={{ uri: `http://192.168.3.7:3000/animais/${item.id}/imagem` }}
                  style={styles.animalImage}
                />
              )}
              <Text style={styles.animalName}>{item.nome}</Text>
              {/* Renderize outras informações do animal */}
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text>Nenhum animal encontrado neste abrigo.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 15,
    textAlign: 'center',
  },
  animalItem: {
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  animalImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  animalName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AnimaisAdm;