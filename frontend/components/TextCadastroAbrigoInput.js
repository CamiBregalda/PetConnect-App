import React, { useEffect, useState }  from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import TextEnderecoInput from './TextEnderecoInput';

const TextCadastroAbrigoInput = ({nome, onChangeNome, cnpj, onChangeCnpj, email, onChangeEmail, telefone, onChangeTelefone, endereco, onChangeEndereco, descricao, onChangeDescricao, errors}) => {
    const getInputStyle = (fieldError) => [
        styles.input,
        fieldError && styles.inputError,
    ];

    const getDescricaoInputStyle = (fieldError) => [
        styles.descricaoInput,
        fieldError && styles.inputError,
    ];
    
    return (
        <>
        <View>
            <TextInput
                style={getInputStyle(errors.nome)}
                onChangeText={onChangeNome}
                value={nome}
                placeholder="Nome"
                keyboardType="default"
            />
            <TextInput
                style={getInputStyle(errors.cnpj)}
                onChangeText={onChangeCnpj}
                value={cnpj}
                placeholder="CNPJ"
                keyboardType="number-pad"
            />
            <TextInput
                style={getInputStyle(errors.email)}
                onChangeText={onChangeEmail}
                value={email}
                placeholder="Email"
                keyboardType="Email"
            />
            <TextInput
                style={getInputStyle(errors.telefone)}
                onChangeText={onChangeTelefone}
                value={telefone}
                placeholder="Telefone"
                keyboardType="Telefone"
            />
            <TextEnderecoInput 
                endereco={endereco} 
                onChangeEndereco={onChangeEndereco} 
                errors={errors.endereco}
            />
            <TextInput
                style={getDescricaoInputStyle(errors.descricao)}
                onChangeText={onChangeDescricao}
                value={descricao}
                placeholder="Descrição"
                multiline
                numberOfLines={4}
            />
        </View>
        </>
    );
};

const styles = StyleSheet.create({
    input: {
        width: 280,
        height: 40,
        margin: 10,
        borderRadius: 30,
        borderWidth: 0.2,
        borderBottomWidth: 1,
        padding: 10,
    },
    inputError: {
        borderColor: 'red',
        borderWidth: 1,
        shadowColor: 'red',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 3,
    },
    descricaoInput: {
        width: 280,
        margin: 10,
        borderRadius: 30,
        borderWidth: 0.2,
        borderBottomWidth: 1,
        paddingTop: 10,
        padding: 10,
        height: 150,
        textAlignVertical: 'top',
    },
});

export default TextCadastroAbrigoInput;