import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Image,  } from 'react-native';
import { AbrigoContext } from './../../AppContext'; // Importe o Context
import { useNavigation } from '@react-navigation/native';

function Voluntarios() {
  const { currentAbrigoId } = useContext(AbrigoContext); // Acesse o ID do abrigo do Context
  const [Cuidadores, setCuidadores] = useState([]); // Renomeei para ser mais específico
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const buscarCuidadoresDoAbrigo = async () => {
      if (!currentAbrigoId) {
        setLoading(false);
        setCuidadores([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // 1. Construa a URL da API para buscar os voluntários do abrigo específico
        //    Assumindo que sua API tem um endpoint como:
        //    `http://192.168.3.7:3000/abrigos/{abrigoId}/Cuidadores`
        const apiUrl = `http://192.168.3.7:3000/abrigos/${currentAbrigoId}/Cuidadores`; // <------------------- MODIFICADO

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': 'Bearer SEU_TOKEN',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Erro ao buscar voluntários: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
        }

        const data = await response.json();
        setCuidadores(data.cuidadores); // Armazena a lista de voluntários do abrigo
        setLoading(false);
        console.log('Cuidadores: Voluntários do abrigo carregados:', data); // LOG
      } catch (err) {
        console.error('Cuidadores: Erro ao buscar voluntários:', err); // LOG
        setError(err.message);
        setLoading(false);
        setCuidadores([]);
      }
    };

    buscarCuidadoresDoAbrigo();
  }, [currentAbrigoId]); // Depende do ID do abrigo para refazer a busca

  const exibirPerfil = (cuidador) => {
    navigation.navigate('PerfilCuidador', { userId: cuidador.id });
  };

  if (loading) {
    return <View style={styles.container}><ActivityIndicator size="large" color="#8A2BE2" /></View>;
  }

  if (error) {
    return <View style={styles.container}><Text style={styles.errorText}>Erro ao buscar voluntários: {error}</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voluntários do Abrigo:</Text>
      {Cuidadores.length > 0 ? (
        Cuidadores.map((cuidador, idx) => (
          <View key={idx} style={styles.box}>
            <TouchableOpacity key={cuidador.id} style={styles.listItem} onPress={() => exibirPerfil(cuidador)}>
              <Image 
                  source={{ uri: `http://192.168.3.7:3000/cuidadores/${cuidador.id}/imagem` }} 
                  style={styles.listImage} />
            </TouchableOpacity>
            <Text>Nome: {cuidador.nome}</Text>
            <Text>Contato: {cuidador.telefone}</Text>
            {/* Adicione outros campos conforme necessário */}
          </View>
        ))
      ) : (
        <Text>Nenhum voluntário associado a este abrigo.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  box:{
    marginBottom: 10,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
  },
  listImage: {
    width: 130,
    height: 100,
    borderRadius: 10,
    marginBottom: 0,
    resizeMode: 'cover',
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
  },
});

export default Voluntarios;