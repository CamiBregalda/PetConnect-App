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

            <Picker
                selectedValue={sexo}
                onValueChange={(itemValue) => onChangeSexo(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Sexo" value="" />
                <Picker.Item label="Feminino" value="Feminino" />
                <Picker.Item label="Masculino" value="Masculino" />
            </Picker>

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

            <Picker
                selectedValue={especie}
                onValueChange={(itemValue) => onChangeEspecie(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Espécie" value="" />
                <Picker.Item label="Espécie 1" value="Feminino" />
                <Picker.Item label="Espécie 2" value="Masculino" />
            </Picker>

            <Picker
                selectedValue={raca}
                onValueChange={(itemValue) => onChangeRaca(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Raça" value="" />
                <Picker.Item label="Espécie 1" value="Feminino" />
                <Picker.Item label="Espécie 2" value="Masculino" />
            </Picker>

            <Picker
                selectedValue={porte}
                onValueChange={(itemValue) => onChangePorte(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Porte" value="" />
                <Picker.Item label="Porte 1" value="Feminino" />
                <Picker.Item label="Porte 2" value="Masculino" />
            </Picker>

            <Picker
                selectedValue={castrado}
                onValueChange={(itemValue) => onChangeCastrado(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Castrado(a)" value="" />
                <Picker.Item label="Castrado(a) 1" value="Sim" />
                <Picker.Item label="Castrado(a) 2" value="Não" />
            </Picker>

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
});

export default TextCadastroAnimalInput;