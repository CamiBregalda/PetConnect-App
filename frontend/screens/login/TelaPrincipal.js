import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { urlIp } from '@env';

function HomeScreen() {
  const route = useRoute();
  const userId = route.params?.userId; // Este é o userId da TelaPrincipal
  const navigation = useNavigation();
  const telaPrincipalUserId = route.params?.userId; // Este é o userId da TelaPrincipal
  console.log('TelaPrincipal userId:', telaPrincipalUserId);

  const [animais, setAnimais] = useState([]);
  const [abrigos, setAbrigos] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, [navigation]);

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

        if (!animaisResponse.ok || !abrigosResponse.ok) {
          const errorDetails = [];
          if (!animaisResponse.ok) errorDetails.push(`Erro ao buscar animais: ${animaisResponse.status}`);
          if (!abrigosResponse.ok) errorDetails.push(`Erro ao buscar abrigos: ${abrigosResponse.status}`);
           if (!eventosResponse.ok) errorDetails.push(`Erro ao buscar eventos: ${eventosResponse.status}`);
          throw new Error(errorDetails.join('\n'));
        }

        const animaisData = await animaisResponse.json();
        const abrigosData = await abrigosResponse.json();
        const eventosData = await eventosResponse.json();

        setAnimais(animaisData);
        setAbrigos(abrigosData);
         setEventos(eventosData);
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
    // Pass both abrigoId and the userId from TelaPrincipal
    navigation.navigate('Main', { // Route name is 'Main'
      screen: 'Home',             // Target screen within 'Main'
      params: {                   // These are the params for the 'Home' screen within 'Main'
        abrigoId: idDoAbrigo,
        userId: telaPrincipalUserId
      }
    });
  };

  const exibirDetalhesUsuario = (userId) => { // Renamed to avoid confusion
    console.log('ID do usuário para perfil:', userId);
    navigation.navigate('InicialUser', { userId: userId });
  };

  const exibirDetalhesEvento = (evento) => {
    // Ajuste a rota e os parâmetros conforme sua tela de detalhes do evento
    // Se o usuário for admin, pode ir para EventoDetalheAdm, senão para EventoDetalhe
    // Aqui, vamos assumir uma navegação genérica para 'EventoDetalhe'
    // Você pode adicionar lógica para verificar se o usuário é admin e navegar para 'EventoDetalheAdm'
    navigation.navigate('EventoDetalhe', { eventoId: evento.id, evento: evento });
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

const eventosFiltrados = eventos.filter(evento =>
    evento.nome.toLowerCase().includes(searchTerm.toLowerCase())
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

      {/* 🔘 Botão para acessar a tela EventosAdm */}
      <TouchableOpacity
        style={styles.botaoEventosAdm}
        onPress={() => navigation.navigate('EventosAdm')}
      >
        <Text style={styles.botaoEventosAdmTexto}>Ver Eventos do Admin</Text>
      </TouchableOpacity>

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
                source={{ uri: `http://${urlIp}:3000/animais/${animal.id}/imagem` }}
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
                source={{ uri: `http://${urlIp}:3000/abrigos/${abrigo.id}/imagem` }}
                style={styles.listImage} />
              <Text style={styles.listItemText}>{abrigo.nome}</Text>
            </TouchableOpacity>
          ))}
          {abrigosFiltrados.length === 0 && <Text>Nenhum abrigo encontrado com esse nome.</Text>}
        </ScrollView>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Próximos Eventos</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {eventosFiltrados.map((evento) => (
            <TouchableOpacity key={evento.id} style={styles.listItem} onPress={() => exibirDetalhesEvento(evento)}>
              {/* Assumindo que seu evento tem um campo 'imagemUrl' ou similar.
                  Se for um caminho local, use require().
                  Se for uma URL completa do backend, use uri.
                  Se o backend serve a imagem em um endpoint específico como /eventos/:id/imagem: */}
              <Image
                source={{ uri: `http://${urlIp}:3000/eventos/${evento.id}/imagem` }} // Ajuste este endpoint
                style={styles.listImage}
                onError={(e) => console.log('Erro ao carregar imagem do evento:', e.nativeEvent.error)} // Para debug
              />
              <Text style={styles.listItemText}>{evento.nome}</Text>
            </TouchableOpacity>
          ))}
          {eventosFiltrados.length === 0 && searchTerm.length > 0 && <Text style={styles.notFoundText}>Nenhum evento encontrado.</Text>}
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
  botaoEventosAdm: {
    backgroundColor: '#9333ea',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoEventosAdmTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
