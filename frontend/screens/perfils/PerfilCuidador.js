import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function PerfilCuidador({ route }) {
  const { userId } = route.params;
  const [cuidadorDetalhes, setCuidadorDetalhes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    if (cuidadorDetalhes) {
      navigation.setOptions({
        title: cuidadorDetalhes.nome || 'Perfil do Cuidador',
        headerShown: true,
        headerStyle: {
          backgroundColor: '#8A2BE2',
        },
        headerTintColor: 'white',
        headerTitleAlign: 'center',
      });
    } else {
      navigation.setOptions({
        title: 'Perfil do Cuidador',
        headerShown: true,
        headerStyle: {
          backgroundColor: '#8A2BE2',
        },
        headerTintColor: 'white',
        headerTitleAlign: 'center',
      });
    }
  }, [navigation, cuidadorDetalhes]);

  useEffect(() => {
    const buscarDetalhesCuidador = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://192.168.3.7:3000/cuidadores/${userId}`);
        if (!response.ok) {
          let errorMessage = `Erro ao buscar cuidador: ${response.status}`;
          try {
            const errorData = await response.json();
            if (errorData && errorData.message) {
              errorMessage += ` - ${errorData.message}`;
            }
          } catch (jsonError) {
          }
          throw new Error(errorMessage);
        }
        const data = await response.json();
        if (!data || !data.id) {
          throw new Error('Dados do Cuidador inválidos recebidos da API');
        }
        setCuidadorDetalhes(data);
      } catch (err) {
        console.error('Erro ao buscar detalhes do cuidador:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      buscarDetalhesCuidador();
    } else {
      setError("ID do cuidador não fornecido.");
      setLoading(false);
    }
  }, [userId]);

  const handleDeleteCuidador = async () => {
    if (!cuidadorDetalhes || !cuidadorDetalhes.id) {
      Alert.alert("Erro", "Não é possível remover o cuidador sem ID.");
      return;
    }

    Alert.alert(
      "Confirmar Remoção",
      `Tem certeza que deseja remover o cuidador "${cuidadorDetalhes.nome}"? Esta ação não pode ser desfeita.`,
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            try {
              const response = await fetch(`http://192.168.3.7:3000/cuidadores/${cuidadorDetalhes.id}`, {
                method: 'DELETE',
              });

              if (response.ok) {
                Alert.alert("Sucesso", "Cuidador removido com sucesso!");
                navigation.goBack();
              } else {
                let errorMsg = `Erro ao remover cuidador: ${response.status}`;
                try {
                    const errorData = await response.json();
                    if (errorData && errorData.message) {
                        errorMsg += ` - ${errorData.message}`;
                    }
                } catch (e) {
                }
                throw new Error(errorMsg);
              }
            } catch (err) {
              console.error('Falha ao remover cuidador:', err);
              Alert.alert("Erro na Remoção", err.message || "Não foi possível remover o cuidador. Tente novamente.");
            } finally {
              setIsDeleting(false);
            }
          }
        }
      ]
    );
  };

  const refetchData = () => {
    if (userId) {
        setLoading(true);
        setError(null);
        setCuidadorDetalhes(null);
        const buscarDetalhesCuidadorNovamente = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`http://192.168.3.7:3000/cuidadores/${userId}`);
                if (!response.ok) {
                    let errorMessage = `Erro ao buscar cuidador: ${response.status}`;
                    try { const errorData = await response.json(); if (errorData && errorData.message) errorMessage += ` - ${errorData.message}`; } catch (e) {}
                    throw new Error(errorMessage);
                }
                const data = await response.json();
                if (!data || !data.id) throw new Error('Dados do Cuidador inválidos');
                setCuidadorDetalhes(data);
            } catch (err) {
                console.error('Erro ao buscar detalhes do cuidador (retry):', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        buscarDetalhesCuidadorNovamente();
    }
  };

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
          onPress={refetchData}
        >
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!cuidadorDetalhes) {
    return (
      <View style={styles.centeredMessageContainer}>
        <Text style={styles.errorText}>Nenhum detalhe do cuidador encontrado.</Text>
      </View>
    );
  }

  const InfoRow = ({ label, value, style }) => (
    <View style={[styles.infoRowBase, style]}>
      <Text style={styles.label}>{label}: </Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.scrollContainer}>
      <Image
        source={{ uri: `http://192.168.3.7:3000/cuidadores/${cuidadorDetalhes.id}/imagem` }}
        style={styles.profileHeaderImage}
        resizeMode="cover"
      />
      <View style={styles.detailsContainer}>
        <View style={styles.infoGridContainer}>
          <InfoRow label="Nome" value={cuidadorDetalhes.nome} style={styles.infoGridItemWide} />
          <InfoRow label="Idade" value={cuidadorDetalhes.idade ? `${cuidadorDetalhes.idade} anos               ` : 'Não informado'} style={styles.infoGridItem} />
          <InfoRow label="Telefone" value={cuidadorDetalhes.telefone || 'Não informado'} style={styles.infoGridItem} />
          <InfoRow label="E-mail" value={cuidadorDetalhes.email || 'Nenhum informado'} style={styles.infoGridItemWide} />
        </View>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDeleteCuidador}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.actionButtonText}>Remover Cuidador</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  profileHeaderImage: {
    width: '100%',
    height: 400,
  },
  detailsContainer: {
    padding: 10,
    paddingBottom: 20,
  },
  infoGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoRowBase: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
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
    alignItems: 'flex-start',
  },
  infoGridItem: {
    width: '48.5%',
    marginBottom: 10,
  },
  infoGridItemWide: {
    width: '100%',
    marginBottom: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#555',
    marginRight: 5,
  },
  value: {
    fontSize: 15,
    color: '#333',
    flexShrink: 1,
  },
  centeredMessageContainer: {
    flex: 1,
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
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    minHeight: 48,
  },
  deleteButton: {
    backgroundColor: '#D32F2F',
    alignSelf: 'center',
    width: '80%',
    marginBottom: 20,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PerfilCuidador;