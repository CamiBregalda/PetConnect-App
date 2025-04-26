import React, { useState, useEffect, useContext } from 'react';
import { View, Image, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { AbrigoContext } from './../../AppContext'; // Verifique este caminho!

function HomeAdm({ route }) {
  const { abrigoId } = route.params; // <-- Linha onde você pega o ID da rota
  const [abrigoInfo, setAbrigoInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const { setCurrentAbrigoId } = useContext(AbrigoContext); 
  const htmlContent = `
  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3594.9931725897354!2d-53.10019272460145!3d-25.704650077387758!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94f048f00dd26185%3A0x3965e767d865130a!2sUTFPR%20-%20Dois%20Vizinhos!5e0!3m2!1spt-BR!2sbr!4v1745415525946!5m2!1spt-BR!2sbr" 
  width="960" 
  height="600" 
  style="border:0;" 
  allowfullscreen="" loading="lazy"
  referrerpolicy="no-referrer-when-downgrade">
  </iframe>  
  `;

  useEffect(() => {
    const buscarInfoAbrigo = async () => {
      setLoading(true);
      setError(null);
      try {
        if (abrigoId) { // <-- Você usa abrigoId aqui
          const apiUrl = `http://192.168.3.7:3000/abrigos/${abrigoId}`;
          const response = await fetch(apiUrl);

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Erro ao buscar informações do abrigo: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
          }

          const data = await response.json();
          setAbrigoInfo(data);
          setCurrentAbrigoId(data.id);
          setLoading(false);
          navigation.setOptions({ title: data.nome });
        } else {
          setLoading(false);
          navigation.setOptions({ title: 'Abrigo' });
        }
      } catch (err) {
        console.error('Erro ao buscar informações do abrigo:', err);
        setError(err.message);
        setLoading(false);
        navigation.setOptions({ title: 'Erro no Abrigo' });
      }
    };

    buscarInfoAbrigo();
  }, [navigation, abrigoId, setCurrentAbrigoId]); // Adicione setCurrentAbrigoId como dependência


  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#8A2BE2" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro ao carregar informações do abrigo: {error}</Text>
      </View>
    );
  }

  if (abrigoInfo) {
    return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <View>
            <Image
              style={styles.imgPerfil}
              source={require('../../img/teste.png')}
            />
          </View>
          <View style={styles.about}>
            <Text style={styles.title}>Sobre o Abrigo: </Text>
            <Text>Me chame no zap: (link do zap) </Text>
            <Text> {abrigoInfo.descricao}</Text>
          </View>

          <View style={styles.mapa}>
            <Text style={styles.title}>Endereço:</Text>
            <View style={styles.mapContainer}>
              <WebView
                style={styles.webView}
                originWhitelist={['*']}
                source={{ html: htmlContent }}
              />
            </View>
          </View>
          <View style={styles.aboutADM}>

            <Text style={styles.title}>Sobre o Adiministrador: </Text>
            <View style={styles.sobre}>
              <Text>{abrigoInfo.email}</Text>
              <Image
                style={styles.imgADM}
                source={require('../../img/Cachorro.png')}
              />
            </View>

          </View>


        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Selecione um abrigo para ver os detalhes.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,

  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    paddingTop: 20,
    justifyContent: 'center',
  },
  imgPerfil: {
    width: 250,
    height: 250,
    borderRadius: 125,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,

  },
  about: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: 'white',
    width: 320,
    minHeight: 130,
    padding: 10,
    borderRadius: 15,
  },
  mapa: {
    justifyContent: 'center', 
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10, 
  },
  mapContainer: {
    width: '300',
    height: '190', 
    borderRadius: 10,
    overflow: 'hidden',
  },

  aboutADM: {
    marginTop: 20,
    marginBottom: 20,
    width: 320,
    borderRadius: 15,
    padding: 10,
    backgroundColor: 'white',
  },
  sobre: {
    flexDirection: 'row',
    width: 310,
    height: 110,
    padding: 20,
    borderRadius: 15,
    maxHeight: 80,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  imgADM: {
    width: 50,
    height: 50,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#8A2BE2',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HomeAdm;