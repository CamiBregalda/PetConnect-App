import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, Pressable } from 'react-native';

const TextCadastroAnimalInput = () => {
    const [nome, onChangeNome] = React.useState('');
    const [sexo, onChangeSexo] = React.useState('');
    const [dataNascimento, onChangeDataNascimento] = React.useState('');
    const [especie, onChangeEspecie] = React.useState('');
    const [raca, onChangeRaca] = React.useState('');
    const [porte, onChangePorte] = React.useState('');
    const [castrado, onChangeCastrado] = React.useState('');
    const [doencas, onChangeDoencas] = React.useState('');
    const [deficiencias, onChangeDeficiencias] = React.useState('');
    const [vacinas, onChangeVacinas] = React.useState('');
    const [informacoesAdicionais, onChangeInformacoesAdicionais] = React.useState('');

    return (
        <>
        <View>
            <TextInput
                style={styles.input}
                onChangeText={onChangeNome}
                value={nome}
                placeholder="Nome"
                keyboardType="Nome"
            />
            <TextInput
                style={styles.input}
                onChangeText={onChangeSexo}
                value={sexo}
                placeholder="Sexo"
            />
            <TextInput
                style={styles.input}
                onChangeText={onChangeDataNascimento}
                value={dataNascimento}
                placeholder="Data de Nascimento"
            />
            <TextInput
                style={styles.input}
                onChangeText={onChangeEspecie}
                value={especie}
                placeholder="Espécie"
            />
            <TextInput
                style={styles.input}
                onChangeText={onChangeRaca}
                value={raca}
                placeholder="Raça"
            />
            <TextInput
                style={styles.input}
                onChangeText={onChangePorte}
                value={porte}
                placeholder="Porte"
            />
            <TextInput
                style={styles.input}
                onChangeText={onChangeCastrado}
                value={castrado}
                placeholder="Castrado(a)"
            />
            <TextInput
                style={styles.input}
                onChangeText={onChangeDoencas}
                value={doencas}
                placeholder="Doenças"
            />
            <TextInput
                style={styles.input}
                onChangeText={onChangeDeficiencias}
                value={deficiencias}
                placeholder="Deficiências"
            />
            <TextInput
                style={styles.input}
                onChangeText={onChangeVacinas}
                value={vacinas}
                placeholder="Vacinas"
            />
            <TextInput
                style={[styles.input, styles.largeInput]}
                onChangeText={onChangeInformacoesAdicionais}
                value={informacoesAdicionais}
                placeholder="Informações Adicionais"
                multiline
                numberOfLines={4}
            />
        </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 10,
    },
    input: {
        width: 280,
        height: 40,
        marginVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#aaa',
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 8,
        marginVertical: 10,
    },
    button: {
        backgroundColor: '#9B4DE0',
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
        largeInput: {
        height: 150,
        textAlignVertical: 'top',
    },
});

export default TextCadastroAnimalInput;