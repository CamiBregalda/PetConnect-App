import React from 'react';
import {StyleSheet, TextInput, View, Text} from 'react-native';

const TextAtualizacaoEnderecoInput = ({ endereco, onChangeEndereco }) => {
    return (
        <View>
            <View style={styles.containerInput}>
                <Text style={styles.label}>Rua:</Text>
                <TextInput
                    style={[styles.input, {width: 240}]}
                    placeholder="Rua"
                    value={endereco.rua}
                    onChangeText={(text) => onChangeEndereco('rua', text)}
                />
            </View>

            <View style={styles.containerInput}>
                <Text style={styles.label}>Número:</Text>
                <TextInput
                    style={[styles.input, {width: 212}]}
                    placeholder="Número"
                    value={endereco.numero}
                    onChangeText={(text) => onChangeEndereco('numero', text)}
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.containerInput}>
                <Text style={styles.label}>Bairro:</Text>
                <TextInput
                    style={[styles.input, {width: 225}]}
                    placeholder="Bairro"
                value={endereco.bairro}
                onChangeText={(text) => onChangeEndereco('bairro', text)}
            />
            </View>

            <View style={styles.containerInput}>
                <Text style={styles.label}>Cidade:</Text>
                <TextInput
                    style={[styles.input, {width: 222}]}
                    placeholder="Cidade"
                    value={endereco.cidade}
                    onChangeText={(text) => onChangeEndereco('cidade', text)}
                />
            </View>

            <View style={styles.containerInput}>
                <Text style={styles.label}>Estado:</Text>
                <TextInput
                    style={[styles.input, {width: 222}]}
                    placeholder="Estado"
                    value={endereco.estado}
                    onChangeText={(text) => onChangeEndereco('estado', text)}
                />
            </View>

            <View style={styles.containerInput}>
                <Text style={styles.label}>CEP:</Text>
                <TextInput
                    style={[styles.input, {width: 240}]}
                    placeholder="CEP"
                    value={endereco.cep}
                    onChangeText={(text) => onChangeEndereco('cep', text)}
                    keyboardType="numeric"
                />
            </View>
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
    containerInput: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        fontWeight: 'bold',
        marginLeft: 15,
        marginTop: 10,
        marginBottom: 10,
    },
});

export default TextAtualizacaoEnderecoInput;