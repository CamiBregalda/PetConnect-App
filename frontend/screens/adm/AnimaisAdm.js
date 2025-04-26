import React, { useState, useEffect, useCallback, useContext  } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { useRoute, useFocusEffect, useNavigation } from '@react-navigation/native';
import { AbrigoContext } from './../../AppContext';

function AnimaisAdm() {
  const navigation = useNavigation();
  const { currentAbrigoId } = useContext(AbrigoContext);
  const [abrigoInfo, setAbrigoInfo] = useState(null);
  const [animaisDoAbrigo, setAnimaisDoAbrigo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const buscarAnimaisDoAbrigo = useCallback(async (abrigoId) => {
    if (!abrigoId) {
      setLoading(false);
      setAnimaisDoAbrigo([]); // Limpa a lista se não houver ID
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [animaisResponse, abrigoResponse] = await Promise.all([
        fetch(`http://192.168.3.7:3000/abrigos/${abrigoId}/animais`),
        fetch(`http://192.168.3.7:3000/abrigos/${abrigoId}`), // Busca info do abrigo para o nome
      ]);

      if (!animaisResponse.ok || !abrigoResponse.ok) {
        const errorDetails = [];
        if (!animaisResponse.ok) errorDetails.push(`Erro ao buscar animais do abrigo: ${animaisResponse.status}`);
        if (!abrigoResponse.ok) errorDetails.push(`Erro ao buscar info do abrigo: ${abrigoResponse.status}`);
        throw new Error(errorDetails.join('\n'));
      }

      const animaisData = await animaisResponse.json();
      const abrigoData = await abrigoResponse.json();

      setAnimaisDoAbrigo(animaisData);
      setAbrigoInfo(abrigoData); // Armazena as informações do abrigo
      setLoading(false);
      navigation.setOptions({ title: abrigoData?.nome || 'Animais do Abrigo' }); // Atualiza o título
    } catch (err) {
      console.error('Erro ao buscar animais do abrigo:', err);
      setError(err.message);
      setLoading(false);
      navigation.setOptions({ title: 'Erro ao Carregar' });
    }
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      if (currentAbrigoId) {
        buscarAnimaisDoAbrigo(currentAbrigoId);
      } else {
        console.log('Nenhum ID de abrigo no contexto para buscar animais.');
        setLoading(false);
        setAnimaisDoAbrigo([]); // Limpa a lista se não houver ID
        navigation.setOptions({ title: 'Todos os Animais' });
      }
    }, [currentAbrigoId, buscarAnimaisDoAbrigo, navigation])
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
            <View style={styles.animalItem}>
              <Text>{item.nome}</Text>
              {/* Renderize outras informações do animal */}
            </View>
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
  },
  errorText: {
    color: 'red',
    marginTop: 15,
  },
  animalItem: {
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default AnimaisAdm;