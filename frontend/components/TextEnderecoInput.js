import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';

const TextEnderecoInput = ({ endereco, onChangeEndereco, errors }) => {
    const getInputStyle = (fieldError) => [
        styles.input,
        fieldError && styles.inputError,
    ];
    
    return (
        <View>
        <TextInput
            style={getInputStyle(errors.rua)}
            placeholder="Rua"
            value={endereco.rua}
            onChangeText={(text) => onChangeEndereco('rua', text)}
        />
        <TextInput
            style={getInputStyle(errors.numero)}
            placeholder="Número"
            value={endereco.numero}
            onChangeText={(text) => onChangeEndereco('numero', text)}
        />
        <TextInput
            style={getInputStyle(errors.bairro)}
            placeholder="Bairro"
            value={endereco.bairro}
            onChangeText={(text) => onChangeEndereco('bairro', text)}
        />
        <TextInput
            style={getInputStyle(errors.cidade)}
            placeholder="Cidade"
            value={endereco.cidade}
            onChangeText={(text) => onChangeEndereco('cidade', text)}
        />
        <TextInput
            style={getInputStyle(errors.estado)}
            placeholder="Estado"
            value={endereco.estado}
            onChangeText={(text) => onChangeEndereco('estado', text)}
        />
        <TextInput
            style={getInputStyle(errors.cep)}
            placeholder="CEP"
            value={endereco.cep}
            onChangeText={(text) => onChangeEndereco('cep', text)}
        />
        </View>
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
});

export default TextEnderecoInput;