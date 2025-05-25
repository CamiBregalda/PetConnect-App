import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StyleSheet, Text, View, Pressable, ActivityIndicator, TouchableOpacity } from 'react-native';
import { AbrigoContext } from './../../AppContext';
import { urlIp } from '@env';

function InfoAdm(route) {
  const { userId } = route.params;
  console.log('InfoAdm - userId:', userId);
  const navigation = useNavigation();
  const { currentAbrigoId } = useContext(AbrigoContext);
  const [abrigoInfo, setAbrigoInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const buscarInfoAbrigo = useCallback(async (abrigoId) => {
    if (!abrigoId) {
      setLoading(false);
      setAbrigoInfo(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const apiUrl = `http://${urlIp}:3000/abrigos/${abrigoId}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro ao buscar informações do abrigo: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
      }

      const data = await response.json();
      setAbrigoInfo(data);
      setLoading(false);
      navigation.setOptions({ title: data.nome || 'Informações do Abrigo' });
    } catch (err) {
      console.error('InfoAdm: Erro ao buscar informações do abrigo:', err);
      setError(err.message);
      setLoading(false);
      navigation.setOptions({ title: 'Erro ao Carregar' });
    }
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      if (currentAbrigoId) {
        buscarInfoAbrigo(currentAbrigoId);
      } else {
        setLoading(false);
        setAbrigoInfo(null);
        navigation.setOptions({ title: 'Informações Gerais' });
      }
    }, [currentAbrigoId, buscarInfoAbrigo, navigation])
  );

  const seVoluntariar = (abrigoId) => {
    navigation.navigate('Voluntariarse', { abrigoId: abrigoId });
  };

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
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.botao} onPress={() => navigation.navigate('VoluntariosAdm')}>
          <Text style={styles.textoBotao}>Voluntarios</Text>
        </Pressable>
        <Pressable style={styles.botao} onPress={() => seVoluntariar(currentAbrigoId)}>
          <Text style={styles.textoBotao}>Voluntariar-se</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {abrigoInfo && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Informações do Abrigo</Text>
          {abrigoInfo.telefone && <Text>Telefone: {abrigoInfo.telefone}</Text>}
          {abrigoInfo.email && <Text>Email: {abrigoInfo.email}</Text>}
        </View>
      )}

      {/* BLOCO DE EVENTOS COM DOIS TOQUES DIFERENTES */}
      <View style={styles.eventosContainer}>
        <TouchableOpacity
          style={styles.eventosHeader}
          onPress={() => navigation.navigate('ListaEventos', { abrigoId: currentAbrigoId })}
        >
          <Text style={styles.eventosTitle}>Nossos Eventos:</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.eventItem}
          onPress={() => navigation.navigate('EventoDetalhe', {
            evento: {
              titulo: '15/05 Limpeza do Canil',
              objetivo: 'Limpar e organizar o espaço dos animais.',
              dataInicio: '15/05/2024',
              dataFim: '15/05/2024',
              detalhes: 'Levar luvas e materiais de limpeza.',
            }
          })}
        >
          <Text style={styles.eventText}>15/05 Limpeza do Canil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.eventItem}
          onPress={() => navigation.navigate('EventoDetalhe', {
            evento: {
              titulo: '26/05 Adoção na Praça',
              objetivo: 'Evento de adoção pública.',
              dataInicio: '26/05/2024',
              dataFim: '26/05/2024',
              detalhes: 'Traga coleiras e plaquinhas.',
            }
          })}
        >
          <Text style={styles.eventText}>26/05 Adoção na Praça</Text>
        </TouchableOpacity>
      </View>

      <Pressable style={styles.botao} onPress={() => navigation.navigate('VoluntariosAdm')}>
        <Text style={styles.textoBotao}>Voluntarios</Text>
      </Pressable>
      <Pressable style={styles.botao} onPress={() => seVoluntariar(currentAbrigoId)}>
        <Text style={styles.textoBotao}>Voluntariar-se</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  infoContainer: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    alignItems: 'flex-start',
    width: '90%',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  botao: {
    width: 200,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 50,
    backgroundColor: '#8A2BE2',
    borderRadius: 5,
    elevation: 3,
    marginTop: 20,
  },
  textoBotao: {
    color: 'white',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  eventosContainer: {
    width: '90%',
    backgroundColor: '#9333ea',
    borderRadius: 10,
    paddingBottom: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  eventosHeader: {
    backgroundColor: '#9333ea',
    padding: 12,
  },
  eventosTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  eventItem: {
    backgroundColor: '#e5e5e5',
    padding: 8,
    marginHorizontal: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  eventText: {
    color: '#333',
    fontSize: 14,
  },
});

export default InfoAdm;
