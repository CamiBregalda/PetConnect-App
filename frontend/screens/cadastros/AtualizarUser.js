import React, { useEffect, useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import { Image, Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import TextAtualizarUserInput from '../../components/TextAtualizacaoUserInput';

function AtualizarUserScreen() {
    const navigation = useNavigation();
    const userId = route.params.userId;

    const [name, onChangeName] = React.useState('');
    const [cpf, onChangeCpf] = React.useState('');
    const [telefone, onChangeTelefone] = React.useState('');
    const [idade, onChangeIdade] = React.useState('');
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
    const [imageUri, setImageUri] = useState(null);

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
                setImageUri(result.assets[0].uri);
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
            const response = await fetch(`http://192.168.238.226:3000/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar usuário');
            }

            const data = await response.json();
            onChangeName(data.nome);
            onChangeCpf(data.cpf);
            onChangeTelefone(data.telefone);
            onChangeIdade(data.idade);
            onChangeOcupacao(data.ocupacao);
            onChangeEndereco(data.endereco);
            onChangeDescricao(data.descricao);

            const imageResponse = await fetch(`http://192.168.238.226:3000/users/${userId}/image`);
            if (imageResponse.ok) {
                const imageBlob = await imageResponse.blob();
                const imageUrl = URL.createObjectURL(imageBlob);
                setImageUri(imageUrl);
            }
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
        }
    }

    const handleUpdate = async () => {
        try {
            const response = await fetch(`http://192.168.238.226:3000/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome: name.trim(),
                    cpf: cpf.trim(),
                    telefone: telefone.trim(),
                    idade: idade.trim(),
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
                }),
            });

            if (!response.ok) {
                throw new Error('Cadastro inválido');
            }

            const data = await response.json();
            navigation.navigate('Login');
        } catch (error) {
            console.error('Erro ao fazer cadastro:', error);
            Alert.alert('Erro', 'Cadastro inválido');
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
                name={name}
                onChangeName={onChangeName}
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
                        <Text>Selecionar Imagem</Text>
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
});

export default AtualizarUserScreen;