import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Image, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'; // Adicionado useRoute
import { AbrigoContext } from './../../AppContext';
import { urlIp } from '@env';

function AnimaisAdm() { // Removido route como prop
  const navigation = useNavigation();
  const route = useRoute(); // Hook para acessar os parâmetros da rota
  const { userId } = route.params || {}; // Acessa userId passado via initialParams
  console.log('AnimaisAdm - userId from route.params:', userId);

  const { currentAbrigoId } = useContext(AbrigoContext);
  const [todosAnimais, setTodosAnimais] = useState([]);
  const [abrigoInfo, setAbrigoInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const buscarDados = useCallback(async () => {
    console.log('AnimaisAdm buscarDados - currentAbrigoId:', currentAbrigoId, 'userId:', userId);
    setLoading(true);
    setError(null);
    try {
      // Adapte as URLs se precisarem do userId
      const [animaisResponse, abrigoResponse] = await Promise.all([
        fetch(`http://${urlIp}:3000/animais/`), // Esta rota busca todos, depois filtramos. OK.
        fetch(`http://${urlIp}:3000/abrigos/${currentAbrigoId}`),
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
      setAbrigoInfo(abrigoData);
      setLoading(false);
      navigation.setOptions({ title: abrigoData?.nome || 'Animais do Abrigo' });
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError(err.message);
      setLoading(false);
      navigation.setOptions({ title: 'Erro ao Carregar' });
    }
  }, [currentAbrigoId, navigation, userId]);

  const animaisDoAbrigo = React.useMemo(() => {
    if (currentAbrigoId && todosAnimais.length > 0) {
      return todosAnimais.filter(animal => animal.idDono === currentAbrigoId);
    }
    return [];
  }, [todosAnimais, currentAbrigoId]);

  const exibirDetalhesAnimal = (animal) => {
    // Passar userId para PerfilAnimal
    navigation.navigate('PerfilAnimal', { animalId: animal.id, userId: userId, abrigoId: currentAbrigoId /* ou animal.idDono */ });
    console.log('AnimaisAdm exibirDetalhesAnimal - animalId:', animal.id, 'userId:', userId);
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
                  source={{ uri: `http://${urlIp}:3000/animais/${item.id}/imagem` }}
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