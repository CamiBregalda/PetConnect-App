import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';

function VoluntarioFormScreen() {
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleVoluntariar = async () => {
    setLoading(true);
    setError(null);

    if (!nome || !idade || !telefone || !email || !endereco) {
      setError('Por favor, preencha todos os campos.');
      setLoading(false);
      return;
    }

    // Aqui você faria a chamada para a sua API para enviar os dados do voluntário
    const apiUrl = 'http://SEU_BACKEND_URL/voluntarios'; // Substitua pela URL correta

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: nome,
          idade: parseInt(idade, 10), 
          telefone: telefone,
          email: email,
          endereco: endereco,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro ao se voluntariar: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
      }

      const responseData = await response.json();
      Alert.alert('Sucesso', 'Seu cadastro de voluntário foi enviado com sucesso!', [
        { text: 'OK', onPress: () => {
          setNome('');
          setIdade('');
          setTelefone('');
          setEmail('');
          setEndereco('');
        } },
      ]);
    } catch (err) {
      setError(`Erro ao se voluntariar: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Candidatar-se como Voluntário"</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome Completo"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Idade"
        value={idade}
        onChangeText={setIdade}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Telefone"
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Endereço"
        value={endereco}
        onChangeText={setEndereco}
        multiline
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && { opacity: 0.8 }, // Feedback visual ao pressionar
        ]}
        onPress={handleVoluntariar}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: 'white', fontSize: 16 }}>Candidatar-se</Text>
        )}
      </Pressable>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    width: 280,
    height: 40,
    margin: 10,
    borderRadius: 30,
    borderWidth: 0.2,
    borderBottomWidth: 1,
    padding: 10,
  },
  button: {
    backgroundColor: '#8A2BE2',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 50,
    elevation: 3,
    marginTop: 50,
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default VoluntarioFormScreen;