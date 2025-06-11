import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Image, Pressable, StyleSheet, Text, View, ScrollView, TouchableOpacity  } from 'react-native';
import TextCadastroAnimalInput from '../../components/TextCadastroAnimalInput';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { urlIp } from '@env';

function CadastroAnimalScreen() {
    const route = useRoute();
    const idDono = route.params.abrigoId;
    const { userId } = route.params;
    const navigation = useNavigation();

    const [nome, onChangeNome] = React.useState('');
    const [sexo, onChangeSexo] = React.useState('');
    const [dataNascimento, onChangeDataNascimento] = React.useState(new Date());
    const [especie, onChangeEspecie] = React.useState('');
    const [raca, onChangeRaca] = React.useState('');
    const [porte, onChangePorte] = React.useState('');
    const [castrado, onChangeCastrado] = React.useState(null);
    const [doencas, onChangeDoencas] = React.useState(['']);
    const [deficiencias, onChangeDeficiencias] = React.useState(['']);
    const [vacinas, onChangeVacinas] = React.useState(['']);
    const [informacoes, onChangeInformacoes] = React.useState('');
    const [imageUri, setImageUri] = useState(null);

    const [errors, setErrors] = React.useState({
        nome: false,
        sexo: false,
        especie: false,
        raca: false,
        porte: false,
        castrado: false,
        informacoes: false,
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

    const getImageMimeType = (uri) => {
        if (uri.endsWith('.jpg') || uri.endsWith('.jpeg')) return 'image/jpeg';
        if (uri.endsWith('.png')) return 'image/png';
        return 'image/jpeg';
    };

    const handleImageUpdate = async (idAnimal) => {
        const mimeType = getImageMimeType(imageUri);

        const formData = new FormData();
        formData.append('image', {
            uri: imageUri,
            name: `profile.${mimeType === 'image/png' ? 'png' : 'jpg'}`,
            type: mimeType,
        });

        try {
            const response = await fetch(`http://${urlIp}:3000/animais/${idAnimal}/imagem`, {
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
            sexo: !sexo.trim(),
            especie: !especie.trim(),
            raca: !raca.trim(),
            porte: !porte.trim(),
            castrado: castrado === null,
            informacoes: !informacoes.trim(),
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

        const clearList = (list) => {
            return list.length === 1 && list[0].trim() === '' ? [] : list;
        };

        try {           

            const response = await fetch(`http://${urlIp}:3000/animais`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome: nome.trim(),
                    sexo: sexo.trim(),
                    dataNascimento: dataNascimento.toISOString(),
                    especie: especie.trim(),
                    raca: raca.trim(),
                    porte: porte.trim(),
                    castrado: castrado,
                    doencas: clearList(doencas),
                    deficiencias: clearList(deficiencias),
                    vacinas: clearList(vacinas),
                    informacoes: informacoes.trim(),
                    idDono: idDono,
                    adotado: false,
                }),
            });

            if (!response.ok) {
                throw new Error('Cadastro inválido');
            }

            const data = await response.json();

            if (imageUri) {
                await handleImageUpdate(data.id);
            }

            navigation.navigate('Main', { abrigoId: idDono, userId: userId });
        } catch (error) {
            console.error('Erro ao fazer cadastro:', error);
            Alert.alert('Erro', 'Cadastro inválido');
        }
    };

    return (
        <ScrollView>
            <TouchableOpacity onPress={() => navigation.navigate('Main', { abrigoId: idDono, userId: userId })} style={styles.backButton}>
                <Ionicons name="arrow-back" size={28} color="#333" />
            </TouchableOpacity>

            <View style={styles.divCadastro} edges={['top']}>
                <Text style={styles.title}>Cadastrar Animal</Text>
                <TextCadastroAnimalInput 
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

export default CadastroAnimalScreen;