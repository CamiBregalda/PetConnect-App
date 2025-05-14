import React, { useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import { Image, Pressable, StyleSheet, Text, View, ScrollView  } from 'react-native';
import TextCadastroAnimalInput from '../../components/TextCadastroAnimalInput';
import * as ImagePicker from 'expo-image-picker';

function CadastroAnimalScreen() {
    const navigation = useNavigation();
    const [imageUri, setImageUri] = useState(null);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    return (
        <ScrollView>
        <View style={styles.divCadastro} edges={['top']}>
        <Text style={styles.title}>Cadastrar Animal</Text>
        <TextCadastroAnimalInput />

        <Pressable onPress={pickImage}>
            {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.image} />
            ) : (
                <View style={styles.imagePlaceholder}>
                    <Text>Selecionar Imagem</Text>
                </View>
            )}
        </Pressable>

        <Pressable
            style={styles.botao}
            onPress={() => navigation.navigate('User')} // Navega para o TabNavigator
        >
            <Text style={styles.textoBotao}>Cadastrar 2</Text>
        </Pressable>
        </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({

    divCadastro: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center', // Centraliza o conteúdo na tela de login
        backgroundColor: 'white',
        padding: 50, // Adicionado um padding para o conteúdo não ficar nas bordas
        
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
        marginTop: 15,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 10,
        marginTop: 20,
    },
    imagePlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 10,
        backgroundColor: '#eee',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
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

export default CadastroAnimalScreen;