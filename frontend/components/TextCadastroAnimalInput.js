import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, Pressable, TouchableOpacity, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GenericListInput } from './GenericListInput';

const TextCadastroAnimalInput = () => {
    const [nome, onChangeNome] = React.useState('');
    const [sexo, onChangeSexo] = React.useState('');
    const [dataNascimento, onChangeDataNascimento] = React.useState(new Date());
    const [showDatePicker, setShowDatePicker] = React.useState(false);
    const [especie, onChangeEspecie] = React.useState('');
    const [raca, onChangeRaca] = React.useState('');
    const [porte, onChangePorte] = React.useState('');
    const [castrado, onChangeCastrado] = React.useState('');
    const [doencas, onChangeDoencas] = React.useState(['']);
    const [deficiencias, onChangeDeficiencias] = React.useState(['']);
    const [vacinas, onChangeVacinas] = React.useState(['']);
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

            <View style={styles.inputSelect}>
                <Picker
                    selectedValue={sexo}
                    onValueChange={(itemValue) => onChangeSexo(itemValue)}
                    style={styles.picker}

                >
                    <Picker.Item label="Sexo" value="" />
                    <Picker.Item label="Feminino" value="Feminino" />
                    <Picker.Item label="Masculino" value="Masculino" />
                </Picker>
            </View>

            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
                <Text style={styles.input}>
                    {dataNascimento ? dataNascimento.toLocaleDateString() : 'Data de Nascimento'}
                </Text>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={dataNascimento}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(_, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) onChangeDataNascimento(selectedDate);
                    }}
                />
            )}

            <View style={styles.input}>
                <Picker
                    selectedValue={especie}
                    onValueChange={(itemValue) => onChangeEspecie(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Espécie" value="" />
                    <Picker.Item label="Espécie 1" value="Feminino" />
                    <Picker.Item label="Espécie 2" value="Masculino" />
                </Picker>
            </View>

            <View style={styles.input}>
                <Picker
                    selectedValue={raca}
                    onValueChange={(itemValue) => onChangeRaca(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Raça" value="" />
                    <Picker.Item label="Espécie 1" value="Feminino" />
                    <Picker.Item label="Espécie 2" value="Masculino" />
                </Picker>
            </View>

            <View style={styles.input}>
                <Picker
                    selectedValue={porte}
                    onValueChange={(itemValue) => onChangePorte(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Porte" value="" />
                    <Picker.Item label="Porte 1" value="Feminino" />
                    <Picker.Item label="Porte 2" value="Masculino" />
                </Picker>
            </View>

            <View style={styles.input}>
                <Picker
                    selectedValue={castrado}
                    onValueChange={(itemValue) => onChangeCastrado(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Castrado(a)" value="" />
                    <Picker.Item label="Castrado(a) 1" value="Sim" />
                    <Picker.Item label="Castrado(a) 2" value="Não" />
                </Picker>
            </View>

            <GenericListInput
                items={doencas}
                setItems={onChangeDoencas}
                placeholder="Doenças"
            />
            <GenericListInput
                items={deficiencias}
                setItems={onChangeDeficiencias}
                placeholder="Deficiências"
            />
            <GenericListInput
                items={vacinas}
                setItems={onChangeVacinas}
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
        margin: 10,
        borderRadius: 30,
        borderWidth: 0.2,
        borderBottomWidth: 1,
        padding: 10,
    },
    descricaoInput: {
        height: 150,
        textAlignVertical: 'top',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    largeInput: {
        height: 150,
        textAlignVertical: 'top',
    },
    label: {
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 4,
    },
    picker: {
        color: '#808080',
        marginLeft: -10,
        marginTop: Platform.OS === 'android' ? -15 : -11,
    },
    inputSelect: {
        width: 280,
        height: 40,
        margin: 10,
        borderRadius: 30,
        borderWidth: 0.2,
        borderBottomWidth: 1,
        padding: 10,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
        fontSize: Platform.OS === 'ios' ? 17 : 14,
    }
});

export default TextCadastroAnimalInput;