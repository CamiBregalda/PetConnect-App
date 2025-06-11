import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, ScrollView, StyleSheet, Text, View, TouchableOpacity, Modal, modalVisible } from 'react-native';
import TextAtualizacaoAbrigoInput from '../../components/TextAtualizacaoAbrigoInput';
import * as ImagePicker from 'expo-image-picker';
import { urlIp } from '@env';

function AtualizarAbrigoScreen() {
    const route = useRoute();
    const { userId, abrigoId } = route.params;

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
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        getAbrigo();
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

    const getAbrigo = async () => {
        try {
            const response = await fetch(`http://${urlIp}:3000/abrigos/${abrigoId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar abrigo');
            }

            const data = await response.json();
            onChangeNome(data.nome);
            onChangeCnpj(data.cnpj);
            onChangeEmail(data.email);
            onChangeTelefone(data.telefone);
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

            const responseImage = await fetch(`http://${urlIp}:3000/abrigos/${abrigoId}/imagem`);
            if (responseImage.ok) {
                setImageUri(`http://${urlIp}:3000/abrigos/${abrigoId}/imagem`);
            }
        } catch (error) {
            console.error('Erro ao buscar abrigo:', error);
        }
    }

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
            const response = await fetch(`http://${urlIp}:3000/abrigos/${abrigoId}/imagem`, {
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
        nome: (nome || '').trim(),
        cnpj: (cnpj || '').trim(),
        email: (email || '').trim(),
        telefone: (telefone || '').trim(),
        descricao: (descricao || '').trim(),
        endereco: {
            rua: (endereco.rua || '').trim(),
            numero: (endereco.numero || '').trim(),
            bairro: (endereco.bairro || '').trim(),
            cidade: (endereco.cidade || '').trim(),
            estado: (endereco.estado || '').trim(),
            cep: (endereco.cep || '').trim(),
        },
    };

    for (const key in bodyData) {
        if (typeof bodyData[key] === 'string' && bodyData[key] === '') {
            delete bodyData[key];
        }

        if (typeof bodyData[key] === 'object') {
            for (const subKey in bodyData[key]) {
                if (typeof bodyData[key][subKey] === 'string' && bodyData[key][subKey] === '') {
                    delete bodyData[key][subKey];
                }
            }
        }
    }

    const handleUpdate = async () => {
        try {
            const response = await fetch(`http://${urlIp}:3000/abrigos/${abrigoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyData),
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar abrigo');
            }

            const data = await response.json();

            if (imageUri) {
                await handleImageUpdate(data.id);
            }

            navigation.navigate('AnimaisUser', { userId: userId });
        } catch (error) {
            console.error('Erro ao fazer update:', error);
            Alert.alert('Erro', 'Atualização inválida');
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://${urlIp}:3000/abrigos/${abrigoId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                throw new Error('Erro ao deletar abrigo');
            }
    
            navigation.navigate('TelaInicial');
        } catch (error) {
            console.error('Erro ao deletar abrigo:', error);
            Alert.alert('Erro', 'Não foi possível deletar o abrigo');
        }
    }

    return (
        <ScrollView>
            <TouchableOpacity onPress={() => navigation.navigate('Main', { userId, abrigoId })} style={styles.backButton}>
                <Ionicons name="arrow-back" size={28} color="#333" />
            </TouchableOpacity>

            <View style={styles.divCadastro} edges={['top']}>
                <Text style={styles.title}>Atualizar Abrigo</Text>
                <TextAtualizacaoAbrigoInput
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

                <View style={styles.buttonContainer}>
                    <Pressable style={styles.updateButton} onPress={handleUpdate}>
                        <Text style={styles.textoBotao}>Atualizar</Text>
                        </Pressable>
                    <Pressable style={styles.deleteButton} onPress={() => setModalVisible(true)}>
                        <Text style={styles.textoBotao}>Deletar</Text>
                    </Pressable>
                </View>
                
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>Tem certeza que deseja deletar conta de usuário?</Text>
                            <View style={styles.modalButtons}>
                                <Pressable
                                    style={styles.modalCancelButton}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.textoBotao}>Cancelar</Text>
                                </Pressable>
                                <Pressable
                                    style={styles.modalConfirmButton}
                                    onPress={() => {
                                        setModalVisible(false);
                                        handleDelete();
                                    }}
                                >
                                    <Text style={styles.textoBotao}>Confirmar</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </ScrollView>
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
    textoBotao: {
        color: 'white',
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        marginTop: 8,
        fontSize: 14,
    },
    botao: {
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 30,
        elevation: 3,
        marginTop: 50,
    },
    updateButton: {
        backgroundColor: '#8A2BE2',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 30,
        marginHorizontal: 5,
    },
    deleteButton: {
        backgroundColor: '#B22222',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 40,
        marginHorizontal: 5,
    },
    textoBotao: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalCancelButton: {
        backgroundColor: '#888',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginHorizontal: 10,
    },
    modalConfirmButton: {
        backgroundColor: '#B22222',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginHorizontal: 10,
    },
});

export default AtualizarAbrigoScreen;