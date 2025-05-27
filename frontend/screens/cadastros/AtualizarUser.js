import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Image, Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import TextAtualizarUserInput from '../../components/TextAtualizacaoUserInput';
import { urlIp } from '@env';
import * as ImagePicker from 'expo-image-picker';


function AtualizarUserScreen() {
    const route = useRoute();
    const { userId } = route.params;
    const navigation = useNavigation();

    const [nome, onChangeNome] = React.useState('');
    const [cpf, onChangeCpf] = React.useState('');
    const [telefone, onChangeTelefone] = React.useState('');
    const [idade, onChangeIdade] = React.useState(null);
    const [ocupacao, onChangeOcupacao] = React.useState('');
    const [descricao, onChangeDescricao] = React.useState('');
    const [endereco, onChangeEndereco] = React.useState({
        rua: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: '',
    });
    const [imageUri, onChangeImageUri] = React.useState(null);

    useEffect(() => {
        getUser();
    }, []);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            onChangeImageUri(result.assets[0].uri);
        }
    };

    const handleEnderecoChange = (campo, valor) => {
        onChangeEndereco((prev) => ({
            ...prev,
            [campo]: valor,
        }));
    };

    const getUser = async () => {
        try {

            const response = await fetch(`http://${urlIp}:3000/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar usuário');
            }

            const data = await response.json();
            onChangeNome(data.nome);
            onChangeCpf(data.cpf);
            onChangeTelefone(data.telefone);
            onChangeIdade(data.idade);
            onChangeOcupacao(data.ocupacao);
            onChangeDescricao(data.descricao);
            onChangeEndereco(
                data.endereco && typeof data.endereco === 'object'
                    ? data.endereco
                    : {
                        rua: '',
                        numero: '',
                        bairro: '',
                        cidade: '',
                        estado: '',
                        cep: '',
                    }
            );


            const imageResponse = await fetch(`http://${urlIp}:3000/users/${userId}/image`);
            if (imageResponse.ok) {
                const imageBlob = await imageResponse.blob();
                const imageUrl = URL.createObjectURL(imageBlob);
                setImageUri(imageUrl);

            }
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
        }
    }

    const getImageMimeType = (uri) => {
        if (uri.endsWith('.jpg') || uri.endsWith('.jpeg')) return 'image/jpeg';
        if (uri.endsWith('.png')) return 'image/png';
        return 'image/jpeg';
    };

    const handleImageUpdate = async () => {
        const mimeType = getImageMimeType(imageUri);

        const formData = new FormData();
        formData.append('image', {
            uri: imageUri,
            name: `profile.${mimeType === 'image/png' ? 'png' : 'jpg'}`,
            type: mimeType,
        });

        try {
            const response = await fetch(`http://${urlIp}:3000/users/${userId}/imagem`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Falha ao enviar a imagem');
            }

            console.log('Imagem enviada com sucesso');
        } catch (error) {
            console.error('Erro ao enviar imagem:', error);
        }
    };

    const bodyData = {
        nome: nome.trim(),
        cpf: cpf.trim(),
        telefone: telefone.trim(),
        idade: idade ? parseInt(idade, 10) : 0,
        ocupacao: ocupacao.trim(),
        descricao: descricao.trim(),
        endereco: {
            rua: endereco.rua.trim(),
            numero: endereco.numero.trim(),
            bairro: endereco.bairro.trim(),
            cidade: endereco.cidade.trim(),
            estado: endereco.estado.trim(),
            cep: endereco.cep.trim(),
        },
    };

    for (const key in bodyData) {
        if (typeof bodyData[key] === 'string' && bodyData[key] === '') {
            delete bodyData[key];
        }
    }

    const handleUpdate = async () => {
        try {

            const response = await fetch(`http://${urlIp}:3000/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyData),
            });

            if (!response.ok) {
                throw new Error('Falha ao atualizar usuário');
            }

            if (imageUri) {
                await handleImageUpdate();
            }

            navigation.navigate('InicialUser', { userId: userId });
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            Alert.alert('Erro', 'Atualização inválida');
        }
    };

    return (
        <ScrollView>
        <View style={styles.divCadastro} edges={['top']}>
            <Image
                style={styles.logo}
                source={require('../../img/PET.png')}
            />
            <TextAtualizarUserInput
                nome={nome}
                onChangeNome={onChangeNome}
                cpf={cpf}
                onChangeCpf={onChangeCpf}
                telefone={telefone}
                onChangeTelefone={onChangeTelefone}
                idade={idade}
                onChangeIdade={onChangeIdade}
                ocupacao={ocupacao}
                onChangeOcupacao={onChangeOcupacao}
                descricao={descricao}
                onChangeDescricao={onChangeDescricao}
                endereco={endereco}
                onChangeEndereco={handleEnderecoChange}
            />

            <Pressable onPress={pickImage}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.image} />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Text style={styles.imagePlaceholderText}>Selecionar Imagem</Text>
                    </View>
                )}
            </Pressable>

            <Pressable
                style={styles.botao}
                onPress={handleUpdate}
            >
                <Text style={styles.textoBotao}>Atualizar</Text>
            </Pressable>
        </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    divCadastro: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        padding: 50,
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
    imagePlaceholderText: {
        color: '#888',
        textAlign: 'center',
    },
});

export default AtualizarUserScreen;