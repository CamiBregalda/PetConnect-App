import React, { useLayoutEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import MapView from './../../components/MapView'; 

export default function EventoDetalheUsuario() {
  const navigation = useNavigation();
  const route = useRoute();
  const { evento } = route.params;

 
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: '#9333ea' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
      headerTitleAlign: 'center',
      title: evento.titulo || 'Detalhes do Evento',
    });
  }, [navigation, evento]);


  const formatarData = data => {
    if (!data) return 'Data não informada';
    return new Date(data).toLocaleDateString('pt-BR');
  };

 
  const formatarEndereco = endereco => {
    if (!endereco) return 'Endereço não informado';
    const { rua, numero, bairro, cidade, estado, cep } = endereco;
    return `${rua || ''}${numero ? ', ' + numero : ''}${
      bairro ? ' - ' + bairro : ''
    }, ${cidade || ''}${estado ? ' - ' + estado : ''}${
      cep ? ' - CEP: ' + cep : ''
    }`.trim();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>

        <View style={styles.card}>
          <Text style={styles.label}>Título:</Text>
          <Text style={styles.text}>{evento.titulo || 'Título não informado'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Objetivo:</Text>
          <Text style={styles.text}>{evento.objetivo || 'Objetivo não informado'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Endereço:</Text>
          <Text style={styles.text}>{formatarEndereco(evento.endereco)}</Text>
          <View style={styles.mapContainer}>
            {evento.endereco ? (
              <MapView enderecoAbrigo={evento.endereco} />
            ) : (
              <Text style={styles.text}>Endereço não disponível para exibir o mapa.</Text>
            )}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Datas:</Text>
          <Text style={styles.text}>Início: {formatarData(evento.dataInicio)}</Text>
          <Text style={styles.text}>Fim: {formatarData(evento.dataFim)}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Fotos:</Text>
          <View style={styles.row}>
            {evento.imagemUrl ? (
              <Image source={{ uri: evento.imagemUrl }} style={styles.foto} />
            ) : (
              <Text style={styles.text}>Nenhuma foto disponível</Text>
            )}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Detalhes:</Text>
          <Text style={styles.text}>{evento.descricao || 'Nenhum detalhe adicional informado'}</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f1f1'},
  voltar: { marginLeft: 16, marginBottom: 10 },
  scroll: { paddingTop: 20, paddingBottom: 90, paddingHorizontal: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    marginBottom: 6,
  },
  text: { color: '#555', fontSize: 14 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
  foto: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 8,
  },
  mapContainer: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
  },
});
