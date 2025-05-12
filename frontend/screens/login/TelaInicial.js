import React from 'react';
import { useNavigation } from "@react-navigation/native";
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

function TelaInicialScreen() {
    const navigation = useNavigation();

    return (
        <View style={styles.divCadastro} edges={['top']}>
        <Image
            style={styles.logo}
            source={require('../../img/PET.png')} // Ajuste o path se necessário
        />
        <Pressable
            style={styles.botao}
            onPress={() => navigation.navigate('CadastroUser')} // Navega para o TabNavigator
        >
            <Text style={styles.textoBotao}>Cadastrar</Text>
        </Pressable>
        <Pressable
            style={styles.botao}
            onPress={() => navigation.navigate('Login')} // Navega para o TabNavigator
        >
            <Text style={styles.textoBotao}>Logar</Text>
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
        width: 200,
        height: 200,
        marginBottom: 110,
    },
    botao: {
        backgroundColor: '#8A2BE2',
        borderRadius: 5,
        paddingVertical: 10,
        elevation: 3,
        marginBottom: 30,
        width: '50%',
        alignItems: 'center',
    },
    textoBotao: {
        color: 'white',
        fontSize: 16,
    },
});

export default TelaInicialScreen;