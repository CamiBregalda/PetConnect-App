// HomeScreen.js
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

function HomeScreen() {
  //const route = useRoute();
  //const { email } = route.params;
  //console.log('Email recebido:', email);

  const [animais, setAnimais] = useState([]);
  const [abrigos, setAbrigos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true, 
      title: '',
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: '#8A2BE2', // Cor de fundo do cabeçalho
      },
      headerTintColor: 'white', // Cor do título e botão de voltar
      headerTitleAlign: 'center',

      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Image
            source={require('../../img/logout.png')} // Caminho para sua imagem
            style={styles.headerLogoutIcon}
          />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('UsuarioInfo')}>
          <Image
            source={require('../../img/Profile_Active.png')} // Caminho para sua imagem
            style={styles.headerProfileIcon}
          />
        </TouchableOpacity>
      ),
      // Se você quiser um botão de voltar personalizado ou nenhum, pode adicionar headerLeft aqui
      // Exemplo: headerLeft: () => null, // para remover o botão de voltar padrão
    });
  }, [navigation]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [animaisResponse, abrigosResponse] = await Promise.all([
          fetch('http://192.168.3.20:3000/animais/'),
          fetch('http://192.168.3.20:3000/abrigos/'),
        ]);

        if (!animaisResponse.ok || !abrigosResponse.ok) {
          const errorDetails = [];
          if (!animaisResponse.ok) errorDetails.push(`Erro ao buscar animais: ${animaisResponse.status}`);
          if (!abrigosResponse.ok) errorDetails.push(`Erro ao buscar abrigos: ${abrigosResponse.status}`);
          throw new Error(errorDetails.join('\n'));
        }

        const animaisData = await animaisResponse.json();
        const abrigosData = await abrigosResponse.json();

        setAnimais(animaisData);
        setAbrigos(abrigosData);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const exibirDetalhesAnimal = (animal) => {
    console.log(`ID do Dono (Abrigo): ${animal.idDono}`);
    navigation.navigate('PerfilAnimal', { animalId: animal.id, abrigoId: animal.idDono, animal: animal });
  };

  const exibirDetalhesAbrigo = (idDoAbrigo) => {
    navigation.navigate('Main', { screen: 'Home', params: { abrigoId: idDoAbrigo } });
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
  };

  const animaisFiltrados = animais.filter(animal =>
    animal.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const abrigosFiltrados = abrigos.filter(abrigo =>
    abrigo.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <View style={styles.container}><ActivityIndicator size="large" color="#8A2BE2" /></View>;
  }

  if (error) {
    return <View style={styles.container}><Text style={styles.errorText}>Erro ao carregar dados: {error}</Text></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>O que você procura hoje?</Text>

      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome..."
          value={searchTerm}
          onChangeText={handleSearch}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Animais para Adoção</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {animaisFiltrados.map((animal) => (
            <TouchableOpacity key={animal.id} style={styles.listItem} onPress={() => exibirDetalhesAnimal(animal)}>
              <Image
                source={{ uri: `http://192.168.3.20:3000/animais/${animal.id}/imagem` }}
                style={styles.listImage} />
              <Text style={styles.listItemText}>{animal.nome}</Text>
            </TouchableOpacity>
          ))}
          {animaisFiltrados.length === 0 && <Text>Nenhum animal encontrado com esse nome.</Text>}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Abrigos</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {abrigosFiltrados.map((abrigo) => (
            <TouchableOpacity key={abrigo.id} style={styles.listItem} onPress={() => exibirDetalhesAbrigo(abrigo.id)}>
              <Image
                source={{ uri: `http://192.168.3.20:3000/abrigos/${abrigo.id}/imagem` }}
                style={styles.listImage} />
              <Text style={styles.listItemText}>{abrigo.nome}</Text>
            </TouchableOpacity>
          ))}
          {abrigosFiltrados.length === 0 && <Text>Nenhum abrigo encontrado com esse nome.</Text>}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  headerLogoutIcon: {  
    width: 28,
    height: 28,
    marginLeft: 15,
  },
  headerProfileIcon: { 
    width: 28,
    height: 28,
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  searchBarContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    backgroundColor: 'white',
  },
  section: {
    marginBottom: 30,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  listItem: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 150,
  },
  listItemText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center',
    color: "#8A2BE2",
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  
  listImage: {
    width: 130,
    height: 100,
    borderRadius: 10,
    marginBottom: 0,
    resizeMode: 'cover',
  },
});

export default HomeScreen;