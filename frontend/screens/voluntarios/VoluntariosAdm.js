import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { AbrigoContext } from '../../AppContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { urlIp } from '@env';

function Voluntarios() {
  const { currentAbrigoId } = useContext(AbrigoContext);
  const [cuidadores, setCuidadores] = useState([]);
  const [loadingCuidadores, setLoadingCuidadores] = useState(true);
  const [loadingAbrigoDetails, setLoadingAbrigoDetails] = useState(true);
  const [abrigoDetails, setAbrigoDetails] = useState(null);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { userId: loggedInUserId } = route.params || {};
  console.log('VoluntariosAdm - loggedInUserId from route.params:', loggedInUserId);
  console.log('VoluntariosAdm - currentAbrigoId from AbrigoContext:', currentAbrigoId);

  // Buscar detalhes do abrigo (inclui userId do admin)
  useEffect(() => {
    const fetchAbrigoDetails = async () => {
      if (!currentAbrigoId) {
        setLoadingAbrigoDetails(false);
        setAbrigoDetails(null);
        return;
      }
      setLoadingAbrigoDetails(true);
      try {
        const response = await fetch(`http://${urlIp}:3000/abrigos/${currentAbrigoId}`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Falha ao buscar detalhes do abrigo: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        setAbrigoDetails(data);
        console.log('VoluntariosAdm - AbrigoDetails fetched:', data);
      } catch (e) {
        console.error("VoluntariosAdm: Erro ao buscar detalhes do abrigo:", e);
        setError(e.message);
        setAbrigoDetails(null);
      } finally {
        setLoadingAbrigoDetails(false);
      }
    };
    fetchAbrigoDetails();
  }, [currentAbrigoId]);

  // Buscar cuidadores (voluntários)
  useEffect(() => {
    const buscarCuidadoresDoAbrigo = async () => {
      if (!currentAbrigoId) {
        setLoadingCuidadores(false);
        setCuidadores([]);
        return;
      }

      setLoadingCuidadores(true);
      setError(null);
      try {
        const apiUrl = `http://${urlIp}:3000/abrigos/${currentAbrigoId}/Cuidadores`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Erro ao buscar voluntários: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
        }

        const data = await response.json();
        setCuidadores(data.cuidadores || []);
        console.log('VoluntariosAdm: Voluntários do abrigo carregados:', data.cuidadores);
      } catch (err) {
        console.error('VoluntariosAdm: Erro ao buscar voluntários:', err);
        setError(err.message);
        setCuidadores([]);
      } finally {
        setLoadingCuidadores(false);
      }
    };

    buscarCuidadoresDoAbrigo();
  }, [currentAbrigoId]);

  // HeaderRight só aparece se userId do usuário for igual ao userId do admin do abrigo
  useLayoutEffect(() => {
    if (
      !loadingAbrigoDetails &&
      loggedInUserId &&
      abrigoDetails &&
      abrigoDetails.userId // userid do admin do abrigo
    ) {
      console.log('VoluntariosAdm - Comparando loggedInUserId:', loggedInUserId, 'com adminUserId:', abrigoDetails.userid);

      if (String(loggedInUserId) === String(abrigoDetails.userId)) {
        navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Candidatos', { abrigoId: currentAbrigoId, userId: loggedInUserId })}
              style={{ marginRight: 15 }}
            >
              <Image
                source={require('../../img/candidatos.png')}
                style={{ width: 30, height: 30, resizeMode: 'contain' }}
              />
            </TouchableOpacity>
          ),
        });
      } else {
        navigation.setOptions({ headerRight: null });
      }
    } else {
      navigation.setOptions({ headerRight: null });
    }
  }, [navigation, loggedInUserId, abrigoDetails, loadingAbrigoDetails, currentAbrigoId]);

  const exibirPerfil = (cuidador) => {
    navigation.navigate('PerfilCuidador', {
      userId: cuidador.id,
      abrigoId: currentAbrigoId,
    });
  };

  if (loadingCuidadores || loadingAbrigoDetails) {
    return <View style={styles.container}><ActivityIndicator size="large" color="#8A2BE2" /></View>;
  }

  if (error) {
    return <View style={styles.container}><Text style={styles.errorText}>Erro: {error}</Text></View>;
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.whiteContainer}>
        {cuidadores.length > 0 ? (
          <View style={styles.listContainer}>
            {cuidadores.map((cuidador) => (
              <View key={cuidador.id} style={styles.itemContainer}>
                <TouchableOpacity style={styles.listItem} onPress={() => exibirPerfil(cuidador)}>
                  <Image
                    source={{ uri: `http://${urlIp}:3000/cuidadores/${cuidador.id}/imagem` }}
                    style={styles.listImage}
                    onError={(e) => console.log('Erro img cuidador:', e.nativeEvent.error)}
                  />
                </TouchableOpacity>
                <Text style={styles.listItemText}>{cuidador.nome}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text>Nenhum voluntário associado a este abrigo.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    padding: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    alignItems: 'center',
  },
  listContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  itemContainer: {
    padding: 10,
    marginBottom: 15,
    marginTop: 15,
    width: '50%',
    alignItems: 'center',
  },
  listImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
    resizeMode: 'cover',
    backgroundColor: '#ccc',
  },
  listItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItemText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Voluntarios;