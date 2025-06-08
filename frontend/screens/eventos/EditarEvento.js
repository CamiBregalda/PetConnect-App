import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { urlIp } from '@env';

export default function EditarEvento() {
  const navigation = useNavigation();
  const route = useRoute();
  const { evento } = route.params || {};
  console.log('Evento recebido na tela de edição:', evento);

  const [titulo, setTitulo] = useState(evento?.titulo || '');
  const [descricao, setDescricao] = useState(evento?.descricao || '');
  const [objetivo, setObjetivo] = useState(evento?.objetivo || '');
  const [dataInicio, setDataInicio] = useState(evento?.dataInicio || '');
  const [dataFim, setDataFim] = useState(evento?.dataFim || '');
  const [rua, setRua] = useState(evento?.endereco?.rua || '');
  const [numero, setNumero] = useState(evento?.endereco?.numero || '');
  const [bairro, setBairro] = useState(evento?.endereco?.bairro || '');
  const [cidade, setCidade] = useState(evento?.endereco?.cidade || '');
  const [estado, setEstado] = useState(evento?.endereco?.estado || '');
  const [cep, setCep] = useState(evento?.endereco?.cep || '');
  const [imageUri, setImageUri] = useState(evento?.imagemUrl || null);
  const [loading, setLoading] = useState(false);
  const [showInicio, setShowInicio] = useState(false);
  const [showFim, setShowFim] = useState(false);

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

  const handleSalvar = async () => {
    setLoading(true);
    try {

      const response = await fetch(`http://${urlIp}:3000/eventos/${evento._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titulo: titulo.trim(),
          descricao: descricao.trim(),
          objetivo: objetivo.trim(),
          dataInicio: dataInicio.trim(),
          dataFim: dataFim.trim(),
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
        throw new Error(errorText || 'Erro ao atualizar evento');
      }

      const data = await response.json();

      if (imageUri && imageUri !== evento.imagemUrl) {
        await handleImageUpload(evento._id);
      }

      Alert.alert('Sucesso', 'Evento atualizado com sucesso!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', error.message || 'Erro ao atualizar evento');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (eventoId) => {
    if (!imageUri || imageUri === evento.imagemUrl) return;

    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        name: `evento.jpg`,
        type: 'image/jpeg',
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

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.voltar}>
        <Ionicons name="arrow-back" size={28} color="#222" />
      </TouchableOpacity>

      <Text style={styles.titulo}>Edite seu Evento</Text>

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
            onChange={(event, selectedDate) => {
              setShowInicio(false);
              if (selectedDate) {
                setDataInicio(selectedDate.toISOString().split('T')[0]);
              }
            }}
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
            onChange={(event, selectedDate) => {
              setShowFim(false);
              if (selectedDate) {
                setDataFim(selectedDate.toISOString().split('T')[0]);
              }
            }}
          />
        )}

        <TextInput placeholder="Rua" style={styles.input} value={rua} onChangeText={setRua} />
        <TextInput placeholder="Número" style={styles.input} value={numero} onChangeText={setNumero} />
        <TextInput placeholder="Bairro" style={styles.input} value={bairro} onChangeText={setBairro} />
        <TextInput placeholder="Cidade" style={styles.input} value={cidade} onChangeText={setCidade} />
        <TextInput placeholder="Estado" style={styles.input} value={estado} onChangeText={setEstado} />
        <TextInput placeholder="CEP" style={styles.input} value={cep} onChangeText={setCep} />

        <View style={styles.imageUpload}>
          <Text style={styles.imageLabel}>Imagem do Evento</Text>
          <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={{ width: 80, height: 80, borderRadius: 8 }} />
            ) : (
              <Text style={styles.plus}>+</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.botao} onPress={handleSalvar} disabled={loading}>
          <Text style={styles.textoBotao}>{loading ? 'Salvando...' : 'Salvar Alterações'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f1f1', paddingTop: 50 },
  voltar: { marginLeft: 16, marginBottom: 10 },
  titulo: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 16, color: '#333' },
  form: { paddingHorizontal: 16, paddingBottom: 50 },
  input: { backgroundColor: 'white', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12, fontSize: 14 },
  textArea: { height: 100, textAlignVertical: 'top' },
  imageUpload: { marginBottom: 20 },
  imageLabel: { fontWeight: 'bold', marginBottom: 8 },
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
  plus: { fontSize: 24, color: '#333' },
  botao: { backgroundColor: '#9333ea', paddingVertical: 12, borderRadius: 6, alignItems: 'center' },
  textoBotao: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});