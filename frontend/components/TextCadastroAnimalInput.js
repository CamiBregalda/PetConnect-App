import React from 'react';
import { View, TextInput, StyleSheet, Text, Pressable, TouchableOpacity, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GenericListInput } from './GenericListInput';
import { urlIp } from '@env';


const TextCadastroAnimalInput = (
    { 
        nome, onChangeNome, 
        sexo, onChangeSexo, 
        dataNascimento, onChangeDataNascimento, 
        especie, onChangeEspecie, 
        raca, onChangeRaca, 
        porte, onChangePorte, 
        castrado, onChangeCastrado, 
        doencas, onChangeDoencas, 
        deficiencias, onChangeDeficiencias,
        vacinas, onChangeVacinas,
        informacoesAdicionais, onChangeInformacoesAdicionais,
        errors,
    }) => {

    const [listaEspecies, setListaEspecies] = React.useState([]);
    const [listaRacas, setListaRacas] = React.useState([]);
    const [listaPorte, setListaPorte] = React.useState([]);

    const fetchRacas = async (especieSelecionada) => {
        try {
            if (!especieSelecionada) {
                setListaRacas([]);
                return;
            }
            const response = await fetch(`http://${urlIp}:3000/especies/${especieSelecionada}/racas`);

            if (!response.ok) throw new Error('Erro ao buscar raças');
            const data = await response.json();
            setListaRacas(data);
        } catch (error) {
            console.error('Erro ao buscar raças:', error);
        }
    };

    React.useEffect(() => {
        const fetchEspecies = async () => {
            try {
                const response = await fetch(`http://${urlIp}:3000/especies`);

                if (!response.ok) throw new Error('Erro ao buscar espécies');
                const data = await response.json();
                setListaEspecies(data);
            } catch (error) {
                console.error('Erro ao buscar espécies:', error);
            }
        };

        const fetchPorte = async () => {
            try {
                const response = await fetch(`http://${urlIp}:3000/portes`);

                if (!response.ok) throw new Error('Erro ao buscar portes');
                const data = await response.json();
                setListaPorte(data);
            } catch (error) {
                console.error('Erro ao buscar portes:', error);
            }
        };

        fetchEspecies();
        fetchPorte();
        if (especie) {
            fetchRacas(especie);
        }
    }, []);
    
    const [showDatePicker, setShowDatePicker] = React.useState(false);

    const getInputStyle = (fieldError) => [
        styles.input,
        fieldError && styles.inputError,
    ];

    const getInputSelectStyle = (fieldError) => [
        styles.inputSelect,
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
                keyboardType="Nome"
            />

            <View style={getInputSelectStyle(errors.sexo)}>
                <Picker
                    selectedValue={sexo}
                    onValueChange={(itemValue) => onChangeSexo(itemValue)}
                    style={[
                        styles.picker,
                        { color: sexo === '' ? '#808080' : '#000000' }
                    ]}
                >
                    <Picker.Item label="Sexo" value="" style={styles.pickerItem} />
                    <Picker.Item label="Feminino" value="Feminino" style={styles.pickerItemValue} />
                    <Picker.Item label="Masculino" value="Masculino" style={styles.pickerItemValue} />
                </Picker>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.label}>Data de Nascimento:</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <Text style={styles.dateInput}>
                    {dataNascimento ? dataNascimento.toLocaleDateString() : 'Data de Nascimento'}
                </Text>
            </TouchableOpacity>
            </View>
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

            <View style={getInputSelectStyle(errors.especie)}>
                <Picker
                    selectedValue={especie}
                    onValueChange={(itemValue) => {
                        onChangeEspecie(itemValue);
                        fetchRacas(itemValue);
                    }}
                    style={[
                        styles.picker,
                        { color: especie === '' ? '#808080' : '#000000' }
                    ]}
                >
                    <Picker.Item label="Espécie" value="" style={styles.pickerItem} />
                    {listaEspecies.map((item, index) => (
                        <Picker.Item key={index} label={item} value={item} style={styles.pickerItemValue} />
                    ))}
                </Picker>
            </View>

            <View style={getInputSelectStyle(errors.raca)}>
                <Picker
                    selectedValue={raca}
                    onValueChange={(itemValue) => onChangeRaca(itemValue)}
                    style={[
                        styles.picker,
                        { color: raca === '' ? '#808080' : '#000000' }
                    ]}
                >
                    <Picker.Item label="Raça" value="" style={styles.pickerItem} />
                    {listaRacas.map((item, index) => (
                        <Picker.Item key={index} label={item} value={item} style={styles.pickerItemValue} />
                    ))}
                </Picker>
            </View>

            <View style={getInputSelectStyle(errors.porte)}>
                <Picker
                    selectedValue={porte}
                    onValueChange={(itemValue) => onChangePorte(itemValue)}
                    style={[
                        styles.picker,
                        { color: porte === '' ? '#808080' : '#000000' }
                    ]}
                >
                    <Picker.Item label="Porte" value="" style={styles.pickerItem} />
                    {listaPorte.map((item, index) => (
                        <Picker.Item key={index} label={item} value={item} style={styles.pickerItemValue} />
                    ))}
                </Picker>
            </View>

            <View style={getInputSelectStyle(errors.castrado)}>
                <Picker
                    selectedValue={castrado}
                    onValueChange={(itemValue) => onChangeCastrado(itemValue)}
                    style={[
                            styles.picker,
                            { color: castrado === null ? '#808080' : '#000000' }
                        ]}
                >
                    <Picker.Item label="Castrado" value={null} style={styles.pickerItem} />
                    <Picker.Item label="Sim" value={true} style={styles.pickerItemValue} />
                    <Picker.Item label="Não" value={false} style={styles.pickerItemValue} />
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
                style={getDescricaoInputStyle(errors.informacoesAdicionais)}
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
    label: {
        fontWeight: 'bold',
        marginLeft: 15,
        marginTop: 10,
        marginBottom: 10,
    },
    dateInput: {
        textAlign: 'center',
        width: 130,
        height: 40,
        margin: 10,
        borderRadius: 30,
        borderWidth: 0.2,
        borderBottomWidth: 1,
        padding: 10,
    },
    picker: {
        color: '#808080',
        marginLeft: -10,
        marginTop: Platform.OS === 'android' ? -15 : -11,
    },
    pickerItem: {
        fontSize: 14, 
    },
    pickerItemValue: {
        fontSize: 14, 
        color: '#000',
    },
    inputSelect: {
        width: 280,
        height: 40,
        margin: 10,
        borderRadius: 30,
        borderWidth: 0.2,
        borderBottomWidth: 1,
        padding: 9,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
        fontSize: Platform.OS === 'ios' ? 17 : 14,
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

export default TextCadastroAnimalInput;