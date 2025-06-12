import React from 'react';
import { useNavigation } from "@react-navigation/native";
import { Image, Pressable, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TextCadastroUserInput from '../../components/TextCadastroUserInput';
import { urlIp } from '@env';

function CadastroUserScreen() {
    const navigation = useNavigation();
    const [name, onChangeName] = React.useState('');
    const [cpf, onChangeCpf] = React.useState('');
    const [email, onChangeEmail] = React.useState('');
    const [senha, onChangeSenha] = React.useState('');
    const [telefone, onChangeTelefone] = React.useState('');
    const [endereco, onChangeEndereco] = React.useState({
        rua: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: '',
    });

    const [errors, setErrors] = React.useState({
        name: false,
        cpf: false,
        email: false,
        senha: false,
        telefone: false,
        endereco: {
            rua: false,
            numero: false,
            bairro: false,
            cidade: false,
            estado: false,
            cep: false,
        },
    });

    const handleEnderecoChange = (campo, valor) => {
        onChangeEndereco((prev) => ({
            ...prev,
            [campo]: valor,
        }));
    };

    const handleCadastro = async () => {
        const newErrors = {
            name: !name.trim(),
            cpf: !cpf.trim(),
            email: !email.trim(),
            senha: !senha.trim(),
            telefone: !telefone.trim(),
            endereco: {
                rua: !endereco.rua.trim(),
                numero: !endereco.numero.trim(),
                bairro: !endereco.bairro.trim(),
                cidade: !endereco.cidade.trim(),
                estado: !endereco.estado.trim(),
                cep: !endereco.cep.trim(),
            },
        };


        const hasError = Object.values(newErrors).some(e =>
            typeof e === 'object'
                ? Object.values(e).some(v => v)
                : e
        );
        setErrors(newErrors);

        if (hasError) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        try {           

            const response = await fetch(`http://${urlIp}:3000/users`, {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome: name.trim(),
                    email: email.trim(),
                    senha: senha.trim(),
                    cpf: cpf.trim(),
                    telefone: telefone.trim(),
                    endereco: {
                        rua: endereco.rua.trim(),
                        numero: endereco.numero.trim(),
                        bairro: endereco.bairro.trim(),
                        cidade: endereco.cidade.trim(),
                        estado: endereco.estado.trim(),
                        cep: endereco.cep.trim(),
                    },
                }),
            });

            if (!response.ok) {
                throw new Error('Cadastro inválido');
            }

            const data = await response.json();
            navigation.navigate('Login');
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Cadastro inválido');
        }
    };

    return (
        <ScrollView>
        <View style={styles.divCadastro} edges={['top']}>
            <TouchableOpacity onPress={() => navigation.navigate('TelaInicial')} style={styles.backButton}>
                <Ionicons name="arrow-back" size={28} color="#333" />
            </TouchableOpacity>
            <Image
                style={styles.logo}
                source={require('../../img/PET.png')}
            />
            <TextCadastroUserInput
                name={name}
                onChangeName={onChangeName}
                cpf={cpf}
                onChangeCpf={onChangeCpf}
                email={email}
                onChangeEmail={onChangeEmail}
                senha={senha}
                onChangeSenha={onChangeSenha}
                telefone={telefone}
                onChangeTelefone={onChangeTelefone}
                endereco={endereco}
                onChangeEndereco={handleEnderecoChange}
                errors={errors}
            />
            <Pressable
                style={styles.botao}
                onPress={handleCadastro}
            >
                <Text style={styles.textoBotao}>Cadastrar</Text>
            </Pressable>
        </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    backButton: {
        position: 'absolute',
        top: 40,     
        left: 16,
        zIndex: 1,
    },
    divCadastro: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        padding: 50,
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 40,
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
});

export default CadastroUserScreen;