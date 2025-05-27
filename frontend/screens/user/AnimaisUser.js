import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function AnimaisUser() {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;
  const [search, setSearch] = useState('');

  return (
    <View style={styles.container}>

      {/* Barra de filtro e busca */}
      <View style={styles.searchContainer}>
        <TouchableOpacity>
          <Image source={require('../../img/Filtro.png')} style={styles.filterIcon} />
        </TouchableOpacity>
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Pesquisar"
            style={styles.input}
            value={search}
            onChangeText={setSearch}
          />
          <Image source={require('../../img/Lupa.png')} style={styles.searchIcon} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Seção Animais Adotados */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Animais Adotados:</Text>
          <View style={styles.gridRow}>
            <View style={styles.itemBox}>
              <Image source={require('../../img/Gato.png')} style={styles.itemImage} />
              <View style={styles.itemRow}>
                <Text style={styles.itemText}>El Gato</Text>
                <TouchableOpacity onPress={() => navigation.navigate('AtualizarAnimal', { userId, animalId: "680cf9162c0d16610e617013" })}>
                  <Ionicons name="create-outline" size={18} color="#555" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.itemBox}>
              <Image source={require('../../img/Cachorro.png')} style={styles.itemImage} />
              <View style={styles.itemRow}>
                <Text style={styles.itemText}>Doguinho</Text>
                <TouchableOpacity onPress={() => navigation.navigate('AtualizarAnimal', { userId, animalId: "680cf9162c0d16610e617013" })}>
                  <Ionicons name="create-outline" size={18} color="#555" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.itemBox}>
              <Image source={require('../../img/Gato.png')} style={styles.itemImage} />
              <View style={styles.itemRow}>
                <Text style={styles.itemText}>Lua</Text>
                <TouchableOpacity onPress={() => navigation.navigate('AtualizarAnimal', { userId, animalId: "680cf9162c0d16610e617013" })}>
                  <Ionicons name="create-outline" size={18} color="#555" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Seção Abrigos */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Abrigos em que voluntaria:</Text>
          <View style={styles.gridRow}>
            <View style={styles.itemBox}>
              <Image source={require('../../img/Gato.png')} style={styles.itemImage} />
              <View style={styles.itemRow}>
                <Text style={styles.itemText}>Mimi</Text>
                <TouchableOpacity onPress={() => navigation.navigate('AtualizarAbrigo', { userId, abrigoId: "68331548e4e9d6df1a66c53a" })}>
                  <Ionicons name="create-outline" size={18} color="#555" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.itemBox}>
              <Image source={require('../../img/Cachorro.png')} style={styles.itemImage} />
              <View style={styles.itemRow}>
                <Text style={styles.itemText}>Spike</Text>
                <Ionicons name="create-outline" size={18} color="#555" />
              </View>
            </View>
            <View style={styles.itemBox}>
              <Image source={require('../../img/Cachorro.png')} style={styles.itemImage} />
              <View style={styles.itemRow}>
                <Text style={styles.itemText}>Canela</Text>
                <Ionicons name="create-outline" size={18} color="#555" />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>


    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f1f1', paddingTop: 50 },
  backButton: { marginLeft: 16, marginBottom: 10 },
  backIcon: { width: 24, height: 24, resizeMode: 'contain' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterIcon: { width: 28, height: 28, marginRight: 12 },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
  },
  input: { flex: 1, fontSize: 14 },
  searchIcon: { width: 20, height: 20, tintColor: '#888' },
  sectionBox: {
    backgroundColor: '#fdfdfd',
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    borderRadius: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  gridRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  itemBox: { width: '30%', marginBottom: 20, alignItems: 'center' },
  itemImage: { width: 60, height: 60, resizeMode: 'contain', marginBottom: 8 },
  itemText: { fontSize: 14, color: '#333' },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
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
