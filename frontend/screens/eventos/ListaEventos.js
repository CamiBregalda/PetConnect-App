import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useIsFocused, useRoute } from '@react-navigation/native';
import { urlIp } from '@env';

export default function ListaEventos() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const route = useRoute(); 
  const { abrigoId } = route.params; 

  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchEventos = async () => {
    if (!abrigoId) { 
      setLoading(false);
      setError('ID do abrigo não fornecido.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://${urlIp}:3000/eventos/abrigo/${abrigoId}`);
      if (response.status === 404) {
        setEventos([]); // <-- Não define erro, apenas lista vazia
        setError(null);
      } else if (!response.ok) {
        throw new Error('Erro ao buscar eventos');
      } else {
        const data = await response.json();
        setEventos(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isFocused) fetchEventos();
}, [isFocused, abrigoId]); 


return (
  <View style={styles.container}>
    <ScrollView contentContainerStyle={styles.scroll}>
      {eventos.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 30, color: '#555' }}>
          Nenhum evento cadastrado para este abrigo.
        </Text>
      ) : (
          eventos.map((evento) => (
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
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    paddingTop: 30,
  },
  scroll: {
    paddingBottom: 120,
    paddingHorizontal: 16,
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