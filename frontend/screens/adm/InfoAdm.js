import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StyleSheet, Text, View, Pressable, ActivityIndicator } from 'react-native';
import { AbrigoContext } from './../../AppContext'; // Importe o Context

function InfoAdm() {
  const navigation = useNavigation();
  const { currentAbrigoId } = useContext(AbrigoContext); // Acesse o ID do abrigo do Context
  const [abrigoInfo, setAbrigoInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const buscarInfoAbrigo = useCallback(async (abrigoId) => {
    if (!abrigoId) {
      setLoading(false);
      setAbrigoInfo(null); // Limpa as informações se não houver ID
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const apiUrl = `http://192.168.3.7:3000/abrigos/${abrigoId}`; // Endpoint para buscar detalhes do abrigo pelo ID
      const response = await fetch(apiUrl);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro ao buscar informações do abrigo: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
      }

      const data = await response.json();
      setAbrigoInfo(data);
      setLoading(false);
      navigation.setOptions({ title: data.nome || 'Informações do Abrigo' }); // Atualiza o título
    } catch (err) {
      console.error('InfoAdm: Erro ao buscar informações do abrigo:', err); // LOG
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
        console.log('InfoAdm: Nenhum ID de abrigo no contexto ao focar.'); // LOG
        setLoading(false);
        setAbrigoInfo(null); // Limpa as informações se não houver ID
        navigation.setOptions({ title: 'Informações Gerais' });
      }
    }, [currentAbrigoId, buscarInfoAbrigo, navigation])
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#8A2BE2" />
      </View>
    );
  }

const seVoluntariar = (abrigoId) => { // Modifique a função para receber abrigoId
    console.log(`Abrigo ID ao navegar para Voluntariarse: ${abrigoId}`); // Adicione este log
    navigation.navigate('Voluntariarse', { abrigoId: abrigoId }); // Passa abrigoId como parâmetro
  };

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
});

export default InfoAdm;