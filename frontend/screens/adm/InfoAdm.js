import React, { useState, useCallback, useContext, useEffect } from 'react';
import { useNavigation, useFocusEffect, useRoute } from "@react-navigation/native";
import { StyleSheet, Text, View, Pressable, ActivityIndicator, TouchableOpacity, ScrollView, Image } from 'react-native';
import { AbrigoContext } from './../../AppContext';
import { urlIp } from '@env';

function InfoAdm() {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params || {};
  const { currentAbrigoId } = useContext(AbrigoContext);

  const [abrigoInfo, setAbrigoInfo] = useState(null);
  const [cuidadores, setCuidadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCuidadores, setLoadingCuidadores] = useState(true);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [errorEvents, setErrorEvents] = useState(null);

  const buscarInfoAbrigo = useCallback(async (abrigoId) => {
    if (!abrigoId) {
      console.log('[InfoAdm buscarInfoAbrigo] ID do abrigo não fornecido.');
      setAbrigoInfo(null);
      return;
    }
    try {
      const apiUrl = `http://${urlIp}:3000/abrigos/${abrigoId}`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro ao buscar informações do abrigo: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
      }
      const data = await response.json();;
      setAbrigoInfo(data);
      navigation.setOptions({ title: data.nome || 'Informações do Abrigo' });
    } catch (err) {
      setError(prevError => prevError ? `${prevError}\n${err.message}` : err.message);
      setAbrigoInfo(null);
      navigation.setOptions({ title: 'Erro ao Carregar Abrigo' });
    }
  }, [navigation]);

  const buscarCuidadores = useCallback(async (abrigoId) => {
    if (!abrigoId) {
      setLoadingCuidadores(false);
      setCuidadores([]);
      return;
    }

    setLoadingCuidadores(true);
    setError(null);
    try {
      const apiUrl = `http://${urlIp}:3000/abrigos/${abrigoId}/Cuidadores`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro ao buscar voluntários: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
      }

      const data = await response.json();
      setCuidadores(data.cuidadores || []);
    } catch (err) {
      console.error('InfoAdm: Erro ao buscar voluntários:', err);
      setError(err.message);
      setCuidadores([]);
    } finally {
      setLoadingCuidadores(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (currentAbrigoId) {
        setLoading(true);
        setError(null);
        setAbrigoInfo(null);
        setCuidadores([]);

        Promise.all([
          buscarInfoAbrigo(currentAbrigoId),
          buscarCuidadores(currentAbrigoId)
        ]).catch((promiseAllError) => {
          console.error('[InfoAdm useFocusEffect] Erro geral no Promise.all (erros individuais já devem ter sido logados e tratados):', promiseAllError);
        }).finally(() => {
          setLoading(false);
        });
      } else {
        setLoading(false);
        setAbrigoInfo(null);
        setCuidadores([]);
        setError(null);
        navigation.setOptions({ title: 'Informações Gerais' });
      }
      return () => {

      };
    }, [currentAbrigoId, buscarInfoAbrigo, buscarCuidadores, navigation])

    , useEffect(() => {

      if (!abrigoInfo) return;
      const fetchEvents = async () => {
        setLoadingEvents(true);
        setErrorEvents(null);
        try {
          const endpoint = abrigoInfo.userId === userId
            ? `http://${urlIp}:3000/eventos/abrigo/${currentAbrigoId}`
            : `http://${urlIp}:3000/eventos/abrigo/${currentAbrigoId}`
          const res = await fetch(endpoint);
          if (!res.ok) throw new Error('Erro ao buscar eventos');
          const data = await res.json();
          setEvents(data);
        } catch (err) {
          setErrorEvents(err.message);
        } finally {
          setLoadingEvents(false);
        }
      };

      fetchEvents();
    }, [abrigoInfo, currentAbrigoId, userId])
  );

  const verChamadosAbandono = (abrigoId) => {
    if (!abrigoId) {
      console.warn('InfoAdm: Tentativa de ver chamados sem abrigoId');
      setError('ID do abrigo não disponível para ver chamados.');
      return;
    }
    console.log('InfoAdm verChamadosAbandono - abrigoId:', abrigoId);
    navigation.navigate('ChamadoAbandono', { abrigoId: abrigoId });
  };

  const seVoluntariar = (abrigoId) => {
    if (!abrigoId) {
      console.warn('InfoAdm: Tentativa de se voluntariar sem abrigoId');
      setError('ID do abrigo não disponível para se voluntariar.');
      return;
    }
    navigation.navigate('Voluntariarse', { abrigoId: abrigoId, userId: userId });
  };

  const exibirDetalhesVoluntario = (cuidador) => {
    navigation.navigate('PerfilCuidador', {
      cuidadorId: cuidador.id,
      userId: userId,
      abrigoId: currentAbrigoId,
    });
  };

  if (loading) {
    return (
      <View style={styles.containerActivity}>
        <ActivityIndicator size="large" color="#8A2BE2" />
        <Text>Carregando informações...</Text>
      </View>
    );
  }

  if (error && !abrigoInfo && (!cuidadores || cuidadores.length === 0)) {
    return (
      <View style={styles.containerError}>
        <Text style={styles.errorText}>Erro ao carregar dados: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scrollViewContainer}
      contentContainerStyle={styles.scrollViewContentContainer}
    >
      <View style={styles.mainContentContainer}>
        {abrigoInfo ? (
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Informações do Abrigo</Text>
            <Text>Nome: {abrigoInfo.nome || 'Não disponível'}</Text>
            {abrigoInfo.telefone && <Text>Telefone: {abrigoInfo.telefone}</Text>}
            {abrigoInfo.email && <Text>Email: {abrigoInfo.email}</Text>}
          </View>
        ) : (
          !loading && !(error && !cuidadores.length) &&
          <Text style={styles.notFoundText}>Informações do abrigo não disponíveis.</Text>
        )}

        {error && (abrigoInfo || (cuidadores && cuidadores.length > 0) || !loading) && (
          <View style={styles.partialErrorContainer}>
            <Text style={styles.errorText}>Aviso: {error}</Text>
          </View>
        )}

        <View style={styles.eventosContainer}>
          <TouchableOpacity
            style={styles.eventosHeader}
            onPress={() => {
              if (abrigoInfo.userId === userId) {
                navigation.navigate('EventosAdm', { userId, abrigoId: currentAbrigoId });
              } else {
                navigation.navigate('ListaEventos', { abrigoId: currentAbrigoId });
              }
            }}
          >
            <Text style={styles.eventosTitle}>Nossos Eventos:</Text>
          </TouchableOpacity>

          {loadingEvents ? (
            <ActivityIndicator color="#fff" style={{ marginTop: 10 }} />
          ) : errorEvents ? (
            <Text style={{ color: '#fff', padding: 12 }}>Erro: {errorEvents}</Text>
          ) : (
            events.map(evento => (
              <TouchableOpacity
                key={evento.id}
                style={styles.eventItem}
                onPress={() => {
                  if (abrigoInfo.userId === userId) {
                    navigation.navigate('EventoDetalheAdm', {
                      evento,
                      userId,
                      abrigoId: currentAbrigoId
                    });
                  } else {
                    navigation.navigate('EventoDetalhe', { evento });
                  }
                }}
              >
                <Text style={styles.eventText}>
                  {new Date(evento.dataInicio).toLocaleDateString('pt-BR')} – {evento.titulo}
                </Text>
              </TouchableOpacity>
            ))
          )}

        </View>

        <View style={styles.whiteContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Voluntários</Text>
            <TouchableOpacity onPress={() => navigation.navigate('VoluntariosAdm', { userId })}>
              <Text style={styles.verTodosText}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          {cuidadores.length > 0 ? (
            <View style={styles.listContainer}>
              {cuidadores.map((cuidador) => (
                <View key={cuidador.id} style={styles.itemContainer}>
                  <TouchableOpacity onPress={() => exibirDetalhesVoluntario(cuidador)}>
                    <Image
                      source={{ uri: `http://${urlIp}:3000/cuidadores/${cuidador.id}/imagem?${Date.now()}` }}
                      style={styles.listImage}
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
        <View style={styles.buttonsContainer}>
          {abrigoInfo && String(abrigoInfo.userId) === String(userId) && (
            <Pressable style={styles.botao} onPress={() => verChamadosAbandono(currentAbrigoId)}>
              <Text style={styles.textoBotao}>Chamados de Abandono</Text>
            </Pressable>
          )}
          <Pressable style={styles.botao} onPress={() => seVoluntariar(currentAbrigoId)}>
            <Text style={styles.textoBotao}>Voluntariar-se</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollViewContentContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: 40,
  },
  mainContentContainer: {
    width: '100%',
    maxWidth: 600,
    alignItems: 'center',
  },
  containerActivity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  containerError: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  partialErrorContainer: {
    width: '90%',
    padding: 10,
    backgroundColor: '#ffe0e0',
    borderColor: '#d00000',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  errorText: {
    color: '#d00000',
    fontSize: 16,
    textAlign: 'center',
  },
  infoContainer: {
    width: '90%',
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  eventosContainer: {
    width: '90%',
    backgroundColor: '#8A2BE2',
    borderRadius: 10,
    paddingBottom: 12,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventosHeader: {
    padding: 12,
  },
  eventosTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  eventItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  eventText: {
    color: '#333',
    fontSize: 14,
  },
  section: {
    width: '90%',
    marginBottom: 25,
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
  },
  sectionTitle: {

    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  verTodosText: {
    color: '#8A2BE2',
    fontSize: 16,
    fontWeight: '500',
  },
  listScrollViewContentContainer: {
    paddingRight: 10,
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyListContainerScrollView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
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
    marginBottom: 10,
    backgroundColor: '#e0e0e0',
  },
  listItemText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    color: "#333",
  },
  notFoundText: {
    marginTop: 10,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  whiteContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonsContainer: {
    alignItems: 'center',
    width: '90%',
    marginTop: 10,
  },
  botao: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    paddingVertical: 14,
    backgroundColor: '#8A2BE2',
    borderRadius: 8,
    elevation: 2,
    marginTop: 10,
    marginBottom: 5,
  },
  textoBotao: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default InfoAdm;