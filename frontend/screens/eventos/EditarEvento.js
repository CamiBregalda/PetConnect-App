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
  Platform,
  Pressable,
  Modal,
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
  const [dataInicio, setDataInicio] = useState(new Date(evento.dataInicio));
  const [dataFim, setDataFim] = useState(new Date(evento.dataFim));
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
  const [modalVisible, setModalVisible] = useState(false);

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
    if (uri.endsWith('.jpg') || uri.endsWith('.jpeg')) return 'image/jpeg';
    if (uri.endsWith('.png')) return 'image/png';
    return 'image/jpeg';
  };

  const handleImageUpload = async eventoId => {
    const mimeType = getImageMimeType(imageUri);
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      name: `profile.${mimeType === 'image/png' ? 'png' : 'jpg'}`,
      type: mimeType,
    });
    try {
      const response = await fetch(`http://${urlIp}:3000/eventos/${eventoId}/imagem`, {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData,
      });
      if (!response.ok) throw new Error('Falha ao enviar a imagem');
      console.log('Imagem enviada com sucesso');
    } catch (error) {
      console.error('Erro ao enviar imagem:', error);
    }
  };

  const handleSalvar = async () => {
    if (
      !titulo.trim() ||
      !descricao.trim() ||
      !objetivo.trim() ||
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
        dataInicio: dataInicio.toISOString().split('T')[0],
        dataFim: dataFim.toISOString().split('T')[0],
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

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://${urlIp}:3000/eventos/${evento.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Erro ao deletar evento');
      
    } catch (error) {
      console.error('Erro ao deletar evento:', error);
      Alert.alert('Erro', 'Não foi possível deletar o evento');
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
          <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} />

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
            <Text>{dataInicio.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showInicio && (
            <DateTimePicker
              value={dataInicio}
              mode="date"
              display="default"
              onChange={(_, d) => {
                setShowInicio(Platform.OS === 'ios');
                if (d) setDataInicio(d);
              }}
            />
          )}

          <Text style={styles.label}>Data de Término</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowFim(true)}>
            <Text>{dataFim.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showFim && (
            <DateTimePicker
              value={dataFim}
              mode="date"
              display="default"
              onChange={(_, d) => {
                setShowFim(Platform.OS === 'ios');
                if (d) setDataFim(d);
              }}
            />
          )}

         
          {['rua', 'numero', 'bairro', 'cidade', 'estado', 'cep'].map(campo => (
            <React.Fragment key={campo}>
              <Text style={styles.label}>
                {campo.charAt(0).toUpperCase() + campo.slice(1)}
              </Text>
              <TextInput
                style={styles.input}
                value={endereco[campo]}
                onChangeText={val => handleEnderecoChange(campo, val)}
                keyboardType={
                  campo === 'numero' || campo === 'cep' ? 'number-pad' : 'default'
                }
              />
            </React.Fragment>
          ))}

        
          <Pressable onPress={pickImage} style={{ alignSelf: 'center', marginVertical: 20 }}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>Selecionar Imagem</Text>
              </View>
            )}
          </Pressable>

        
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.baseButton, styles.saveButton]}
              onPress={handleSalvar}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text
                  style={styles.buttonText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Salvar
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.baseButton, styles.deleteButton]}
              onPress={() => setModalVisible(true)}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Deletar</Text>
            </TouchableOpacity>
          </View>

        
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>
                  Tem certeza que deseja deletar este evento?
                </Text>
                <View style={styles.modalButtons}>
                  <Pressable
                    style={styles.modalCancelButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>Cancelar</Text>
                  </Pressable>
                  <Pressable
                    style={styles.modalConfirmButton}
                    onPress={() => {
                      handleDelete();
                      navigation.navigate('EventosAdm', { userId, abrigoId });
                    }}
                  >
                    <Text style={styles.buttonText}>Confirmar</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
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
    marginTop: 6,
  },
  textArea: { height: 80, textAlignVertical: 'top' },

  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginTop: 20,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 10,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  imagePlaceholderText: {
    color: '#888',
    textAlign: 'center',
  },

  buttonContainer: {
    flexDirection: 'row',
    marginTop: 30,
  },
  baseButton: {
    flex: 1,
    paddingVertical: 8,    
    paddingHorizontal: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center', 
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: '#8A2BE2',
  },
  deleteButton: {
    backgroundColor: '#B22222',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    flexShrink: 1,        
    textAlign: 'center',
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalCancelButton: {
    backgroundColor: '#888',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  modalConfirmButton: {
    backgroundColor: '#B22222',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
  },
});
