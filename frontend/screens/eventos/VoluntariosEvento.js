import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { urlIp } from '@env';

export default function VoluntariosEvento() {
  const navigation = useNavigation();
  const route = useRoute();
  const { eventoId } = route.params;

  const [voluntarios, setVoluntarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVoluntarios = async () => {
      setLoading(true);
      setError(null);

     
      const endpoint = `http://${urlIp}:3000/cuidadores/eventos/${eventoId}/voluntarios`;
      console.log('Fetch de voluntários em:', endpoint);

      try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error(`Status ${response.status}`);
        const data = await response.json();

        console.log('Payload de voluntários:', data);

        const mapped = data.map(cuidador => ({
          id: cuidador.id,
          nome: cuidador.userId?.nome || cuidador.userId?.name || 'Sem nome',
          imagemUrl: cuidador.userId?.imagemUrl || cuidador.userId?.avatarUrl || 'https://via.placeholder.com/60'
        }));

        setVoluntarios(mapped);
      } catch (err) {
        console.log('Erro ao buscar voluntários:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }

    };

    fetchVoluntarios();
  }, [eventoId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#9333ea" />
        <Text style={{ marginTop: 10 }}>Carregando voluntários...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.voltar}>
        <Ionicons name="arrow-back" size={28} color="#222" />
      </TouchableOpacity>

      <Text style={styles.titulo}>Voluntários do Evento</Text>

      <View style={styles.listaContainer}>
        {voluntarios.length > 0 ? (
          voluntarios.map(v => (
            <View key={v.id} style={styles.voluntarioItem}>
              <Image
                source={{ uri: v.imagemUrl || 'https://via.placeholder.com/60' }}
                style={styles.avatar}
                onError={e => console.log(
                  'Erro ao carregar imagem do voluntário:',
                  e.nativeEvent.error
                )}
              />
              <Text style={styles.nome}>{v.nome}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>
            Nenhum voluntário inscrito neste evento.
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f1f1', paddingTop: 50 },
  voltar: { marginLeft: 16, marginBottom: 10 },
  titulo: {
    fontSize: 18, fontWeight: 'bold',
    textAlign: 'center', marginBottom: 20,
    color: '#333'
  },
  listaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    flexWrap: 'wrap',
    rowGap: 20
  },
  voluntarioItem: {
    alignItems: 'center',
    width: 80
  },
  avatar: {
    width: 60, height: 60,
    resizeMode: 'contain',
    marginBottom: 6
  },
  nome: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333'
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center'
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555'
  },
});
