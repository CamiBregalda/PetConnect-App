// HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function HomeScreen() {
  const [animais, setAnimais] = useState([]);
  const [abrigos, setAbrigos] = useState([]);
  // const [eventos, setEventos] = useState([]); // Desativando o estado de eventos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [animaisResponse, abrigosResponse /*, eventosResponse*/] = await Promise.all([
          fetch('http://192.168.3.7:3000/animais/'),
          fetch('http://192.168.3.7:3000/abrigos/'),
          // fetch('http://192.168.3.7:3000/eventos/'), // Desativando a busca de eventos
        ]);

        if (!animaisResponse.ok || !abrigosResponse.ok /*|| !eventosResponse.ok*/) {
          const errorDetails = [];
          if (!animaisResponse.ok) errorDetails.push(`Erro ao buscar animais: ${animaisResponse.status}`);
          if (!abrigosResponse.ok) errorDetails.push(`Erro ao buscar abrigos: ${abrigosResponse.status}`);
          // if (!eventosResponse.ok) errorDetails.push(`Erro ao buscar eventos: ${eventosResponse.status}`); // Desativando a mensagem de erro de eventos
          throw new Error(errorDetails.join('\n'));
        }

        const animaisData = await animaisResponse.json();
        const abrigosData = await abrigosResponse.json();
        // const eventosData = await eventosResponse.json(); // Desativando o processamento de dados de eventos

        setAnimais(animaisData);
        setAbrigos(abrigosData);
        // setEventos(eventosData); // Desativando a atualização do estado de eventos
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
    // Navegar para a tela de detalhes do animal, passando o ID
    navigation.navigate('PerfilAnimal', { animalId: animal.id });

  };

  const exibirDetalhesAbrigo = (idDoAbrigo) => {
    navigation.navigate('Main', { screen: 'Home', params: { abrigoId: idDoAbrigo } });
  };

  // const exibirDetalhesEvento = (evento) => { // Desativando a função de detalhes do evento
  //   // Navegar para a tela de detalhes do evento (a tela precisa ser criada)
  //   console.log('Detalhes do evento:', evento);
  // };

  if (loading) {
    return <View style={styles.container}><ActivityIndicator size="large" color="#8A2BE2" /></View>;
  }

  if (error) {
    return <View style={styles.container}><Text style={styles.errorText}>Erro ao carregar dados: {error}</Text></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>O que você procura hoje?</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Animais para Adoção</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {animais.map((animal) => (
            <TouchableOpacity key={animal.id} style={styles.listItem} onPress={() => exibirDetalhesAnimal(animal)}>
              <Image 
                source={{ uri: `http://192.168.3.7:3000/animais/${animal.id}/imagem` }} 
                 style={styles.listImage} />
                 <Text style={styles.listItemText}>{animal.nome}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Abrigos</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {abrigos.map((abrigo) => (
            <TouchableOpacity key={abrigo.id} style={styles.listItem} onPress={() => exibirDetalhesAbrigo(abrigo.id)}>
              <Image 
                source={{ uri: `http://192.168.3.7:3000/abrigos/${abrigo.id}/imagem` }} 
                style={styles.listImage} />
                <Text style={styles.listItemText}>{abrigo.nome}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Desativando a seção de eventos */}
      {/* <View style={styles.section}>
        <Text style={styles.sectionTitle}>Eventos</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {eventos.map((evento) => (
            <TouchableOpacity key={evento.id} style={styles.listItem} onPress={() => exibirDetalhesEvento(evento)}>
              <Text style={styles.listItemText}>{evento.nome}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
    marginTop: 50,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#555',
  },
  listItem: {
    backgroundColor: '#8A2BE2',
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
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  listImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 0,
    resizeMode: 'cover',
  },
});

export default HomeScreen;
