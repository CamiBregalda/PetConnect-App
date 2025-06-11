import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import { Image, Pressable, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TextLoginInput from '../../components/TextLoginInput';
import { urlIp } from '@env';

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
      const response = await fetch(`http://${urlIp}:3000/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: username.trim(),
          senha: password.trim(),
        }),
      });


      if (!response.ok) {
        throw new Error('Login inválido');
      }

      const data = await response.json();
      
      await AsyncStorage.setItem('userId', data.id);
      navigation.navigate('TelaPrincipal', { userId: data.id });
      
      
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      Alert.alert('Erro', 'Login ou senha inválidos');
    }
  };

  return (
    <View style={styles.divCadastro} edges={['top']}>
      
      <TouchableOpacity onPress={() => navigation.navigate('TelaInicial')} style={styles.backButton}>
        <Ionicons name="arrow-back" size={28} color="#333" />
      </TouchableOpacity>

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
  backButton: {
    position: 'absolute',
    top: 40,     
    left: 16,
    zIndex: 1,
  },
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