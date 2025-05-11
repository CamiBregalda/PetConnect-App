import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';

function VoluntarioFormScreen() {
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [cep, setCep] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const route = useRoute();
  const { abrigoId } = route.params || {};

  const userId = '681ea614e52f3511668cda67'; // Substitua pela forma real de obter o ID

  const handleVoluntariar = async () => {
    setLoading(true);
    setError(null);

    if (!nome || !idade || !telefone || !email) {
      setError('Por favor, preencha todos os campos e certifique-se do ID do abrigo e do usuário.');
      setLoading(false);
      return;
    }

    try {
      const volunteerUrl = `http://192.168.3.7:3000/candidaturas`; // Rota para adicionar candidatura
      const volunteerResponse = await fetch(volunteerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          abrigoId: abrigoId,
          userId: userId,
          nome: nome,
          idade: parseInt(idade, 10),
          telefone: telefone,
          email: email,
          cargo: 'Voluntario',
          curriculo: 'N/A',
          aprovacao: false,
        }),
      });

      const volunteerResponseText = await volunteerResponse.text();
      console.log('Resposta da candidatura:', volunteerResponseText);

      if (!volunteerResponse.ok) {
        // Agora, se a resposta não for ok, tentamos obter o JSON para logar o erro do servidor, se disponível.
        try {
          const errorData = await volunteerResponse.json();
          throw new Error(`Erro ao candidatar-se ao abrigo: ${volunteerResponse.status} - ${errorData.message || 'Erro desconhecido'}`);
        } catch (jsonError) {
          // Se não for um JSON válido, lançamos o texto da resposta
          throw new Error(`Erro ao candidatar-se ao abrigo: ${volunteerResponse.status} - ${volunteerResponseText || 'Erro desconhecido'}`);
        }
      }

      // Se chegamos aqui, a resposta foi ok, então parseamos o JSON.
      const responseData = await volunteerResponse.json();
      Alert.alert('Sucesso', 'Sua candidatura foi enviada com sucesso!', [
        {
          text: 'OK', onPress: () => {
            setNome('');
            setIdade('');
            setTelefone('');
            setEmail('');
          }
        },
      ]);
    } catch (err) {
      setError(`Erro ao realizar a operação: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Candidatar-se como Voluntário</Text>

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
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && { opacity: 0.8 },
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

