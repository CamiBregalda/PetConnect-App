import React, { useState, useEffect,useLayoutEffect, useContext } from 'react';
import { View, Image, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
// Removido WebView daqui, pois será usado no AbrigoMapView
import { useNavigation } from '@react-navigation/native';
import { AbrigoContext } from './../../AppContext';
import { urlIp } from '@env';
import MapView from './../../components/MapView'; 
import Ionicons from 'react-native-vector-icons/Ionicons';

function HomeAdm({ route }) {
  const userId = route?.params?.userId;
  const abrigoId = route?.params?.abrigoId;
  console.log('HomeAdm userId:', userId, 'abrigoId:', abrigoId);
  const [abrigoInfo, setAbrigoInfo] = useState(null);
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const { setCurrentAbrigoId } = useContext(AbrigoContext);


  useEffect(() => {

    const buscarInfoAbrigo = async () => {
      setLoading(true);
      setError(null);
      // setMapCoordinates(null); // Não é mais necessário aqui
      try {
        if (abrigoId) {
          const apiUrl = `http://${urlIp}:3000/abrigos/${abrigoId}`;
          const response = await fetch(apiUrl);

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Erro ao buscar informações do abrigo: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
          }

          const data = await response.json();
          setAbrigoInfo(data);
          setCurrentAbrigoId(data.id);
          navigation.setOptions({ title: data.nome });


          if (data.idAdmAbrigo) {
            await buscarInfoAdmin(data.idAdmAbrigo);
          } else {
             setLoading(false); // Se não houver admin para buscar, para o loading aqui
          }
        } else {
          setError("ID do abrigo não fornecido.");
          navigation.setOptions({ title: 'Abrigo' });
          setLoading(false);
        }
      } catch (err) {
        console.error('Erro ao buscar informações do abrigo:', err);
        setError(err.message);
        navigation.setOptions({ title: 'Erro no Abrigo' });
        setLoading(false);
      }
      // setLoading(false) é chamado no finally de buscarInfoAdmin ou se não houver admin
    };

    const buscarInfoAdmin = async (idAdmAbrigo) => {
      try {
        const adminApiUrl = `http://${urlIp}:3000/admAbrigo/${idAdmAbrigo}`;
        const adminResponse = await fetch(adminApiUrl);

        if (!adminResponse.ok) {
          const errorData = await adminResponse.json();
          console.error(`Erro ao buscar informações do administrador: ${adminResponse.status} - ${errorData.message || 'Erro desconhecido'}`);
          return;
        }
        const adminData = await adminResponse.json();
        setAdminInfo(adminData);
      } catch (err) {
        console.error('Erro ao buscar informações do administrador:', err);
      } finally {
        setLoading(false);
      }
    };

    buscarInfoAbrigo();
  }, [navigation, abrigoId, setCurrentAbrigoId, urlIp]);

  useLayoutEffect(() => {
    // Só mostra o botão se userId do abrigo (abrigoInfo.userId) for igual ao userId do parâmetro
    if (abrigoInfo && abrigoInfo.userId && abrigoInfo.userId === userId) {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    style={{ marginRight: 20 }}
                    onPress={() => navigation.navigate('AtualizarAbrigo', { abrigoId, userId })}
                >
                    <Ionicons name="create-outline" size={30} color="white" />
                </TouchableOpacity>
            ),
        });
    } else {
        navigation.setOptions({
            headerRight: () => null,
        });
    }
}, [navigation, abrigoInfo, userId, abrigoId]);

  if (loading) {
    return (
      <View style={styles.containerLoadingError}>
        <ActivityIndicator size="large" color="#8A2BE2" />
      </View>
    );
  }

  if (error && !abrigoInfo) {
    return (
      <View style={styles.containerLoadingError}>
        <Text style={styles.errorText}>Erro: {error}</Text>
      </View>
    );
  }

  if (abrigoInfo) {
    // Removida a lógica de mapaHtmlContent daqui

    let enderecoCompletoParaExibir = "Endereço não fornecido";
    if (abrigoInfo.endereco && typeof abrigoInfo.endereco === 'object') {
      const { rua, numero, bairro, cidade, estado, cep } = abrigoInfo.endereco;
      enderecoCompletoParaExibir = `${rua || ''}${numero ? ', ' + numero : ''}${bairro ? ' - ' + bairro : ''}\n${cidade || ''}${estado ? ' - ' + estado : ''}\n${cep ? 'CEP: ' + cep : ''}`.replace(/ ,|, \n|\n,/g, '\n').trim();
    } else if (typeof abrigoInfo.endereco === 'string') { // Caso o endereço seja uma string simples
         enderecoCompletoParaExibir = abrigoInfo.endereco;
    }


    return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <View>
            <Image
              source={{ uri: `http://${urlIp}:3000/abrigos/${abrigoInfo.id}/imagem` }}
              style={styles.imgPerfil}
              onError={(e) => console.log("Erro ao carregar imagem do abrigo:", e.nativeEvent.error)}
            />
          </View>
          {/* Mostra erros secundários (ex: falha ao buscar admin) como aviso se abrigoInfo carregou */}
          {error && <Text style={styles.errorTextWarning}>Aviso: {error}</Text>}

          <View style={styles.about}>
            <Text style={styles.title}>Sobre o Abrigo: </Text>
            <Text style={styles.descricao}>{abrigoInfo.descricao || "Descrição não disponível."}</Text>
          </View>

          <View style={styles.mapa}>
            <Text style={styles.title}>Endereço:</Text>
            <Text style={styles.enderecoTexto}>{enderecoCompletoParaExibir}</Text>
            <View style={styles.mapContainer}>
              {/* Usa o novo componente AbrigoMapView */}
              {abrigoInfo.endereco ? (
                <MapView enderecoAbrigo={abrigoInfo.endereco} />
              ) : (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                  <Text>Endereço não disponível para exibir o mapa.</Text>
                </View>
              )}
            </View>
          </View>

          {adminInfo && (
            <View style={styles.aboutADM}>
              <Text style={styles.title}>Sobre o Administrador: </Text>
              <View style={styles.sobre}>
                <View style={styles.infoAdm}>
                  {adminInfo.id && (
                    <Image
                      source={{ uri: `http://${urlIp}:3000/admAbrigo/${adminInfo.id}/imagem` }}
                      style={styles.imgADM}
                      onError={(e) => console.log("Erro ao carregar imagem do admin:", e.nativeEvent.error)}
                    />
                  )}
                  <Text style={styles.nomeAdm}>{adminInfo.nome || "Nome não disponível"}</Text>
                  <Text style={styles.descricao}>{adminInfo.descricao || "Descrição não disponível."}</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }
  return (
    <View style={styles.containerLoadingError}>
      <Text>Nenhuma informação do abrigo para exibir.</Text>
    </View>
  );
}

// Seus estilos permanecem aqui (ajuste o path do import do AbrigoMapView se necessário)
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  containerLoadingError: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  imgPerfil: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#e0e0e0',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  descricao: {
    fontSize: 16,
    color: '#555',
    textAlign: 'justify',
    lineHeight: 22,
  },
  about: {
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: 'white',
    width: '100%',
    maxWidth: 350,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  mapa: {
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    width: '100%',
    maxWidth: 350,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  enderecoTexto: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 20,
  },
  mapContainer: { // Este container agora envolve o AbrigoMapView
    width: '100%',
    height: 200, // Defina a altura desejada para o mapa
    borderRadius: 8,
    overflow: 'hidden', // Importante para o borderRadius do WebView funcionar
    backgroundColor: '#e0e0e0', // Placeholder enquanto o mapa carrega
  },
  // Removido styles.webView pois está dentro de AbrigoMapView.js
  aboutADM: {
    marginTop: 10,
    marginBottom: 20,
    width: '100%',
    maxWidth: 350,
    borderRadius: 10,
    padding: 15,
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  sobre: {
    width: '100%',
    alignItems: 'center',
  },
  infoAdm: {
    alignItems: 'center',
  },
  nomeAdm: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#333',
    marginTop: 10,
  },
  imgADM: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
    backgroundColor: '#e0e0e0',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  errorTextWarning: {
    color: 'orange',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default HomeAdm;