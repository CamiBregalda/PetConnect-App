import React, { useState, useLayoutEffect, useCallback, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Image, TextInput, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'; // Adicionado useRoute
import { AbrigoContext } from './../../AppContext';
import { urlIp } from '@env';
import TelaFiltro from '../../components/TelaFiltro';
import Ionicons from 'react-native-vector-icons/Ionicons';

function AnimaisAdm() { // Removido route como prop
  const navigation = useNavigation();
  const route = useRoute(); // Hook para acessar os parâmetros da rota
  const { userId } = route.params || {}; // Acessa userId passado via initialParams
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    especie: null,
    raca: null,
    porte: null,
  });
  const [searchTerm, setSearchTerm] = useState('');
  console.log('AnimaisAdm - userId from route.params:', userId);

  const { currentAbrigoId } = useContext(AbrigoContext);
  const [todosAnimais, setTodosAnimais] = useState([]);
  const [abrigoInfo, setAbrigoInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useLayoutEffect(() => {
    // Só mostra o botão se userId do abrigo (abrigoInfo.userId) for igual ao userId do parâmetro
    if (
        abrigoInfo &&
        abrigoInfo.userId &&
        userId &&
        String(abrigoInfo.userId) === String(userId)
    ) {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    style={{ marginRight: 20 }}
                    onPress={() => navigation.navigate('CadastroAnimal', { abrigoId: currentAbrigoId, userId })}
                >
                    <Ionicons name="add-circle-outline" size={30} color="white" />
                </TouchableOpacity>
            ),
        });
    } else {
        navigation.setOptions({
            headerRight: () => null,
        });
    }
}, [navigation, currentAbrigoId, userId, abrigoInfo]);

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

  // Filtragem dos animais
  const animaisFiltrados = animaisDoAbrigo.filter(animal => {
    const nomeMatch = animal.nome ? animal.nome.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    const especieMatch = activeFilters.especie ? animal.especie === activeFilters.especie : true;
    const racaMatch = activeFilters.raca ? animal.raca === activeFilters.raca : true;
    const porteMatch = activeFilters.porte ? animal.porte === activeFilters.porte : true;
    return nomeMatch && especieMatch && racaMatch && porteMatch;
  });

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


      {/* Campo de busca e botão de filtro */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <TextInput
          style={{
            flex: 1,
            height: 45,
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 25,
            paddingLeft: 20,
            paddingRight: 15,
            backgroundColor: 'white',
            fontSize: 16,
            marginRight: 10,
          }}
          placeholder="Buscar por nome..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <TouchableOpacity onPress={() => setFilterModalVisible(true)} style={{ padding: 10 }}>
          <Image source={require('../../img/Filtro.png')} style={{ width: 24, height: 24, tintColor: '#333' }} />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{'Animais do Abrigo'}</Text>

      <View style={styles.whiteContainer}>
        {animaisFiltrados.length > 0 ? (
          <FlatList
            data={animaisFiltrados}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                {(abrigoInfo?.userId === userId) && (
                  <TouchableOpacity
                    style={styles.editIcon}
                    onPress={() => navigation.navigate('AtualizarAnimal', { animalId: item.id, abrigoId: currentAbrigoId, userId, rootScreen: 'AnimaisAdm' })}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="create-outline" size={18} color="#555" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.listItem} onPress={() => exibirDetalhesAnimal(item)}>
                  <Image
                    source={{ uri: `http://${urlIp}:3000/animais/${item.id}/imagem` }}
                    style={styles.listImage}
                    onError={(e) => console.log('Erro img animal:', e.nativeEvent.error)}
                  />
                </TouchableOpacity>
                <Text style={styles.listItemText}>{item.nome}</Text>
              </View>
            )}
          />
        ) : (
          <Text>Nenhum animal encontrado neste abrigo.</Text>
        )}
      </View>

      {/* Modal de filtro */}
      <TelaFiltro
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApplyFilters={setActiveFilters}
        currentFilters={activeFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F3F3F3',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    marginLeft: 20,
  },
  errorText: {
    color: 'red',
    marginTop: 15,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative', // necessário para posicionar o ícone
  },
  editIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 2,
    elevation: 2,
  },
  listItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  listImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
    resizeMode: 'cover',
    backgroundColor: '#ccc',
  },
  listItemText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
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