import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Image, Pressable, StyleSheet, Text, View, ScrollView  } from 'react-native';
import TextAtualizacaoAnimalInput from '../../components/TextAtualizacaoAnimalInput';
import * as ImagePicker from 'expo-image-picker';

function AtualizarAnimalScreen() {
    const route = useRoute();
    const userId = route.params.userId;
    const { animalId } = route.params;
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
    const [idDono, onChangeIdDono] = React.useState(userId);
    const [adotado, onChangeAdotado] = React.useState(false);
    const [imageUri, onChangeImageUri] = React.useState(null);

    useEffect(() => {
            getAnimal();
    }, []);

    const parseDate = (dateString) => {
        if (!dateString) return null;
        const [day, month, year] = dateString.split('/');
        const date = new Date(year, month - 1, day);
        date.setHours(12);
        return date;
    };

    const getAnimal = async () => {
        try {
            const response = await fetch(`http://192.168.3.5:3000/animais/${animalId}`, {
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
            onChangeDoencas(data.doencas);
            onChangeDeficiencias(data.deficiencias);
            onChangeVacinas(data.vacinas);
            onChangeInformacoes(data.informacoes);
            onChangeIdDono(data.idDono);
            onChangeAdotado(data.adotado);

            const responseImage = await fetch(`http://192.168.3.5:3000/animais/${animalId}/imagem`);
            if (responseImage.ok) {
                onChangeImageUri(`http://192.168.3.5:3000/animais/${animalId}/imagem`);
            }
        } catch (error) {
            console.error('Erro ao buscar animal:', error);
        }
    }

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
            const response = await fetch(`http://192.168.3.5:3000/animais/${animalId}/imagem`, {
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
        nome: nome.trim(),
        sexo: sexo.trim(),
        dataNascimento: dataNascimento.toISOString(),
        especie: especie.trim(),
        raca: raca.trim(),
        porte: porte.trim(),
        castrado: castrado !== null ? castrado : false,
        doencas: clearList(doencas),
        deficiencias: clearList(deficiencias),
        vacinas: clearList(vacinas),
        informacoes: informacoes.trim(),
        idDono: idDono,
        adotado: adotado,
    };

    for (const key in bodyData) {
        if (typeof bodyData[key] === 'string' && bodyData[key] === '') {
            delete bodyData[key];
        }
    }

    const handleUpdate = async () => {
                try {
            const response = await fetch(`http://192.168.3.5:3000/animais/${animalId}`, {
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

            navigation.navigate('AnimaisUser', { userId: userId });
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
                adotado={adotado}
                onChangeAdotado={onChangeAdotado}
                idDono={idDono}
                onChangeIdDono={onChangeIdDono}
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

export default AtualizarAnimalScreen;