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
  Pressable
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { urlIp } from '@env';

export default function CriarEvento() {
  const navigation = useNavigation();
  const { userId, abrigoId } = useRoute().params;

  const [titulo, onChangeTitulo] = useState('');
  const [descricao, onChangeDescricao] = useState('');
  const [objetivo, onChangeObjetivo] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [endereco, setEndereco] = useState({
    rua: '', numero: '', bairro: '',
    cidade: '', estado: '', cep: ''
  });

  const [imageUri, setImageUri] = useState(null);
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

  const getImageMimeType = (uri) => {
      if (uri.endsWith('.jpg') || uri.endsWith('.jpeg')) return 'image/jpeg';
        if (uri.endsWith('.png')) return 'image/png';
          return 'image/jpeg';
        };
  
        const handleImageUpdate = async (eventoId) => {
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
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            body: formData,
          });
  
          if (!response.ok) {
            throw new Error('Falha ao enviar a imagem');
          }
  
          console.log('Imagem enviada com sucesso');
        } catch (error) {
          console.error('Erro ao enviar imagem:', error);
        }
    };

  const handleCriar = async () => {
    if (!abrigoId) {
      Alert.alert('Erro', 'Abrigo não identificado.');
      return;
    }

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
        idAbrigo: abrigoId,
        endereco: {
          rua: endereco.rua.trim(),
          numero: endereco.numero.trim(),
          bairro: endereco.bairro.trim(),
          cidade: endereco.cidade.trim(),
          estado: endereco.estado.trim(),
          cep: endereco.cep.trim(),
        },
      };

      const response = await fetch(`http://${urlIp}:3000/eventos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });
      
      if (!response.ok) {
        throw new Error('Erro ao atualizar evento');
      }
      const data = await response.json();

      if (imageUri) {
        await handleImageUpdate(data.id);
      }

      navigation.navigate('EventosAdm', { userId, abrigoId });
    } catch (err) {
      console.error('Erro ao criar evento:', err);
      Alert.alert('Erro', err.message || 'Não foi possível criar.');
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
        <Text style={styles.headerTitle}>Crie um Evento</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.container}>

          <Text style={styles.label}>Título</Text>
          <TextInput
            style={styles.input}
            value={titulo}
            onChangeText={onChangeTitulo}
          />

          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={descricao}
            onChangeText={onChangeDescricao}
            multiline
          />

          <Text style={styles.label}>Objetivo</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={objetivo}
            onChangeText={onChangeObjetivo}
            multiline
          />

          <Text style={styles.label}>Data de Início</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowInicio(true)}>
            <Text>{dataInicio || 'Selecionar data'}</Text>
          </TouchableOpacity>
          {showInicio && (
            <DateTimePicker
              value={dataInicio ? new Date(dataInicio) : new Date()}
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
              value={dataFim ? new Date(dataFim) : new Date()}
              mode="date"
              display="default"
              onChange={(_, d) => {
                setShowFim(Platform.OS === 'ios');
                if (d) setDataFim(d.toISOString().split('T')[0]);
              }}
            />
          )}

          {/* Campo Endereço com labels separados */}
          <Text style={styles.label}>Rua</Text>
          <TextInput
            style={styles.input}
            value={endereco.rua}
            onChangeText={val => handleEnderecoChange('rua', val)}
          />

          <Text style={styles.label}>Número</Text>
          <TextInput
            style={styles.input}
            value={endereco.numero}
            onChangeText={val => handleEnderecoChange('numero', val)}
            keyboardType="number-pad"
          />

          <Text style={styles.label}>Bairro</Text>
          <TextInput
            style={styles.input}
            value={endereco.bairro}
            onChangeText={val => handleEnderecoChange('bairro', val)}
          />

          <Text style={styles.label}>Cidade</Text>
          <TextInput
            style={styles.input}
            value={endereco.cidade}
            onChangeText={val => handleEnderecoChange('cidade', val)}
          />

          <Text style={styles.label}>Estado</Text>
          <TextInput
            style={styles.input}
            value={endereco.estado}
            onChangeText={val => handleEnderecoChange('estado', val)}
          />

          <Text style={styles.label}>CEP</Text>
          <TextInput
            style={styles.input}
            value={endereco.cep}
            onChangeText={val => handleEnderecoChange('cep', val)}
            keyboardType="number-pad"
          />

          <Pressable onPress={pickImage} style={{ alignSelf: 'center', marginVertical: 20 }}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderText}>Selecionar Imagem</Text>
              </View>
            )}
          </Pressable>

          <TouchableOpacity
            style={styles.button}
            onPress={handleCriar}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.buttonText}>Criar Evento</Text>
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
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
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
  imageBox: {
    width: 80,
    height: 80,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  plus: { fontSize: 32, color: '#888' },
  button: {
    backgroundColor: '#8A2BE2',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
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
});
