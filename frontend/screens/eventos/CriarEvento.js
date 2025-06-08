import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { urlIp } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CriarEvento() {
  const navigation = useNavigation();

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [cep, setCep] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showInicio, setShowInicio] = useState(false);
  const [showFim, setShowFim] = useState(false);
  const [idUsuario, setIdUsuario] = useState('');
  const [idAbrigo, setIdAbrigo] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('userId').then(id => {
      if (id) setIdUsuario(id);
      else Alert.alert('Erro', 'Usuário não identificado!');
    });
  }, []);

  useEffect(() => {
    const fetchAbrigo = async () => {
      if (idUsuario) {
        try {
          const response = await fetch(`http://${urlIp}:3000/admAbrigo/${idUsuario}/abrigo`);
          const data = await response.json();
          if (data && data.abrigo && data.abrigo.id) {
            setIdAbrigo(data.abrigo.id);
          } else {
            Alert.alert('Erro', 'Não foi possível encontrar o abrigo do usuário.');
          }
        } catch (err) {
          Alert.alert('Erro', 'Erro ao buscar abrigo do usuário.');
        }
      }
    };
    fetchAbrigo();
  }, [idUsuario]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
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

  const handleImageUpload = async (eventoId) => {
  if (!imageUri) return;

  try {
    const mimeType = getImageMimeType(imageUri);

    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      name: `evento.${mimeType === 'image/png' ? 'png' : 'jpg'}`,
      type: mimeType,
    });

    const response = await fetch(`http://${urlIp}:3000/eventos/${eventoId}/imagem`, {
      method: 'POST',
      body: formData, 
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Erro ao enviar a imagem');
    }

    console.log('Imagem enviada com sucesso!');
  } catch (error) {
    console.error('Erro ao enviar a imagem:', error);
    throw new Error('Falha ao enviar a imagem');
  }
};

  const handleCriar = async () => {
    if (!idAbrigo) {
      Alert.alert('Erro', 'Não foi possível identificar o abrigo do usuário.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://${urlIp}:3000/eventos/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titulo: titulo.trim(),
          descricao: descricao.trim(),
          objetivo: objetivo.trim(),
          dataInicio: dataInicio.trim(),
          dataFim: dataFim.trim(),
          idAbrigo: idAbrigo,
          endereco: {
            rua: rua.trim(),
            numero: numero.trim(),
            bairro: bairro.trim(),
            cidade: cidade.trim(),
            estado: estado.trim(),
            cep: cep.trim(),
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erro ao criar evento');
      }

      const data = await response.json();

      if (imageUri) {
        await handleImageUpload(novoEventoId);
      }

      Alert.alert('Sucesso', 'Evento criado com sucesso!');
      navigation.navigate('EventosAdm'); 
    } catch (error) {
      Alert.alert('Erro', error.message || 'Erro ao criar evento');
    } finally {
      setLoading(false);
    }
  };

  const onChangeInicio = (event, selectedDate) => {
    setShowInicio(Platform.OS === 'ios');
    if (selectedDate) {
      const dataFormatada = selectedDate.toISOString().split('T')[0];
      setDataInicio(dataFormatada);
    }
  };

  const onChangeFim = (event, selectedDate) => {
    setShowFim(Platform.OS === 'ios');
    if (selectedDate) {
      const dataFormatada = selectedDate.toISOString().split('T')[0];
      setDataFim(dataFormatada);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.voltar}>
        <Ionicons name="arrow-back" size={28} color="#222" />
      </TouchableOpacity>

      <Text style={styles.titulo}>Crie um Evento</Text>

      <ScrollView contentContainerStyle={styles.form}>
        <TextInput placeholder="Título" style={styles.input} value={titulo} onChangeText={setTitulo} />


        <TextInput
          placeholder="Descrição"
          style={[styles.input, styles.textArea]}
          value={descricao}
          onChangeText={setDescricao}
          multiline
          numberOfLines={5}
        />

        <TextInput placeholder="Objetivo" style={styles.input} value={objetivo} onChangeText={setObjetivo} />

        <TouchableOpacity onPress={() => setShowInicio(true)} style={styles.input}>
          <Text style={{ color: dataInicio ? '#222' : '#888' }}>
            {dataInicio ? dataInicio.split('-').reverse().join('/') : 'Data de Início'}
          </Text>
        </TouchableOpacity>
        {showInicio && (
          <DateTimePicker
            value={dataInicio ? new Date(dataInicio) : new Date()}
            mode="date"
            display="default"
            onChange={onChangeInicio}
          />
        )}

        <TouchableOpacity onPress={() => setShowFim(true)} style={styles.input}>
          <Text style={{ color: dataFim ? '#222' : '#888' }}>
            {dataFim ? dataFim.split('-').reverse().join('/') : 'Data Final'}
          </Text>
        </TouchableOpacity>
        {showFim && (
          <DateTimePicker
            value={dataFim ? new Date(dataFim) : new Date()}
            mode="date"
            display="default"
            onChange={onChangeFim}
          />
        )}

        <Text style={styles.label}>Endereço</Text>
        <TextInput placeholder="Rua" style={styles.input} value={rua} onChangeText={setRua} />
        <TextInput placeholder="Número" style={styles.input} value={numero} onChangeText={setNumero} />
        <TextInput placeholder="Bairro" style={styles.input} value={bairro} onChangeText={setBairro} />
        <TextInput placeholder="Cidade" style={styles.input} value={cidade} onChangeText={setCidade} />
        <TextInput placeholder="Estado" style={styles.input} value={estado} onChangeText={setEstado} />
        <TextInput placeholder="CEP" style={styles.input} value={cep} onChangeText={setCep} />

        <View style={styles.imageUpload}>
          <Text style={styles.imageLabel}>Adicionar Foto</Text>
          <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={{ width: 80, height: 80, borderRadius: 8 }} />
            ) : (
              <Text style={styles.plus}>+</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.botao} onPress={handleCriar} disabled={loading}>
          <Text style={styles.textoBotao}>{loading ? 'Criando...' : 'Criar Evento'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f1f1', paddingTop: 50 },
  voltar: { marginLeft: 16, marginBottom: 10 },
  voltarTexto: { color: '#9333ea', fontSize: 16 },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  form: {
    paddingHorizontal: 16,
    paddingBottom: 50,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 4,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 14,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageUpload: {
    marginBottom: 20,
  },
  imageLabel: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  imageBox: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  plus: {
    fontSize: 24,
    color: '#333',
  },
  botao: {
    backgroundColor: '#9333ea',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});