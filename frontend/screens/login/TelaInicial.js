import React from 'react';
import { useNavigation } from "@react-navigation/native";
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

function TelaInicialScreen() {
    const navigation = useNavigation();

    return (
        <View style={styles.divCadastro} edges={['top']}>
        <Image
            style={styles.logo}
            source={require('../../img/PET.png')}
        />
        <Pressable
            style={styles.botao}
            onPress={() => navigation.navigate('CadastroUser')} 
        >
            <Text style={styles.textoBotao}>Cadastrar</Text>
        </Pressable>
        <Pressable
            style={styles.botao}
            onPress={() => navigation.navigate('Login')}
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
        justifyContent: 'center', 
        backgroundColor: 'white',
        padding: 20, 
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