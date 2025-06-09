import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { urlIp } from '@env';

export default function ListaEventos() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventos = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://${urlIp}:3000/eventos/`);
        if (!response.ok) throw new Error('Erro ao buscar eventos');
        const data = await response.json();
        setEventos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (isFocused) {
      fetchEventos();
    }
  }, [isFocused]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#9333ea" />
        <Text style={{ marginTop: 10 }}>Carregando eventos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'red' }}>Erro: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll}>
        {eventos.map((evento) => (
          <TouchableOpacity
            key={evento.id}
            style={styles.eventoBox}
            onPress={() => navigation.navigate('EventoDetalhe', { evento })}
          >
            <Text style={styles.eventoTitulo}>{evento.titulo}</Text>
            <Text style={styles.eventoDescricao}>{evento.descricao}</Text>
            {evento.imagemUrl && (
              <Image
                source={{ uri: evento.imagemUrl }}
                style={styles.eventoImagem}
              />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    paddingTop: 50,
  },
  scroll: {
    paddingBottom: 120,
    paddingHorizontal: 16,
  },
  backButton: {
    marginLeft: 16,
    marginBottom: 10,
  },
  backText: {
    color: '#9333ea',
    fontSize: 16,
  },
  eventoBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  eventoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  eventoDescricao: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  eventoImagem: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    resizeMode: 'cover',
  },
});