import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Image, Pressable, StyleSheet, Text, View, ScrollView, Alert, Modal, modalVisible } from 'react-native';
import TextAtualizacaoAnimalInput from '../../components/TextAtualizacaoAnimalInput';
import * as ImagePicker from 'expo-image-picker';
import { urlIp } from '@env';

function AtualizarAnimalScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    let { userId, abrigoId, animalId } = route.params;

    const [nome, onChangeNome] = useState('');
    const [sexo, onChangeSexo] = useState('');
    const [dataNascimento, onChangeDataNascimento] = useState(new Date());
    const [especie, onChangeEspecie] = useState('');
    const [raca, onChangeRaca] = useState('');
    const [porte, onChangePorte] = useState('');
    const [castrado, onChangeCastrado] = useState(null);
    const [doencas, onChangeDoencas] = useState(['']);
    const [deficiencias, onChangeDeficiencias] = useState(['']);
    const [vacinas, onChangeVacinas] = useState(['']);
    const [informacoes, onChangeInformacoes] = useState('');
    const [imageUri, onChangeImageUri] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    // Novo: userId do dono do abrigo
    const [abrigoUserId, setAbrigoUserId] = useState(null);

    useEffect(() => {
        getAnimal();
        getAbrigo();
    }, []);

    const getAbrigo = async () => {
        const response = await fetch(`http://${urlIp}:3000/abrigos/${abrigoId}`);
        if (!response.ok) throw new Error('Erro ao buscar abrigo');
        const data = await response.json();
        setAbrigoUserId(data.userId);
    };

    const parseDate = (dateString) => {
        if (!dateString) return null;
        const [day, month, year] = dateString.split('/');
        const date = new Date(year, month - 1, day);
        date.setHours(12);
        return date;
    };

    const handleDelete = async () => {
        if (userId !== abrigoUserId) {
            Alert.alert('Acesso negado', 'Você não tem permissão para deletar este animal.');
            return;
        }
        Alert.alert(
            'Confirmar exclusão',
            'Tem certeza que deseja deletar este animal?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Deletar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const response = await fetch(`http://${urlIp}:3000/animais/${animalId}`, {
                                method: 'DELETE',
                            });
                            if (!response.ok) throw new Error('Erro ao deletar animal');
                            Alert.alert('Sucesso', 'Animal deletado com sucesso!');
                            navigation.navigate('TelaPrincipal', { userId });
                        } catch (error) {
                            Alert.alert('Erro', 'Erro ao deletar animal');
                        }
                    }
                }
            ]
        );
    };

    const handleAdocao = () => {
        if (userId !== abrigoUserId) {
            Alert.alert('Acesso negado', 'Você não tem permissão para realizar adoção.');
            return;
        }
        navigation.navigate('AdocaoAnimal', { animalId });
    };

    const getAnimal = async () => {
        try {
            const response = await fetch(`http://${urlIp}:3000/animais/${animalId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar animal');
            }

            const data = await response.json();
            onChangeNome(data.nome);
            onChangeSexo(data.sexo);
            onChangeDataNascimento(parseDate(data.dataNascimento));
            onChangeEspecie(data.especie);
            onChangeRaca(data.raca);
            onChangePorte(data.porte);
            onChangeCastrado(data.castrado);
            onChangeDoencas(data.doencas.length > 0 ? data.doencas : [""]);
            onChangeDeficiencias(data.deficiencias.length > 0 ? data.deficiencias : [""]);
            onChangeVacinas(data.vacinas.length > 0 ? data.vacinas : [""]);
            onChangeInformacoes(data.informacoes);

            const responseImage = await fetch(`http://${urlIp}:3000/animais/${animalId}/imagem`);
            if (responseImage.ok) {
                onChangeImageUri(`http://${urlIp}:3000/animais/${animalId}/imagem`);
            }
        } catch (error) {
            console.error('Erro ao buscar animal:', error);
        }
    };

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

    const getImageMimeType = (uri) => {
        if (uri.endsWith('.jpg') || uri.endsWith('.jpeg')) return 'image/jpeg';
        if (uri.endsWith('.png')) return 'image/png';
        return 'image/jpeg';
    };

    const handleImageUpdate = async (animalId) => {
        const mimeType = getImageMimeType(imageUri);

        const formData = new FormData();
        formData.append('image', {
            uri: imageUri,
            name: `profile.${mimeType === 'image/png' ? 'png' : 'jpg'}`,
            type: mimeType,
        });

        try {
            const response = await fetch(`http://${urlIp}:3000/animais/${animalId}/imagem`, {
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

    const clearList = (list) => {
        return list.length === 1 && list[0].trim() === '' ? [] : list;
    };

    const bodyData = {
        nome: (nome || '').trim(),
        sexo: (sexo || '').trim(),
        dataNascimento: dataNascimento instanceof Date ? dataNascimento.toISOString() : '',
        especie: (especie || '').trim(),
        raca: (raca || '').trim(),
        porte: (porte || '').trim(),
        castrado: castrado !== null ? castrado : false,
        doencas: clearList(doencas),
        deficiencias: clearList(deficiencias),
        vacinas: clearList(vacinas),
        informacoes: (informacoes || '').trim()
    };

    for (const key in bodyData) {
        if (typeof bodyData[key] === 'string' && bodyData[key] === '') {
            delete bodyData[key];
        }
    }

    const handleUpdate = async () => {
        try {
            const response = await fetch(`http://${urlIp}:3000/animais/${animalId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyData),
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar animal');
            }

            const data = await response.json();

            if (imageUri) {
                await handleImageUpdate(data.id);
            }

            navigation.navigate('TelaPrincipal', { userId: userId });
        } catch (error) {
            console.error('Erro ao fazer update:', error);
            Alert.alert('Erro', 'Atualização inválida');
        }
    };

    return (
        <ScrollView>
            <View style={styles.divCadastro} edges={['top']}>
                <Text style={styles.title}>Atualizar Animal</Text>
                <TextAtualizacaoAnimalInput 
                    nome={nome}
                    onChangeNome={onChangeNome}
                    sexo={sexo}
                    onChangeSexo={onChangeSexo}
                    dataNascimento={dataNascimento}
                    onChangeDataNascimento={onChangeDataNascimento}
                    especie={especie}
                    onChangeEspecie={onChangeEspecie}
                    raca={raca}
                    onChangeRaca={onChangeRaca}
                    porte={porte}
                    onChangePorte={onChangePorte}
                    castrado={castrado}
                    onChangeCastrado={onChangeCastrado}
                    doencas={doencas}
                    onChangeDoencas={onChangeDoencas}
                    deficiencias={deficiencias}
                    onChangeDeficiencias={onChangeDeficiencias}
                    vacinas={vacinas}
                    onChangeVacinas={onChangeVacinas}
                    informacoesAdicionais={informacoes}
                    onChangeInformacoesAdicionais={onChangeInformacoes}
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
                {userId === abrigoUserId && (
                    <Pressable
                        style={[styles.botao, styles.adocaoButton]}
                        onPress={handleAdocao}
                    >
                        <Text style={styles.textoBotao}>Realizar Adoção</Text>
                    </Pressable>
                )}
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
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 30,
        elevation: 3,
        marginTop: 50,
    },
    adocaoButton: {
        backgroundColor: '#8A2BE2', 
        marginTop: 20,
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

export default AtualizarAnimalScreen;