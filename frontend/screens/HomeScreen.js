import React, { useState } from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, View, Image, Text, Keyboard, ScrollView } from 'react-native';


function HomeScreen() {  
  const htmlContent = `
    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3594.9931725897354!2d-53.10019272460145!3d-25.704650077387758!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94f048f00dd26185%3A0x3965e767d865130a!2sUTFPR%20-%20Dois%20Vizinhos!5e0!3m2!1spt-BR!2sbr!4v1745415525946!5m2!1spt-BR!2sbr" 
    width="960" 
    height="600" 
    style="border:0;" 
    allowfullscreen="" loading="lazy"
    referrerpolicy="no-referrer-when-downgrade">
    </iframe>  
    `;
 

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View>
          <Image
            style={styles.imgPerfil}
            source={require('../img/teste.png')}
          />
        </View>

        <View style={styles.about}>
          <Text>Sobre Nós:</Text>
          <Text>Um Abrigo Muito Legal :D</Text>
        </View>

        <View style={styles.mapa}>
          <Text>Endereço:</Text>
          <View style={styles.mapContainer}>
            <WebView
              style={styles.webView}
              originWhitelist={['*']}
              source={{ html: htmlContent }}
            />
          </View>
        </View>

        <View style={styles.aboutADM}>

          <Text>Sobre o Administrador:</Text>
          <View style={styles.sobre}>
            <Text>Um Abrigo Muito Legal</Text>
            <Image
              style={styles.imgADM}
              source={require('../img/Cachorro.png')}
            />
            </View>

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
  imgPerfil: {
    marginTop: 50,
    width: 250,
    height: 250,
    borderRadius: 125,
    marginBottom: 20,
  },
  about: {
    marginTop: 40,
    marginBottom: 40,
    backgroundColor: 'white',
    width: 320,
    height: 110,
    padding: 20,
    borderRadius: 15,
  },
  mapa: {
    justifyContent: 'center', 
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10, 
  },

  aboutADM: {
    marginTop: 40,
    marginBottom: 40,
    width: 320,
    borderRadius: 15,
    padding: 10,
    backgroundColor: 'white',
  },
  sobre: {
    flexDirection: 'row',
    width: 310,
    height: 110,
    padding: 20,
    borderRadius: 15,
    maxHeight: 80,
    justifyContent: 'space-between', 
    alignItems: 'center'
  },
  imgADM: {
    width: 50,
    height: 50,
  },
  mapContainer: {
    width: '300',
    height: '190', 
    borderRadius: 10,
    overflow: 'hidden',
  },
  webView: {
    flex: 1,
  },

});

export default HomeScreen;