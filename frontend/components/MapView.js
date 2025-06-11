import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const MapView = ({ enderecoAbrigo }) => {
  if (!enderecoAbrigo || typeof enderecoAbrigo !== 'object' || Object.keys(enderecoAbrigo).length === 0) {
    return (
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>Endereço não fornecido para exibir o mapa.</Text>
      </View>
    );
  }

  const { rua, numero, bairro, cidade, estado, cep } = enderecoAbrigo;
  const partesEndereco = [rua, numero, bairro, cidade, estado, cep];
  const enderecoCompletoString = partesEndereco
    .filter(part => part && String(part).trim() !== '')
    .join(', ');

  if (!enderecoCompletoString) {
    return (
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>Endereço inválido para exibir o mapa.</Text>
      </View>
    );
  }

  const mapaHtmlContent = `<iframe src="https://maps.google.com/maps?q=${encodeURIComponent(enderecoCompletoString)}&hl=pt&amp;z=17&amp;output=embed" style="border:0; width:100%; height:100%;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;

  return (
    <WebView
      style={styles.webView}
      originWhitelist={['*']}
      source={{ html: mapaHtmlContent }}
      onError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.warn('MapView WebView error: ', nativeEvent);
      }}
    />
  );
};

const styles = StyleSheet.create({
  webView: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  statusContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  statusText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default MapView;