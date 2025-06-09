import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import MapViewComponent from '../../components/MapView'; // Importe o componente MapView
import { urlIp } from '@env';
import { useRoute } from '@react-navigation/native'; // Importe o hook useRoute

const ChamadoAbandono = () => {
    const route = useRoute(); // Use o hook useRoute para acessar os parâmetros da rota
    const { abrigoId } = route.params; // Acesse o parâmetro abrigoId

    console.log('abrigoId:', abrigoId);
    const [abandonos, setAbandonos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAbandonos = async () => {
        setLoading(true);
        setError(null);
        try {
            const url = `http://${urlIp}:3000/abandonos`; // Endpoint para buscar todos os abandonos
            console.log('Fetching abandonos from:', url); // Adicione este log
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Erro ao buscar abandonos: ${response.status}`);
            }
            const data = await response.json();
            setAbandonos(data);
        } catch (err) {
            console.error('Erro ao buscar chamados de abandono:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAbandonos();
    }, []);

    const handleResgatarAnimal = async (abandonoId) => {
        try {
            const response = await fetch(`http://${urlIp}:3000/abandonos/${abandonoId}`, { // Endpoint para marcar como resgatado
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idAbrigoResgatou: abrigoId,
                    animalResgatado: true,
                }),
            });

            if (!response.ok) {
                throw new Error(`Erro ao resgatar animal: ${response.status}`);
            }

            // Atualizar a lista de abandonos após o resgate
            setAbandonos(
                abandonos.map((abandono) =>
                    abandono.id === abandonoId ? { ...abandono, animalResgatado: true } : abandono
                )
            );
            fetchAbandonos(); // Busca novamente os abandonos atualizados
            Alert.alert('Sucesso', 'Animal marcado como resgatado!');
        } catch (err) {
            console.error('Erro ao marcar animal como resgatado:', err);
            Alert.alert('Erro', 'Não foi possível marcar o animal como resgatado.');
        }
    };

    if (loading) {
        return <Text>Carregando chamados...</Text>;
    }

    if (error) {
        return <Text>Erro ao carregar chamados: {error}</Text>;
    }

    // Filtrar os abandonos para exibir apenas aqueles com animalResgatado como false
    const abandonosNaoResgatados = abandonos.filter(abandono => !abandono.animalResgatado);

    const getUsernameFromEmail = (email) => {
        // Tenta extrair o nome do usuário do email
        try {
            return email.split('@')[0];
        } catch (error) {
            console.error("Erro ao extrair o nome do usuário do email:", error);
            return "Usuário"; // Retorna um nome padrão em caso de erro
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View >
                <Text style={styles.title}>Registros de Abandono</Text>
            </View>
            {abandonosNaoResgatados.length > 0 ? (
                abandonosNaoResgatados?.map((abandono) => (

                    <View key={abandono.id} style={styles.abandonoContainer}>

                        <Text style={styles.emailUser}>Usuário: {getUsernameFromEmail(abandono.emailUser)}</Text>

                        {/* Exibir o MapViewComponent */}
                        <View style={styles.mapContainer}>
                            <MapViewComponent enderecoAbrigo={abandono.local} />
                        </View>

                        <Text style={styles.descricao}>Descrição: {abandono.descricao}</Text>

                        {/* Exibir as imagens */}
                        <ScrollView horizontal style={styles.imagesContainer}>
                            {abandono.images?.map((image, index) => (
                                <Image key={index} source={{ uri: `http://${urlIp}:3000/abandono/${abandono.id}/imagem` }} style={styles.image} />
                            ))}
                        </ScrollView>

                        {/* Botão de Resgate */}
                        <TouchableOpacity style={styles.resgateButton} onPress={() => handleResgatarAnimal(abandono.id)}>
                            <Text style={styles.resgateButtonText}>Resgatar</Text>
                        </TouchableOpacity>
                    </View>
                ))
            ) : (
                <Text style={styles.noChamadosText}>Nenhum registo de abandono encontrado</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: 20,
    },
    abandonoContainer: {
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    emailUser: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    mapContainer: {
        height: 200,
        marginBottom: 10,
    },
    map: {
        flex: 1,
    },
    descricao: {
        fontSize: 14,
        marginBottom: 10,
    },
    imagesContainer: {
        marginBottom: 10,
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 5,
    },
    resgateButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    resgateButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    noChamadosText: {
        fontSize: 18,
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default ChamadoAbandono;