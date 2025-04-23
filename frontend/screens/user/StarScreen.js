import React from 'react';
import { StyleSheet, View, Image, Text, Keyboard, ScrollView } from 'react-native';
import SearchInput from '../../botaodepesquisar';


function StarScreen() {


  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.divPesquisa} >
          <Image
            style={styles.imgPesquisa}
            source={require('../../img/Filtro.png')}
          />
          <SearchInput />
          <Image
            style={styles.imgPesquisa}
            source={require('../../img/Lupa.png')}
          />
        </View>
        
        <View style={styles.divAnimais}>
          <Text style={styles.textoAnimais}>Animais próximo a você:</Text>
          <View style={styles.imagensContainer}>
            <Image
              style={styles.imgAnimais}
              source={require('../../img/Gato.png')}
            />
            <Image
              style={styles.imgAnimais}
              source={require('../../img/Cachorro.png')}
            />
          </View>
          <Text style={styles.viewMore}>View more...</Text>
        </View>
        <View style={styles.divAnimais}>
          <Text style={styles.textoAnimais}>Abrigos próximo a você:</Text>
          <View style={styles.imagensContainer}>
            <Image
              style={styles.imgAnimais}
              source={require('../../img/PET.png')}
            />
            <Image
              style={styles.imgAnimais}
              source={require('../../img/PET.png')}
            />
          </View>
          <Text style={styles.viewMore}>View more...</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#E7E3E3',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  imgChat: {
    width: 60,
    height: 60,
    paddingEnd: 20,
    alignSelf: 'flex-end',
    borderRadius: 0,
    marginBottom: 20,
  },
  divPesquisa: {
    marginTop: 60,
    marginBottom: 40,
    justifyContent: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    width: 300,
    padding: 20,
    borderRadius: 15,
    maxHeight: 80,
  },
  imgPesquisa: {
    width: 30,
    height: 30,
    marginHorizontal: 10,
  },
  taskContainer: {
    width: '90%',
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  divAnimais: {
    backgroundColor: 'white',
    width: 300,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  imagensContainer: {
    flexDirection: 'row',
    marginVertical: 15,
  },
  imgAnimais: {
    width: 100,
    height: 100,
    marginHorizontal: 10,
  },
  textoAnimais: {
    fontSize: 20,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  viewMore: {
    alignSelf: 'flex-end',
    marginTop: 10,
    color: '#8A2BE2',
  },
});

export default StarScreen;