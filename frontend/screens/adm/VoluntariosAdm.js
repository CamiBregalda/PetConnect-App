import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { AbrigoContext } from './../../AppContext'; // Importe o Context

function Voluntarios() {
  const { currentAbrigoId } = useContext(AbrigoContext); // Acesse o ID do abrigo do Context
  const [voluntarios, setVoluntarios] = useState([]); // Renomeei para ser mais específico
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const buscarVoluntariosDoAbrigo = async () => {
      if (!currentAbrigoId) {
        setLoading(false);
        setVoluntarios([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // 1. Construa a URL da API para buscar os voluntários do abrigo específico
        //    Assumindo que sua API tem um endpoint como:
        //    `http://192.168.3.7:3000/abrigos/{abrigoId}/voluntarios`
        const apiUrl = `http://192.168.3.7:3000/abrigos/${currentAbrigoId}/voluntarios`; // <------------------- MODIFICADO

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
        setVoluntarios(data); // Armazena a lista de voluntários do abrigo
        setLoading(false);
        console.log('Voluntarios: Voluntários do abrigo carregados:', data); // LOG
      } catch (err) {
        console.error('Voluntarios: Erro ao buscar voluntários:', err); // LOG
        setError(err.message);
        setLoading(false);
        setVoluntarios([]);
      }
    };

    buscarVoluntariosDoAbrigo();
  }, [currentAbrigoId]); // Depende do ID do abrigo para refazer a busca

  if (loading) {
    return <View style={styles.container}><ActivityIndicator size="large" color="#8A2BE2" /></View>;
  }

  if (error) {
    return <View style={styles.container}><Text style={styles.errorText}>Erro ao buscar voluntários: {error}</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voluntários do Abrigo:</Text>
      {voluntarios.length > 0 ? (
        voluntarios.map((voluntario, idx) => (
          <View key={idx} style={styles.box}>
            <Text>Nome: {voluntario.nome}</Text>
            <Text>Idade: {voluntario.idade}</Text>
            <Text>Contato: {voluntario.telefone}</Text>
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
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Voluntarios;