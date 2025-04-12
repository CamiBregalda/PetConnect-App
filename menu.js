import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const BottomMenu = () => {
    const navigation = useNavigation();
    const route = useRoute(); // Obtém a rota atual

    return (
        <View style={styles.menuContainer}>
            <Pressable
                style={[
                    styles.menuItem,
                    route.name === 'Utilidades' && styles.activeMenuItem, // Estilo condicional para Utilidades
                ]}
                onPress={() => navigation.navigate('Utilidades')}
            >
                <Image
                        style={styles.logo}
                        source={require('./img/Estrela.png')}
                      />
            </Pressable>

            <Pressable
                style={[
                    styles.menuItem,
                    route.name === 'Home' && styles.activeMenuItem, // Estilo condicional para Home
                ]}
                onPress={() => navigation.navigate('Home')}
            >
                <Image
                        style={styles.logo}
                        source={require('./img/Home.png')}
                      />
            </Pressable>

            <Pressable
                style={[
                    styles.menuItem,
                    route.name === 'Perfil' && styles.activeMenuItem, // Estilo condicional para Perfil
                ]}
                onPress={() => navigation.navigate('Perfil')}
            >
                <Image
                        style={styles.logo}
                        source={require('./img/User.png')}
                      />
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    menuContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    menuItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 50,
        height: 50,
    },
    activeMenuItem: {
        backgroundColor: '#8A2BE2', // Cor de fundo para o item ativo
        borderRadius: 5, // Opcional: Adiciona bordas arredondadas
        paddingVertical: 10,
    },
});

export default BottomMenu;