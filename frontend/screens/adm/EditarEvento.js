import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function EditarEvento() {
  const navigation = useNavigation();
  const route = useRoute();
  const { evento } = route.params;

  const [nome, setNome] = useState(evento?.titulo || '');
  const [rua, setRua] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [objetivo, setObjetivo] = useState(evento?.objetivo || '');
  const [dataInicio, setDataInicio] = useState(evento?.dataInicio || '');
  const [dataFim, setDataFim] = useState(evento?.dataFim || '');
  const [detalhes, setDetalhes] = useState(evento?.detalhes || '');

  const handleSalvar = () => {
    // Aqui você pode integrar com a API futuramente
    console.log('Evento atualizado:', {
      nome, rua, bairro, cidade, objetivo, dataInicio, dataFim, detalhes
    });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Edite seu Evento</Text>

      <ScrollView contentContainerStyle={styles.form}>
        <TextInput
          placeholder="Nome"
          style={styles.input}
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          placeholder="Rua"
          style={styles.input}
          value={rua}
          onChangeText={setRua}
        />
        <TextInput
          placeholder="Bairro"
          style={styles.input}
          value={bairro}
          onChangeText={setBairro}
        />
        <TextInput
          placeholder="Cidade"
          style={styles.input}
          value={cidade}
          onChangeText={setCidade}
        />
        <TextInput
          placeholder="Objetivo"
          style={styles.input}
          value={objetivo}
          onChangeText={setObjetivo}
        />
        <TextInput
          placeholder="Data de Início"
          style={styles.input}
          value={dataInicio}
          onChangeText={setDataInicio}
        />
        <TextInput
          placeholder="Data Final"
          style={styles.input}
          value={dataFim}
          onChangeText={setDataFim}
        />
        <TextInput
          placeholder="Detalhes do Evento"
          style={[styles.input, styles.textArea]}
          value={detalhes}
          onChangeText={setDetalhes}
          multiline
        />

        <View style={styles.imageUpload}>
          <Text style={styles.imageLabel}>Adicionar Foto</Text>
          <TouchableOpacity style={styles.imageBox}>
            <Text style={styles.plus}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.botao} onPress={handleSalvar}>
          <Text style={styles.textoBotao}>Salvar Alterações</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f1f1', paddingTop: 50 },
  voltar: { marginLeft: 16, marginBottom: 10 },
  voltarTexto: { color: '#9333ea', fontSize: 16 },
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
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
});
