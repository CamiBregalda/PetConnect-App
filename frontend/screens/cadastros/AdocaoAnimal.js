import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { urlIp } from '@env'; // Certifique-se de que o arquivo .env está configurado corretamente

function AdocaoAnimal() {
  const route = useRoute();
  const navigation = useNavigation();
  const { animalId } = route.params; // Passe animalId por parâmetro na navegação

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirmarAdocao = async () => {
    if (!email) {
      Alert.alert('Erro', 'Digite o email do usuário.');
      return;
    }
    setLoading(true);
    try {
      // Confirmar adoção
      const response = await fetch(`http://${urlIp}:3000/animais/${animalId}/adotado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erro ao confirmar adoção');
      }

      Alert.alert('Sucesso', 'Adoção confirmada!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Erro', error.message || 'Erro ao confirmar adoção');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirmar Adoção</Text>
      <TextInput
        style={styles.input}
        placeholder="Email do usuário"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TouchableOpacity style={styles.button} onPress={handleConfirmarAdocao} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Confirmando...' : 'Confirmar Adoção'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    width: '100%',
    maxWidth: 350,
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#8A2BE2',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdocaoAnimal;