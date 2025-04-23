import React, { useState } from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, View, Image, Text, Keyboard, ScrollView } from 'react-native';


function InfoScreen() {
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
                <View style={styles.imgChat} edges={['top']}>
                    <Image
                        style={styles.imgChat}
                        source={require('../img/Chat.png')}
                    />
                </View>
                <View>
                    <Text>Sobre Nós:</Text>
                    <Text>Um Abrigo Muito Legal</Text>
                </View>
                <View style={styles.divCadastro}>
                    <Text>Endereço:</Text>
                    <View style={styles.mapContainer}>
                        <WebView
                            style={styles.webView}
                            originWhitelist={['*']}
                            source={{ html: htmlContent }}
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
    divCadastro: {
        flex: 1,
        justifyContent: 'center', // Centraliza o conteúdo na tela de login
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 10, // Adicionado um padding para o conteúdo não ficar nas bordas
    },
    imgChat: {
        width: 60,
        height: 60,
        paddingEnd: 20,
        alignSelf: 'flex-end',
        borderRadius: 0,
        marginBottom: 20,
    },
    mapContainer: {
        width: '300',
        height: '190', // Defina uma altura para o mapa
        borderRadius: 10,
        overflow: 'hidden',
    },
    webView: {
        flex: 1,
    },
    taskContainer: {
        width: '90%',
        backgroundColor: '#f0f0f0',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
    },
});

export default InfoScreen;