import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { urlIp } from '@env';
import TelaFiltro from '../../components/TelaFiltro';

export default function AnimaisUser() {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;

  // Estado de busca e filtros
  const [search, setSearch] = useState('');
  const [adoptedAnimals, setAdoptedAnimals] = useState([]);
  const [volunteerShelters, setVolunteerShelters] = useState([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    especie: null,
    raca: null,
    porte: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Buscando dados de adotados e voluntariado
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const respAdot = await fetch(`http://${urlIp}:3000/animais/usuario/${userId}`);
        const respVolt = await fetch(`http://${urlIp}:3000/abrigos/usuario/${userId}`);

        const [dataAdot, dataVolt] = await Promise.all([
          respAdot.json(),
          respVolt.json(),
        ]);

        setAdoptedAnimals(dataAdot);
        setVolunteerShelters(dataVolt);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError(`Falha ao carregar: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);


  const filteredAdopted = adoptedAnimals.filter(animal => {
    const nomeOk = animal.nome?.toLowerCase().includes(search.toLowerCase());
    const espOk = activeFilters.especie ? animal.especie === activeFilters.especie : true;
    const racOk = activeFilters.raca ? animal.raca === activeFilters.raca : true;
    const porOk = activeFilters.porte ? animal.porte === activeFilters.porte : true;
    return nomeOk && espOk && racOk && porOk;
  });

  const filteredShelters = Array.isArray(volunteerShelters) && volunteerShelters.length > 0
  ? volunteerShelters.filter(abrigo =>
      abrigo.nome?.toLowerCase().includes(search.toLowerCase())
    )
  : [];


  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    setFilterModalVisible(false);
  };


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8A2BE2" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
          <Image source={require('../../img/Filtro.png')} style={styles.filterIcon} />
        </TouchableOpacity>
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Pesquisar"
            style={styles.input}
            value={search}
            onChangeText={setSearch}
          />
          <Image source={require('../../img/Lupa.png')} style={styles.searchIcon} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Animais Adotados:</Text>
          <View style={styles.gridRow}>
            {filteredAdopted.length > 0 ? (
              filteredAdopted.map(animal => (
                <View key={animal.id} style={styles.itemBox}>
                  <Image
                    source={{ uri: `http://${urlIp}:3000/animais/${animal.id}/imagem?${Date.now()}` }}
                    style={styles.itemImage}
                  />
                  <View style={styles.itemRow}>
                    <Text style={styles.itemText}>{animal.nome}</Text>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('AtualizarAnimal', { userId, abrigoId: animal.idDono, animalId: animal.id, rootScreen: 'AnimaisUser' })}
                    >
                      <Ionicons name="create-outline" size={18} color="#555" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.notFoundText}>Nenhum animal adotado encontrado.</Text>
            )}
          </View>
        </View>


        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Abrigos em que voluntaria:</Text>
          <View style={styles.gridRow}>
            {filteredShelters.length > 0 ? (
              filteredShelters.map(abrigo => (
                <View key={abrigo.id} style={styles.itemBox}>
                  <Image
                    source={{ uri: `http://${urlIp}:3000/abrigos/${abrigo.id}/imagem?${Date.now()}` }}
                    style={styles.itemImage}
                  />
                  <View style={styles.itemRow}>
                    <Text style={styles.itemText}>{abrigo.nome}</Text>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('AtualizarAbrigo', { userId, abrigoId: abrigo.id })}
                    >
                      <Ionicons name="create-outline" size={18} color="#555" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.notFoundText}>Nenhum abrigo encontrado.</Text>
            )}
          </View>
        </View>
      </ScrollView>

      <TelaFiltro
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={activeFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f1f1f1', 
    paddingTop: 10 
  },

  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f1f1f1' 
  },

  errorContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: '#f1f1f1' 
  },

  searchContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    marginBottom: 16,
  },

  filterIcon: { 
    width: 28, 
    height: 28, 
    marginRight: 12 
  },

  searchBox: {
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff',  
    borderRadius: 10, 
    paddingHorizontal: 10, 
    height: 40,
  },

  input: { 
    flex: 1, 
    fontSize: 14 
  },

  searchIcon: { 
    width: 20, 
    height: 20, 
    tintColor: '#888' 
  },

  sectionBox: {
    backgroundColor: '#fdfdfd', 
    marginHorizontal: 16, 
    marginBottom: 20, 
    padding: 16, 
    borderRadius: 10,
  },

  sectionTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 12 
  },

  gridRow: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between' 
  },

  itemBox: { 
    width: '30%', 
    marginBottom: 20, 
    alignItems: 'center' 
  },

  itemImage: { 
    width: 60, 
    height: 60, 
    resizeMode: 'contain', 
    marginBottom: 8 
  },

  itemText: { 
    fontSize: 14, 
    color: '#333' 
  },

  itemRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4 
  },

  notFoundText: { 
    marginTop: 10, 
    color: '#666', 
    fontStyle: 'italic', 
    textAlign: 'center', 
    width: '100%' 
  },

  errorText: { 
    color: 'red', 
    fontSize: 16, 
    textAlign: 'center' 
  },
  
});
