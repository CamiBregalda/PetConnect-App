import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { urlIp } from '@env';

export default function EditarEvento() {
  const navigation = useNavigation();
  const { evento, userId, abrigoId } = useRoute().params;

  const [titulo, setTitulo] = useState(evento.titulo);
  const [descricao, setDescricao] = useState(evento.descricao);
  const [objetivo, setObjetivo] = useState(evento.objetivo);
  const formatDate = isoString =>
  isoString ? isoString.split('T')[0] : '';
  const [dataInicio, setDataInicio] = useState(formatDate(evento.dataInicio));
  const [dataFim, setDataFim] = useState(formatDate(evento.dataFim));
  const [endereco, setEndereco] = useState({
    rua: evento.endereco.rua || '',
    numero: evento.endereco.numero || '',
    bairro: evento.endereco.bairro || '',
    cidade: evento.endereco.cidade || '',
    estado: evento.endereco.estado || '',
    cep: evento.endereco.cep || '',
  });

  const [imageUri, setImageUri] = useState(evento.imagemUrl || null);
  const [loading, setLoading] = useState(false);
  const [showInicio, setShowInicio] = useState(false);
  const [showFim, setShowFim] = useState(false);

  const handleEnderecoChange = (campo, valor) => {
    setEndereco(prev => ({ ...prev, [campo]: valor }));
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de acesso à galeria.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const getImageMimeType = uri => {
    if (uri.endsWith('.png')) return 'image/png';
    if (uri.match(/\.(jpe?g)$/)) return 'image/jpeg';
    return 'image/jpeg';
  };

  const handleImageUpload = async (eventoId) => {
    if (!imageUri || imageUri === evento.imagemUrl) return;
    try {
      const form = new FormData();
      const mime = getImageMimeType(imageUri);
      const ext = mime.split('/')[1];
      form.append('image', {
        uri: imageUri,
        name: `evento.${ext}`,
        type: mime,
      });

      const res = await fetch(
        `http://${urlIp}:3000/eventos/${eventoId}/imagem`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'multipart/form-data' },
          body: form,
        },
      );
      if (!res.ok) {
        const txt = await res.text();
        console.error('Resposta de erro completa:', errText);
        throw new Error(txt || 'Erro ao enviar imagem');
      }
    } catch (err) {
      console.error('Erro ao enviar imagem:', err);
    }
  };

  const handleSalvar = async () => {

    if (
      !titulo.trim() ||
      !descricao.trim() ||
      !objetivo.trim() ||
      !dataInicio.trim() ||
      !dataFim.trim() ||
      !endereco.rua.trim() ||
      !endereco.numero.trim() ||
      !endereco.bairro.trim() ||
      !endereco.cidade.trim() ||
      !endereco.estado.trim() ||
      !endereco.cep.trim()
    ) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      const bodyData = {
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        objetivo: objetivo.trim(),
        dataInicio: dataInicio.trim(),
        dataFim: dataFim.trim(),
        idAbrigo: evento.abrigoId,
        endereco: {
          rua: endereco.rua.trim(),
          numero: endereco.numero.trim(),
          bairro: endereco.bairro.trim(),
          cidade: endereco.cidade.trim(),
          estado: endereco.estado.trim(),
          cep: endereco.cep.trim(),
        },
      };

      const resp = await fetch(`http://${urlIp}:3000/eventos/${evento.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });
      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(errText || `Status ${resp.status}`);
      }

      await handleImageUpload(evento.id);

      Alert.alert('Sucesso', 'Evento atualizado!');
      navigation.navigate('EventosAdm', { userId, abrigoId });
    } catch (err) {
      console.error('Erro ao salvar evento:', err);
      Alert.alert('Erro', err.message || 'Não foi possível salvar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edite seu Evento</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.container}>

          <Text style={styles.label}>Título</Text>
          <TextInput
            style={styles.input}
            value={titulo}
            onChangeText={setTitulo}
          />

          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={descricao}
            onChangeText={setDescricao}
            multiline
          />

          <Text style={styles.label}>Objetivo</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={objetivo}
            onChangeText={setObjetivo}
            multiline
          />

          <Text style={styles.label}>Data de Início</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowInicio(true)}>
            <Text>{dataInicio || 'Selecionar data'}</Text>
          </TouchableOpacity>
          {showInicio && (
            <DateTimePicker
              value={dataInicio ? dataInicio.toLocaleDateString() : new Date()}
              mode="date"
              display="default"
              onChange={(_, d) => {
                setShowInicio(Platform.OS === 'ios');
                if (d) setDataInicio(d.toISOString().split('T')[0]);
              }}
            />
          )}

          <Text style={styles.label}>Data de Término</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowFim(true)}>
            <Text>{dataFim || 'Selecionar data'}</Text>
          </TouchableOpacity>
          {showFim && (
            <DateTimePicker
              value={dataFim ? parseDate(dataFim).toLocaleDateString() : new Date()}
              mode="date"
              display="default"
              onChange={(_, d) => {
                setShowFim(Platform.OS === 'ios');
                if (d) setDataFim(d.toISOString().split('T')[0]);
              }}
            />
          )}

          <Text style={styles.label}>Endereço</Text>
          {['rua', 'numero', 'bairro', 'cidade', 'estado', 'cep'].map(campo => (
            <TextInput
              key={campo}
              placeholder={campo[0].toUpperCase() + campo.slice(1)}
              style={styles.input}
              value={endereco[campo]}
              onChangeText={val => handleEnderecoChange(campo, val)}
              keyboardType={campo === 'numero' || campo === 'cep' ? 'number-pad' : 'default'}
            />
          ))}

          <Text style={styles.label}>Foto do Evento</Text>
          <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
            {imageUri
              ? <Image source={{ uri: imageUri }} style={styles.image} />
              : <Text style={styles.plus}>+</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSalvar}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.buttonText}>Salvar Alterações</Text>
            }
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 8,
    backgroundColor: '#fff',
  },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },

  scroll: { padding: 16, paddingBottom: 80 },
  container: { backgroundColor: '#fff', borderRadius: 8, padding: 16 },
  label: { fontWeight: 'bold', marginTop: 12, color: '#333' },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    padding: 10,
    marginTop: 6
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  imageBox: {
    width: 80, height: 80,
    alignSelf: 'center',
    borderRadius: 6,
    borderWidth: 1, borderColor: '#ccc',
    justifyContent: 'center', alignItems: 'center',
    marginTop: 8, marginBottom: 16,
    overflow: 'hidden'
  },
  image: { width: 80, height: 80 },
  plus: { fontSize: 32, color: '#888' },
  button: {
    backgroundColor: '#8A2BE2',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 }
});