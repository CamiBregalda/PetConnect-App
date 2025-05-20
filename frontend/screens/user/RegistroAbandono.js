import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function RegistroAbandono() {
  const navigation = useNavigation();
  const [descricao, setDescricao] = useState('');

  return (
    <View style={styles.container}>
      {/* Botão de voltar */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Image source={require('../../img/seta.png')} style={styles.backIcon} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Título */}
        <Text style={styles.title}>Registrar Abandono</Text>

        {/* Descrição */}
        <TextInput
          placeholder="Informações sobre animal"
          style={styles.textArea}
          multiline
          numberOfLines={4}
          value={descricao}
          onChangeText={setDescricao}
        />

        {/* Endereço */}
        <View style={styles.infoBox}>
          <View style={styles.headerRow}>
            <Text style={styles.label}>Endereço:</Text>
            <Image source={require('../../img/Profile_Active.png')} style={styles.editIcon} />
          </View>
          <Image
            source={require('../../img/PET.png')}
            style={styles.mapImage}
            resizeMode="cover"
          />
          <Text style={styles.addressText}>Rua Fulano de Tall, 666</Text>
        </View>

        {/* Fotos */}
        <View style={styles.fotoRow}>
          <Image source={require('../../img/Gato.png')} style={styles.animalFoto} />
          <TouchableOpacity style={styles.addFotoBox}>
            <Text style={styles.addFotoText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Botão Registrar */}
        <TouchableOpacity style={styles.registrarButton}>
          <Text style={styles.registrarText}>Registrar</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Menu inferior */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('AnimaisUser')}>
          <Image source={require('../../img/Animais_Active.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('InicialUser')}>
          <Image source={require('../../img/Home_Active.png')} style={styles.navIconCenter} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('RegistroAbandono')}>
          <Image source={require('../../img/Profile_Active.png')} style={styles.navIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f1f1', paddingTop: 50 },
  backButton: { marginLeft: 16 },
  backIcon: { width: 24, height: 24, resizeMode: 'contain' },
  title: { textAlign: 'center', fontSize: 16, marginVertical: 20, color: '#333' },
  textArea: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 10,
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
    fontSize: 14,
  },
  infoBox: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 12,
    borderRadius: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  editIcon: { width: 20, height: 20, tintColor: '#555' },
  mapImage: { width: '100%', height: 150, borderRadius: 10 },
  addressText: { textAlign: 'center', color: '#333', fontSize: 14, marginTop: 6 },
  fotoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginVertical: 20,
  },
  animalFoto: { width: 90, height: 90, borderRadius: 10 },
  addFotoBox: {
    width: 90,
    height: 90,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  addFotoText: { fontSize: 28, color: '#888' },
  registrarButton: {
    backgroundColor: '#9333ea',
    marginHorizontal: 100,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  registrarText: { color: '#fff', fontSize: 16 },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 12,
    paddingBottom: 55,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  navIcon: { width: 28, height: 28, resizeMode: 'contain' },
  navIconCenter: { width: 32, height: 32, resizeMode: 'contain' },
});
