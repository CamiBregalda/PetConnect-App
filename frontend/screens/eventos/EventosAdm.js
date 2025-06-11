import React, { useLayoutEffect, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useIsFocused, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { urlIp } from '@env';

export default function EventosAdm() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const route = useRoute();

  const { userId, abrigoId } = route.params || {};

  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: '#9333ea' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
      headerTitleAlign: 'center',
      title: 'Meus Eventos', 
    });
  }, [navigation]);

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
          setEventos([]);
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

      <TouchableOpacity
        style={styles.botaoCriar}
        onPress={() => navigation.navigate('CriarEvento', { userId, abrigoId })}
      >
        <Text style={styles.textoBotao}>Criar Evento</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll}>
        {eventos.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 30, color: '#555' }}>
            Nenhum evento cadastrado para este abrigo.
          </Text>
        ) : (
          eventos.map(evento => (
            <View key={evento.id} style={styles.cardContainer}>
              <TouchableOpacity
                style={styles.editIcon}
                onPress={() =>
                  navigation.navigate('EditarEvento', { evento, userId, abrigoId })
                }
              >
                <Ionicons name="create-outline" size={20} color="#555" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('EventoDetalheAdm', { evento, userId, abrigoId })
                }
              >
                <Text style={styles.titulo}>{evento.titulo}</Text>
                <Text style={styles.descricao}>{evento.descricao}</Text>

                {evento.imagemUrl && (
                  <Image source={{ uri: evento.imagemUrl }} style={styles.imagem} />
                )}
              </TouchableOpacity>
            </View>
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
    paddingTop: 20,
  },
  scroll: {
    paddingBottom: 120,
    paddingHorizontal: 16,
  },
  botaoCriar: {
    backgroundColor: '#9333ea',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    position: 'relative',
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  descricao: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  imagem: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    resizeMode: 'cover',
    marginTop: 8,
  },
  editIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 2,
  },
});