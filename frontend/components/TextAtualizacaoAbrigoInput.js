import React, { useEffect, useState }  from 'react';
import {StyleSheet, TextInput, View, Text} from 'react-native';
import TextAtualizacaoEnderecoInput from './TextAtualizacaoEnderecoInput';

const TextAtualizacaoAbrigoInput = ({nome, onChangeNome, cnpj, onChangeCnpj, email, onChangeEmail, telefone, onChangeTelefone, endereco, onChangeEndereco, descricao, onChangeDescricao}) => {
    return (
        <>
        <View>
            <View style={styles.containerInput}>
                <Text style={styles.label}>Nome:</Text>
                <TextInput
                    style={[styles.input, {width: 225}]}
                    onChangeText={onChangeNome}
                    value={nome}
                    placeholder="Nome"
                    keyboardType="default"
                />
            </View>

            <View style={styles.containerInput}>
                <Text style={styles.label}>CNPJ:</Text>
                <TextInput
                    style={[styles.input, {width: 225}]}
                    onChangeText={onChangeCnpj}
                    value={cnpj}
                    placeholder="CNPJ"
                    keyboardType="number-pad"
                />
            </View>

            <View style={styles.containerInput}>
                <Text style={styles.label}>Email:</Text>
                <TextInput
                    style={[styles.input, {width: 225}]}
                    onChangeText={onChangeEmail}
                    value={email}
                    placeholder="Email"
                />
            </View>

            <View style={styles.containerInput}>
                <Text style={styles.label}>Telefone:</Text>
                <TextInput
                    style={[styles.input, {width: 205}]}
                    onChangeText={onChangeTelefone}
                    value={telefone}
                    placeholder="Telefone"
                />
            </View>

            <TextAtualizacaoEnderecoInput
                endereco={endereco}
                onChangeEndereco={onChangeEndereco} 
            />

            <Text style={styles.label}>Descrição:</Text>
            <TextInput
                style={styles.descricaoInput}
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
    containerInput: {
        flexDirection: 'row',
        alignItems: 'center',
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
    label: {
        fontWeight: 'bold',
        marginLeft: 15,
        marginTop: 10,
        marginBottom: 10,
    },
});

export default TextAtualizacaoAbrigoInput;