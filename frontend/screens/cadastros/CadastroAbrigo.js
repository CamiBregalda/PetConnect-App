import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import TextCadastroAbrigoInput from '../../components/TextCadastroAbrigoInput';
import * as ImagePicker from 'expo-image-picker';

function CadastroAbrigoScreen() {
    const route = useRoute();
    const { userId } = route.params;

    const navigation = useNavigation();
    const [nome, onChangeNome] = React.useState('');
    const [cnpj, onChangeCnpj] = React.useState('');
    const [email, onChangeEmail] = React.useState('');
    const [telefone, onChangeTelefone] = React.useState('');
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

    const [errors, setErrors] = React.useState({
        nome: false,
        cnpj: false,
        email: false,
        telefone: false,
        descricao: false,
        endereco: {
            rua: false,
            numero: false,
            bairro: false,
            cidade: false,
            estado: false,
            cep: false,
        },
        image: false,
    });

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

    const getImageMimeType = (uri) => {
        if (uri.endsWith('.jpg') || uri.endsWith('.jpeg')) return 'image/jpeg';
        if (uri.endsWith('.png')) return 'image/png';
        return 'image/jpeg';
    };

    const handleImageUpdate = async (abrigoId) => {
        const mimeType = getImageMimeType(imageUri);

        const formData = new FormData();
        formData.append('image', {
            uri: imageUri,
            name: `profile.${mimeType === 'image/png' ? 'png' : 'jpg'}`,
            type: mimeType,
        });

        try {
            const response = await fetch(`http://192.168.3.5:3000/abrigos/${abrigoId}/imagem`, {
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

    const handleCadastro = async () => {
        const newErrors = {
            nome: !nome.trim(),
            cnpj: !cnpj.trim(),
            email: !email.trim(),
            telefone: !telefone.trim(),
            descricao: !descricao.trim(),
            endereco: {
                rua: !endereco.rua.trim(),
                numero: !endereco.numero.trim(),
                bairro: !endereco.bairro.trim(),
                cidade: !endereco.cidade.trim(),
                estado: !endereco.estado.trim(),
                cep: !endereco.cep.trim(),
            },
            image: !imageUri,
        };

        const hasError = Object.values(newErrors).some(e =>
            typeof e === 'object'
                ? Object.values(e).some(v => v)
                : e
        );
        setErrors(newErrors);

        if (hasError) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        try {          
            const response = await fetch(`http://192.168.3.5:3000/abrigos/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome: nome.trim(),
                    cnpj: cnpj.trim(),
                    email: email.trim(),
                    telefone: telefone.trim(),
                    descricao: descricao.trim(),
                    endereco: {
                        rua: endereco.rua.trim(),
                        numero: endereco.numero.trim(),
                        bairro: endereco.bairro.trim(),
                        cidade: endereco.cidade.trim(),
                        estado: endereco.estado.trim(),
                        cep: endereco.cep.trim(),
                    }
                }),
            });

            if (!response.ok) {
                throw new Error('Cadastro inválido');
            }

            const data = await response.json();

            if (imageUri) {
                await handleImageUpdate(data.id);
            }

            navigation.navigate('CadastroAnimal');
        } catch (error) {
            console.error('Erro ao fazer cadastro:', error);
            Alert.alert('Erro', 'Cadastro inválido');
        }
    };

    return (
        <ScrollView>
        <View style={styles.divCadastro} edges={['top']}>
        <Text style={styles.title}>Cadastrar Abrigo</Text>
        <TextCadastroAbrigoInput
            nome={nome}
            onChangeNome={onChangeNome}
            cnpj={cnpj}
            onChangeCnpj={onChangeCnpj}
            email={email}
            onChangeEmail={onChangeEmail}
            telefone={telefone}
            onChangeTelefone={onChangeTelefone}
            endereco={endereco}
            onChangeEndereco={handleEnderecoChange}
            descricao={descricao}
            onChangeDescricao={onChangeDescricao}
            errors={errors}
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

        {errors.image && (
            <Text style={styles.errorText}>Imagem obrigatória</Text>
        )}

        <Pressable
            style={styles.botao}
            onPress={handleCadastro}
        >
            <Text style={styles.textoBotao}>Cadastrar</Text>
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
    imagePlaceholderText: {
        color: '#888',
        textAlign: 'center',
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
    errorText: {
        color: 'red',
        marginTop: 8,
        fontSize: 14,
    },
});

export default CadastroAbrigoScreen;