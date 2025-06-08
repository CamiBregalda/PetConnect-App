import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native'; // Certifique-se de que Image está importado
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

  const [loggedInUserEmail, setLoggedInUserEmail] = useState(null); // Estado para armazenar o email do usuário logado

  // Efeito para buscar o email do usuário logado
  useEffect(() => {
    const fetchLoggedInUserEmail = async () => {
      if (!loggedInUserId) {
        console.warn("VoluntariosAdm: loggedInUserId não fornecido.");
        return;
      }
      try {
        const response = await fetch(`http://${urlIp}:3000/users/${loggedInUserId}`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Falha ao buscar email do usuário: ${response.status} - ${errorText}`);
        }
        const userData = await response.json();
        setLoggedInUserEmail(userData.email); // Armazena o email do usuário
        console.log('VoluntariosAdm - Email do usuário logado:', userData.email);
      } catch (error) {
        console.error("VoluntariosAdm: Erro ao buscar email do usuário:", error);
        setError(error.message);
      }
    };
    fetchLoggedInUserEmail();
  }, [loggedInUserId]);

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

  useLayoutEffect(() => {
    // Garante que loggedInUserEmail esteja carregado antes de prosseguir
    if (!loadingAbrigoDetails && loggedInUserId && abrigoDetails && loggedInUserEmail) {
      // Ajuste o caminho para o email do administrador do abrigo
      const adminDoAbrigoEmail = abrigoDetails.email; // Assumindo que o email do admin está diretamente em abrigoDetails
      // Se estiver dentro de um objeto aninhado, ajuste o caminho adequadamente
      // Ex: abrigoDetails.admAbrigo.email ou abrigoDetails.adminInfo.email

      console.log('VoluntariosAdm - Comparando loggedInUserEmail:', loggedInUserEmail, 'com adminDoAbrigoEmail:', adminDoAbrigoEmail);

      if (loggedInUserEmail === adminDoAbrigoEmail) {
        navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Candidatos', { abrigoId: currentAbrigoId, userId: loggedInUserId })}
              style={{ marginRight: 15 }}
            >
              {/* Substitua o Text pela sua logo */}
              <Image
                source={require('../../img/candidatos.png')} // Ajuste o caminho para a sua logo
                style={{ width: 30, height: 30, resizeMode: 'contain' }} // Ajuste o estilo conforme necessário
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
  }, [navigation, loggedInUserId, abrigoDetails, loadingAbrigoDetails, currentAbrigoId, loggedInUserEmail]); // Adicionado loggedInUserEmail como dependência

  // Efeito para buscar cuidadores (voluntários)
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
        // A API parece retornar { cuidadores: [...] }
        setCuidadores(data.cuidadores || []); // Garante que seja um array
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

  const exibirPerfil = (cuidador) => {
  console.log('VoluntariosAdm - abrigoId antes de navegar:', currentAbrigoId);
  console.log('VoluntariosAdm - loggedInUserEmail antes de navegar:', loggedInUserEmail);
  navigation.navigate('PerfilCuidador', {
    userId: cuidador.id,
    abrigoId: currentAbrigoId,
    userEmail: loggedInUserEmail,
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
        {cuidadores.length > 0 ? ( // Usando 'cuidadores' com 'c' minúsculo como definido no useState
          <View style={styles.listContainer}>
            {cuidadores.map((cuidador) => ( // Usando 'cuidadores' com 'c' minúsculo
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
    width: '50%', // Para duas colunas
    alignItems: 'center',
  },
  listImage: {
    width: 100,
    height: 100,
    borderRadius: 50, // Para imagem redonda
    marginBottom: 8, // Espaço entre imagem e nome
    resizeMode: 'cover',
    backgroundColor: '#ccc', // Placeholder color
  },
  listItem: { // O TouchableOpacity em si
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