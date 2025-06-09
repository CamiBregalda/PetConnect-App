import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { urlIp } from '@env';
import TelaFiltro from '../../components/TelaFiltro'; // Importa o componente do modal de filtro

// Não é mais necessário importar Enums aqui, pois TelaFiltro cuidará disso
// import { EspecieEnum, PorteEnum } from '../../src/models/enums';

function HomeScreen() {
  const route = useRoute();
  const telaPrincipalUserId = route.params?.userId;
  const navigation = useNavigation();
  const userId = telaPrincipalUserId;

  const [animais, setAnimais] = useState([]);
  const [abrigos, setAbrigos] = useState([]);
  const [eventos, setEventos] = useState([]);
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
      title: '', // Pode ser 'PetConnect' ou um logo
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: '#8A2BE2',
      },
      headerTintColor: 'white',
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Image
            source={require('../../img/logout.png')} // Certifique-se que o caminho está correto
            style={styles.headerLogoutIcon}
          />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => exibirDetalhesUsuario(telaPrincipalUserId)}>
          <Image
            source={require('../../img/Profile_Active.png')} // Certifique-se que o caminho está correto
            style={styles.headerProfileIcon}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, telaPrincipalUserId]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [animaisResponse, abrigosResponse, eventosResponse] = await Promise.all([
          fetch(`http://${urlIp}:3000/animais/`),
          fetch(`http://${urlIp}:3000/abrigos/`),
          fetch(`http://${urlIp}:3000/eventos/`),
        ]);
        const errorDetails = [];
        if (!animaisResponse.ok) errorDetails.push(`Animais: ${animaisResponse.status}`);
        if (!abrigosResponse.ok) errorDetails.push(`Abrigos: ${abrigosResponse.status}`);
        if (!eventosResponse.ok) errorDetails.push(`Eventos: ${eventosResponse.status}`);

        if (errorDetails.length > 0) {
          throw new Error(errorDetails.join(', '));
        }

        const animaisData = await animaisResponse.json();
        const abrigosData = await abrigosResponse.json();
        const eventosData = await eventosResponse.json();

        setAnimais(animaisData);
        setAbrigos(abrigosData);
        setEventos(eventosData);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError(`Falha ao carregar dados: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const exibirDetalhesAnimal = (animal) => {
    navigation.navigate('PerfilAnimal', { animalId: animal.id, abrigoId: animal.idDono, animal: animal, userId: telaPrincipalUserId });
  };

  const exibirDetalhesAbrigo = (idDoAbrigo) => {
    console.log('TelaPrincipal - Saindo com userId:', telaPrincipalUserId, 'para abrigoId:', idDoAbrigo); // Modifiquei o log para clareza
    navigation.navigate('Main', {
      screen: 'Home', 
      params: { abrigoId: idDoAbrigo, userId: telaPrincipalUserId }
    });
  };

  const exibirDetalhesUsuario = (userId) => {
    navigation.navigate('InicialUser', { userId: userId });
  };

  const exibirDetalhesEvento = (evento) => {
    console.log('buscando abrigoId do evento:', evento.idAbrigo);
    navigation.navigate('EventoDetalhe', { eventoId: evento.id, evento: evento, userId: telaPrincipalUserId, abrigoId: evento.idAbrigo });
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
  const adotadoMatch = animal.adotado === false; // <-- Apenas não adotados

 
  return nomeMatch && especieMatch && racaMatch && porteMatch && adotadoMatch;
});

  const abrigosFiltrados = abrigos.filter(abrigo =>
    abrigo.nome ? abrigo.nome.toLowerCase().includes(searchTerm.toLowerCase()) : true
  );

  const eventosFiltrados = eventos.filter(evento =>
    evento.nome ? evento.nome.toLowerCase().includes(searchTerm.toLowerCase()) : true
  );

  if (loading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#8A2BE2" /></View>;
  }

  if (error) {
    return <View style={styles.errorContainer}><Text style={styles.errorText}>{error}</Text></View>;
  }

  return (
    <ScrollView style={styles.container}>
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

       <TouchableOpacity
        style={styles.botaoEventosAdm}
        onPress={() => navigation.navigate('EventosAdm', { userId: telaPrincipalUserId, abrigoId: "682a3ea6bc939ba819b39e79" })} // Passa abrigoId como null para eventos administrativos
      >
        <Text style={styles.botaoEventosAdmTexto}>Gerenciar Eventos (Admin)</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Animais para Adoção</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {animaisFiltrados.length > 0 ? animaisFiltrados.map((animal) => (
            <TouchableOpacity key={animal.id} style={styles.listItem} onPress={() => exibirDetalhesAnimal(animal)}>
              <Image
                source={{ uri: `http://${urlIp}:3000/animais/${animal.id}/imagem` }}
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
            <TouchableOpacity key={abrigo.id} style={styles.listItem} onPress={() => exibirDetalhesAbrigo(abrigo.id)}>
              <Image
                source={{ uri: `http://${urlIp}:3000/abrigos/${abrigo.id}/imagem` }}
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
            <TouchableOpacity key={evento.id} style={styles.listItem} onPress={() => exibirDetalhesEvento(evento)}>
              <Image
                source={{ uri: `http://${urlIp}:3000/eventos/${evento.id}/imagem` }}
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
        currentFilters={activeFilters} // Passa os filtros ativos para o modal
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingBottom: 20, // Espaço no final da rolagem
  },
  loadingContainer: { // Estilo para centralizar o ActivityIndicator
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  errorContainer: { // Estilo para centralizar a mensagem de erro
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
    // tintColor: 'white', // Se a imagem do perfil precisar de tint
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
    paddingRight: 15, // Ajustado
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
    borderRadius: 20, // Para um visual mais arredondado se usar ícone
    // backgroundColor: '#e0e0e0', // Fundo opcional para o botão de filtro
  },
  filterIconText: {
    fontSize: 14,
    color: '#333', // Cor do texto do filtro
    fontWeight: '600',
  },
  filterIcon: { // Se você usar uma imagem de ícone
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
    backgroundColor: '#e0e0e0', // Placeholder visual
  },
  listItemText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    color: "#8A2BE2", // Cor roxa para o nome
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
    // marginLeft: 10, // Removido para centralizar melhor
    marginTop: 10,
    color: '#666',
    fontStyle: 'italic',
    paddingHorizontal: 10,
    width: 150, // Para ter uma largura definida no scroll horizontal
    textAlign: 'center', // Centraliza o texto
    alignSelf: 'center', // Centraliza o componente Text dentro do ScrollView
    flex: 1, // Para ocupar o espaço disponível se for o único item
  }
});

export default HomeScreen;