import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { urlIp } from '@env';

function PerfilAnimal({ route }) {
  const { animalId, abrigoId } = route.params; // Removido 'animal' se não for usado diretamente aqui
  const [animalDetalhes, setAnimalDetalhes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  // Configura o header da tela
  useLayoutEffect(() => {
    if (animalDetalhes) {
      navigation.setOptions({
        title: animalDetalhes.nome || 'Perfil do Animal', // Usa o nome do animal como título
        headerShown: true,
        headerStyle: {
          backgroundColor: '#8A2BE2',
        },
        headerTintColor: 'white',
        headerTitleAlign: 'center',
        // O botão de voltar padrão do header já deve funcionar.
        // Se precisar de um comportamento customizado, pode adicionar headerLeft aqui.
      });
    } else {
      navigation.setOptions({
        title: 'Perfil do Animal',
        headerShown: true,
        headerStyle: {
          backgroundColor: '#8A2BE2',
        },
        headerTintColor: 'white',
        headerTitleAlign: 'center',
      });
    }
  }, [navigation, animalDetalhes]);

  //const goToHomeAdm = (abrigoId) => {
  //  if (abrigoId) {
  //    console.log(`ID do Dono (Abrigo): ${abrigoId}`);
  //    navigation.navigate('Main', { screen: 'Home', params: { abrigoId: abrigoId } });
  //  } else {
  //    Alert.alert('Erro', 'ID do abrigo não encontrado para navegar.');
  //  }
  //};

useEffect(() => {
    const buscarDetalhesAnimal = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://${urlIp}:3000/animais/${animalId}`);
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status}`);
        }
        const data = await response.json();
        setAnimalDetalhes(data);
      } catch (err) {
        console.error('Erro ao buscar detalhes do animal:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (animalId) {
      buscarDetalhesAnimal();
    } else {
      setError("ID do animal não fornecido.");
      setLoading(false);
    }
  }, [animalId]);

  // Removido goToHomeAdm, pois o header padrão já terá um botão de voltar
  // Se precisar de navegação específica ao voltar, pode reimplementar no headerLeft

  if (loading) {
    return (
      <View style={styles.centeredMessageContainer}>
        <ActivityIndicator size="large" color="#8A2BE2" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredMessageContainer}>
        <Text style={styles.errorText}>Erro ao buscar detalhes: {error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            // Reinicia a busca
            if (animalId) {
                setLoading(true);
                setError(null);
                // buscarDetalhesAnimal(); // A dependência [animalId] no useEffect já fará isso se animalId mudar,
                                        // mas para um retry manual, chamamos diretamente.
                // Para forçar re-fetch com o mesmo animalId, podemos resetar animalDetalhes
                setAnimalDetalhes(null);
                // E então o useEffect será re-executado na próxima renderização
                // Ou chamar a função de busca diretamente:
                const reFetch = async () => {
                    setLoading(true);
                    setError(null);
                    try {
                        const response = await fetch(`http://${urlIp}:3000/animais/${animalId}`);
                        if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);
                        const data = await response.json();
                        setAnimalDetalhes(data);
                    } catch (err) {
                        console.error('Erro ao buscar detalhes do animal:', err);
                        setError(err.message);
                    } finally {
                        setLoading(false);
                    }
                };
                reFetch();
            }
          }}
        >
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!animalDetalhes) {
    return (
      <View style={styles.centeredMessageContainer}>
        <Text style={styles.errorText}>Nenhum detalhe do animal encontrado.</Text>
      </View>
    );
  }
const InfoRow = ({ label, value, style }) => ( // Adicionado 'style' como prop opcional
    <View style={[styles.infoRowBase, style]}>
      <Text style={styles.label}>{label}: </Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
  return (
    <ScrollView style={styles.scrollContainer}>
      <Image
        source={{ uri: `http://${urlIp}:3000/animais/${animalDetalhes.id}/imagem` }}
        style={styles.animalHeaderImage}
        resizeMode="cover"
      />
      <View style={styles.detailsContainer}>
        {/* Container principal para os InfoRows com flexWrap */}
        <View style={styles.infoGridContainer}>
          <InfoRow label="Nome" value={animalDetalhes.nome} style={styles.infoGridItem} />
          <InfoRow label="Sexo" value={animalDetalhes.sexo} style={styles.infoGridItem} />
          {/* Data de Nascimento ocupando a linha toda */}
          <InfoRow label="Data de Nascimento" value={animalDetalhes.dataNascimento} style={styles.infoGridItemWide} />
          <InfoRow label="Espécie" value={animalDetalhes.especie} style={styles.infoGridItem} />
          <InfoRow label="Raça" value={animalDetalhes.raca} style={styles.infoGridItem} />
          <InfoRow label="Porte" value={animalDetalhes.porte} style={styles.infoGridItem} />
          <InfoRow label="Castrado(a)" value={animalDetalhes.castrado ? 'Sim' : 'Não'} style={styles.infoGridItem} />
          {/* Campos mais longos ocupando a linha toda */}
          <InfoRow label="Doenças" value={animalDetalhes.doencas || 'Nenhuma informada'} style={styles.infoGridItemWide} />
          <InfoRow label="Deficiências" value={animalDetalhes.deficiencias || 'Nenhuma informada'} style={styles.infoGridItemWide} />
          <InfoRow label="Sobre" value={animalDetalhes.informacoes || 'Nenhuma informação adicional'} style={styles.infoGridItemWide} />
        </View>
        {/* Botão para ir para o perfil do abrigo, se necessário */}
        {abrigoId && (
            <TouchableOpacity
                style={styles.abrigoButton}
                onPress={() => navigation.navigate('Main', { screen: 'Home', params: { abrigoId: abrigoId } })}
            >
                <Text style={styles.abrigoButtonText}>Ver Abrigo</Text>
            </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  animalHeaderImage: {
    width: '100%',
    height: 300,
  },
  detailsContainer: { // Container geral abaixo da imagem
    padding: 10,
  },
  infoGridContainer: { // Container para os InfoRows com layout de grid
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoRowBase: { // Estilo base para cada caixa de informação individual
    flexDirection: 'row', // Label e valor na mesma linha
    flexWrap: 'wrap',    // Permite que o valor quebre a linha se for longo
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12, // Aumentei um pouco o padding para melhor visualização
    borderColor: '#8A2BE2',
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
    alignItems: 'flex-start', // Alinha o label e value no topo
  },
  infoGridItem: { // Estilo para InfoRows que ocupam metade da largura
    width: '48.5%', // Ajustado para melhor encaixe com space-between
    marginBottom: 10,
  },
  infoGridItemWide: { // Estilo para InfoRows que ocupam a largura total
    width: '100%',
    marginBottom: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#555',
    marginRight: 5, // Adiciona um pequeno espaço entre o label e o valor
  },
  value: {
    fontSize: 15,
    color: '#333',
    flexShrink: 1, // Importante para o valor quebrar corretamente
  },
  centeredMessageContainer: {
    flex: 1,
// ...existing code...
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#8A2BE2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  abrigoButton: {
    marginTop: 20,
    backgroundColor: '#8A2BE2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 50,
  },
  abrigoButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default PerfilAnimal;