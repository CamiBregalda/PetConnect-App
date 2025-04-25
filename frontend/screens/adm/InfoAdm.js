import React from 'react';
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View, Pressable } from 'react-native';

function InfoAdm() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
        <Text>Faça seus codigos aqui</Text>
      <Pressable
        style={styles.botao}
        onPress={() => navigation.navigate('VoluntariosAdm')}
      >
        <Text style={styles.textoBotao}>Voluntarios</Text>
      </Pressable>
      <Pressable
              style={styles.botao}
              onPress={() => navigation.navigate('Voluntariarse')}
            >
              <Text style={styles.textoBotao}>Voluntariar-se</Text>
            </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'flex-start', 
      },
      botao: {
        width: 200,
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 50, 
        backgroundColor: '#8A2BE2',
        borderRadius: 5,
        elevation: 3,
        marginTop: 50,
      },
      textoBotao: {
        color: 'white',
        fontSize: 16,
      },
});

export default InfoAdm;