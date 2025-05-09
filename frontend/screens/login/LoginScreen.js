import React from 'react';
import { useNavigation } from "@react-navigation/native";
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import TextInputExample from '../../text'; // Ajuste o path se necessário

function LoginScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.divCadastro} edges={['top']}>
      <Image
        style={styles.logo}
        source={require('../../img/PET.png')} // Ajuste o path se necessário
      />
      <TextInputExample />
      <Pressable
        style={styles.botao}
        onPress={() => navigation.navigate('User')} // Navega para o TabNavigator
      >
        <Text style={styles.textoBotao}>Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  divCadastro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', // Centraliza o conteúdo na tela de login
    backgroundColor: 'white',
    padding: 20, // Adicionado um padding para o conteúdo não ficar nas bordas
  },
  logo: {
    width: 150,
    height: 150,
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