import React from 'react';
import {StyleSheet, TextInput, View, Text} from 'react-native';
import TextAtualizacaoEnderecoInput from './TextAtualizacaoEnderecoInput';

const TextAtualizarUserInput = ({ nome, onChangeNome, cpf, onChangeCpf, telefone, onChangeTelefone, idade, onChangeIdade, ocupacao, onChangeOcupacao, descricao, onChangeDescricao, endereco, onChangeEndereco }) => {
  return (
    <>
      <View>
        <View style={styles.containerInput}>
          <Text style={styles.label}>Nome:</Text>
          <TextInput
            style={[styles.input, {width: 215}]}
            onChangeText={onChangeNome}
            value={nome}
            placeholder="Nome"
            keyboardType="default"
          />
        </View>

        <View style={styles.containerInput}>
          <Text style={styles.label}>CPF:</Text>
          <TextInput
            style={[styles.input, {width: 230}]}
            onChangeText={onChangeCpf}
            value={cpf}
            placeholder="CPF"
            keyboardType="default"
          />
        </View>

        <View style={styles.containerInput}>
          <Text style={styles.label}>Telefone:</Text>
          <TextInput
            style={[styles.input, {width: 200}]}
            onChangeText={onChangeTelefone}
            value={telefone}
            placeholder="Telefone"
            keyboardType="default"
          />
        </View>

        <View style={styles.containerInput}>
          <Text style={styles.label}>Idade:</Text>
          <TextInput
            style={[styles.input, {width: 225}]}
            onChangeText={onChangeIdade}
            value={idade !== null ? String(idade) : ''}
            placeholder="Idade"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.containerInput}>
          <Text style={styles.label}>Ocupação:</Text>
          <TextInput
            style={[styles.input, {width: 200}]}
            onChangeText={onChangeOcupacao}
            value={ocupacao}
            placeholder="Ocupação"
            keyboardType="default"
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
  label: {
      fontWeight: 'bold',
      marginLeft: 15,
      marginTop: 10,
      marginBottom: 10,
  },
    descricaoInput: {
        width: 280,
        margin: 10,
        borderRadius: 30,
        borderWidth: 0.2,
        borderBottomWidth: 1,
        paddingTop: 10,
        padding: 15,
        height: 150,
        textAlignVertical: 'top',
    }
});

export default TextAtualizarUserInput;