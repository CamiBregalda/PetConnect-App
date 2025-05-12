import React, { useEffect, useState }  from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
/*import * as Location from 'expo-location';

// Dentro do seu componente CadastroAbrigoScreen:
const [endereco, setEndereco] = useState('');

useEffect(() => {
    (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log('Permissão de localização negada');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        let [geo] = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        });

        if (geo) {
            setEndereco(`${geo.street}, ${geo.subregion} - ${geo.region}`);
        }
    })();
}, []);*/


const TextCadastroUserInput = () => {
    const [name, onChangeName] = React.useState('');
    const [cnpj, onChangeCnpj] = React.useState('');
    const [email, onChangeEmail] = React.useState('');
    const [telefone, onChangeTelefone] = React.useState('');
    const [endereco, onChangeEndereco] = React.useState('');
    const [descricao, onChangeDescricao] = React.useState('');

    return (
        <>
        <View>
            <TextInput
                style={styles.input}
                onChangeText={onChangeName}
                value={name}
                placeholder="Name"
                keyboardType="Name"
            />
            <TextInput
                style={styles.input}
                onChangeText={onChangeCnpj}
                value={cnpj}
                placeholder="CNPJ"
                keyboardType="Cnpj"
            />
            <TextInput
                style={styles.input}
                onChangeText={onChangeEmail}
                value={email}
                placeholder="email"
                keyboardType="Email"
            />
            <TextInput
                style={styles.input}
                onChangeText={onChangeTelefone}
                value={telefone}
                placeholder="Telefone"
                keyboardType="Telefone"
            />
            <TextInput
                style={styles.input}
                onChangeText={onChangeEndereco}
                value={endereco}
                placeholder="Endereco"
                keyboardType="Endereco"
            />
            <TextInput
                style={[styles.input, styles.descricaoInput]}
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
        descricaoInput: {
        height: 150,
        textAlignVertical: 'top',
    },
});

export default TextCadastroUserInput;