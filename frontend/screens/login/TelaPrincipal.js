import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { urlIp } from '@env';
import TelaFiltro from '../../components/TelaFiltro'; 


function HomeScreen() {
  const route = useRoute();

  const userId = route.params?.userId;
  const navigation = useNavigation();

const [refreshing, setRefreshing] = useState(false);
  const [animais, setAnimais] = useState([]);
  const [abrigos, setAbrigos] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    especie: null,
    raca: null,
    porte: null,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: '', 
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: '#8A2BE2',
      },
      headerTintColor: 'white',
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Image
            source={require('../../img/logout.png')} 
            style={styles.headerLogoutIcon}
          />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => exibirDetalhesUsuario(userId)}>
          <Image
            source={require('../../img/Profile_Active.png')} 
            style={styles.headerProfileIcon}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, userId]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [animaisResponse, abrigosResponse, eventosResponse, userResponse] = await Promise.all([
        fetch(`http://${urlIp}:3000/animais/`),
        fetch(`http://${urlIp}:3000/abrigos/`),
        fetch(`http://${urlIp}:3000/eventos/`),
        fetch(`http://${urlIp}:3000/users/${userId}`)
      ]);
      const errorDetails = [];
      if (!animaisResponse.ok) errorDetails.push(`Animais: ${animaisResponse.status}`);
      if (!abrigosResponse.ok) errorDetails.push(`Abrigos: ${abrigosResponse.status}`);
      if (!eventosResponse.ok) errorDetails.push(`Eventos: ${eventosResponse.status}`);
      if (!userResponse.ok) errorDetails.push(`Usuário: ${userResponse.status}`);

      if (errorDetails.length > 0) {
        throw new Error(errorDetails.join(', '));
      }

      const animaisData = await animaisResponse.json();
      const abrigosData = await abrigosResponse.json();
      const eventosData = await eventosResponse.json();
      const userData = await userResponse.json();

      setAnimais(animaisData);
      setAbrigos(abrigosData);
      setEventos(eventosData);
      setUser(userData);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError(`Falha ao carregar dados: ${err.message}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [urlIp]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  const exibirDetalhesAnimal = (animal) => {
    navigation.navigate('PerfilAnimal', { animalId: animal.id, abrigoId: animal.idDono, animal: animal, userId: userId });
  };

  const exibirDetalhesAbrigo = (idDoAbrigo, userId) => {
    navigation.navigate('Main', { abrigoId: idDoAbrigo, userId: userId });
  };

  const exibirDetalhesUsuario = (userId) => {
    navigation.navigate('InicialUser', { userId: userId });
  };

  const exibirDetalhesEvento = (evento) => {
    navigation.navigate('EventoDetalhe', { eventoId: evento.id, evento: evento, userId: userId, abrigoId: evento.idAbrigo });
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
  };

  const handleApplyAdvancedFilters = (filtersFromModal) => {
    setActiveFilters(filtersFromModal);
  };

  const animaisFiltrados = animais.filter(animal => {
    const nomeMatch = animal.nome ? animal.nome.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    const especieMatch = activeFilters.especie ? animal.especie === activeFilters.especie : true;
    const racaMatch = activeFilters.raca ? animal.raca === activeFilters.raca : true;
    const porteMatch = activeFilters.porte ? animal.porte === activeFilters.porte : true;
    const adotadoMatch = animal.adotado === false; 

    return nomeMatch && especieMatch && racaMatch && porteMatch && adotadoMatch;
  });

  const abrigosOrdenados = [...abrigos].sort((a, b) => {
    const getScore = (abrigo) => {
      if (abrigo.endereco.rua.trim() === user.endereco.rua.trim()) return 4;
      if (abrigo.endereco.cidade.trim() === user.endereco.cidade.trim()) return 3;
      if (abrigo.endereco.estado.trim() === user.endereco.estado.trim()) return 2;
      if (abrigo.endereco.cep.trim() === user.endereco.cep.trim()) return 1;
      return 0;
    };
    return getScore(b) - getScore(a);
  });

  const abrigosFiltrados = abrigosOrdenados.filter(abrigo =>
    abrigo.nome ? abrigo.nome.toLowerCase().includes(searchTerm.toLowerCase()) : true
  );

  const eventosFiltrados = eventos.filter(evento => {
    const nomeMatch = evento.nome ? evento.nome.toLowerCase().includes(searchTerm.toLowerCase()) : true
    const dataMatch = evento.dataFim ? new Date(evento.dataFim) >= new Date() : false;

    return nomeMatch && dataMatch;
  });

  if (loading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#8A2BE2" /></View>;
  }

  if (error) {
    return <View style={styles.errorContainer}><Text style={styles.errorText}>{error}</Text></View>;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#8A2BE2']}
        />
      }
    >
      <Text style={styles.title}>O que você procura hoje?</Text>

      <View style={styles.searchAndFilterContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome..."
          value={searchTerm}
          onChangeText={handleSearch}
        />
        <TouchableOpacity onPress={() => setFilterModalVisible(true)} style={styles.filterIconContainer}>
          <Image source={require('../../img/Filtro.png')} style={styles.filterIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Animais para Adoção</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {animaisFiltrados.length > 0 ? animaisFiltrados.map((animal) => (
            <TouchableOpacity key={animal.id} style={styles.listItem} onPress={() => exibirDetalhesAnimal(animal)}>
              <Image
                source={{ uri: `http://${urlIp}:3000/animais/${animal.id}/imagem?${Date.now()}` }}
                style={styles.listImage}
                onError={(e) => console.log('Erro img animal:', e.nativeEvent.error)}
              />
              <Text style={styles.listItemText}>{animal.nome}</Text>
            </TouchableOpacity>
          )) : <Text style={styles.notFoundText}>Nenhum animal encontrado.</Text>}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Abrigos</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {abrigosFiltrados.length > 0 ? abrigosFiltrados.map((abrigo) => (
            <TouchableOpacity key={abrigo.id} style={styles.listItem} onPress={() => exibirDetalhesAbrigo(abrigo.id, userId)}>
              <Image
                source={{ uri: `http://${urlIp}:3000/abrigos/${abrigo.id}/imagem?${Date.now()}` }}
                style={styles.listImage}
                onError={(e) => console.log('Erro img abrigo:', e.nativeEvent.error)}
              />
              <Text style={styles.listItemText}>{abrigo.nome}</Text>
            </TouchableOpacity>
          )) : <Text style={styles.notFoundText}>Nenhum abrigo encontrado.</Text>}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Próximos Eventos</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {eventosFiltrados.length > 0 ? eventosFiltrados.map((evento) => (
            <TouchableOpacity key={evento.id} style={styles.listItem} onPress={() => exibirDetalhesEvento(evento, userId)}>
              <Image
                source={{ uri: `http://${urlIp}:3000/eventos/${evento.id}/imagem?${Date.now()}` }}
                style={styles.listImage}
              />
              <Text style={styles.listItemText}>{evento.titulo}</Text>
            </TouchableOpacity>
          )) : <Text style={styles.notFoundText}>Nenhum evento encontrado.</Text>}
        </ScrollView>
      </View>

      <TelaFiltro
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApplyFilters={handleApplyAdvancedFilters}
        currentFilters={activeFilters} 
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingBottom: 20, 
  },
  loadingContainer: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  errorContainer: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  headerLogoutIcon: {
    width: 28,
    height: 28,
    marginLeft: 15,
    tintColor: 'white',
  },
  headerProfileIcon: {
    width: 30,
    height: 30,
    marginRight: 15,

  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 25,
    marginBottom: 25,
  },
  botaoEventosAdm: {
    backgroundColor: '#8A2BE2',
    marginHorizontal: 20,
    marginBottom: 25,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  botaoEventosAdmTexto: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  searchAndFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    paddingHorizontal: 15,
  },
  searchInput: {
    flex: 1,
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25,
    paddingLeft: 20,
    paddingRight: 15,
    backgroundColor: 'white',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterIconContainer: {
    padding: 10,
    marginLeft: 10,
    borderRadius: 20, 
  },
  filterIconText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  filterIcon: { 
    width: 24,
    height: 24,
    tintColor: '#333',
  },
  section: {
    marginBottom: 25,
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  listItem: {
    marginRight: 12,
    alignItems: 'center',
    width: 160,
    height: 200,
    backgroundColor: 'white',
    padding: 10,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    justifyContent: 'flex-start',
  },
  listImage: {
    width: '100%',
    height: 110,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: 'cover',
    backgroundColor: '#e0e0e0',
  },
  listItemText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    color: "#8A2BE2", 
  },
  listItemSubText: {
    fontSize: 12,
    textAlign: 'center',
    color: "#666",
    marginTop: 4,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  notFoundText: {
 
    marginTop: 10,
    color: '#666',
    fontStyle: 'italic',
    paddingHorizontal: 10,
    width: 150, 
    textAlign: 'center', 
    alignSelf: 'center', 
    flex: 1, 
  }
});

export default HomeScreen;