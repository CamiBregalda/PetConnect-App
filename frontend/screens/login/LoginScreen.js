import React from 'react';
//import * as Crypto from 'expo-crypto';
import { useNavigation } from "@react-navigation/native";
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import TextLoginInput from '../../components/TextLoginInput';

function LoginScreen() {
  const navigation = useNavigation();
    const [username, onChangeUsername] = React.useState('');
    const [password, onChangePassword] = React.useState('');

    const [errors, setErrors] = React.useState({
      username: false,
      password: false,
    });

  const handleLogin = async () => {
    const newErrors = {
      username: !username.trim(),
      password: !password.trim(),
    };

    const hasError = Object.values(newErrors).some(e => e);
    setErrors(newErrors);

    if (hasError) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
        return;
    }
/*
    const hashedPassword  = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    );*/

    try {
      const response = await fetch('http://192.168.3.5:3000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: username.trim(),
          senha: password.trim(),
        }),
      });

      console.log('Response:', response);

      if (!response.ok) {
        throw new Error('Login inválido');
      }

      const data = await response.json();
      navigation.navigate('User', { email: data.email });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      Alert.alert('Erro', 'Login ou senha inválidos');
    }
  };

  return (
    <View style={styles.divCadastro} edges={['top']}>
      <Image
        style={styles.logo}
        source={require('../../img/PET.png')}
      />
      <TextLoginInput
        username={username}
        onChangeUsername={onChangeUsername}
        password={password}
        onChangePassword={onChangePassword}
        errors={errors}
      />
      <Pressable style={styles.botao} onPress={handleLogin}>
        <Text style={styles.textoBotao}>Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  divCadastro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },
  botao: {
    backgroundColor: '#8A2BE2',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 80,
    elevation: 3,
    marginTop: 50,
  },
  textoBotao: {
    color: 'white',
    fontSize: 16,
  },
});

export default LoginScreen;