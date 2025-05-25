import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function CriarEvento() {
  const navigation = useNavigation();

  const [nome, setNome] = useState('');
  const [rua, setRua] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [detalhes, setDetalhes] = useState('');

  const handleCriar = () => {
    // Aqui você conectaria com o backend futuramente
    console.log('Evento criado:', {
      nome, rua, bairro, cidade, objetivo, dataInicio, dataFim, detalhes,
    });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Voltar */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.voltar}>
        <Ionicons name="arrow-back" size={28} color="#222" />
      </TouchableOpacity>

      <Text style={styles.titulo}>Crie um Evento</Text>

      <ScrollView contentContainerStyle={styles.form}>
        <TextInput placeholder="Nome" style={styles.input} value={nome} onChangeText={setNome} />
        <TextInput placeholder="Rua" style={styles.input} value={rua} onChangeText={setRua} />
        <TextInput placeholder="Bairro" style={styles.input} value={bairro} onChangeText={setBairro} />
        <TextInput placeholder="Cidade" style={styles.input} value={cidade} onChangeText={setCidade} />
        <TextInput placeholder="Objetivo" style={styles.input} value={objetivo} onChangeText={setObjetivo} />
        <TextInput placeholder="Data de Início" style={styles.input} value={dataInicio} onChangeText={setDataInicio} />
        <TextInput placeholder="Data Final" style={styles.input} value={dataFim} onChangeText={setDataFim} />
        <TextInput
          placeholder="Detalhes do Evento"
          style={[styles.input, styles.textArea]}
          value={detalhes}
          onChangeText={setDetalhes}
          multiline
        />

        {/* Adicionar imagem (simulado) */}
        <View style={styles.imageUpload}>
          <Text style={styles.imageLabel}>Adicionar Foto</Text>
          <TouchableOpacity style={styles.imageBox}>
            <Text style={styles.plus}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Botão Final */}
        <TouchableOpacity style={styles.botao} onPress={handleCriar}>
          <Text style={styles.textoBotao}>Criar Evento</Text>
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
