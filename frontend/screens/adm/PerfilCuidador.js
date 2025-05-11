import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';

function PerfilCuidador({ route }) {
  const { userId } = route.params; // Alterado para userId
  const [CuidadorDetalhes, setCuidadorDetalhes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasTriedLoading, setHasTriedLoading] = useState(false);

  useEffect(() => {
     const buscarDetalhesCuidador = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log(userId); // Alterado para userId
        const response = await fetch(`http://192.168.3.7:3000/cuidadores/${userId}`); // Rota alterada
        if (!response.ok) {
          let errorMessage = `Erro ao buscar cuidador: ${response.status}`;
          try {
            const errorData = await response.json();
            if (errorData && errorData.message) {
              errorMessage += ` - ${errorData.message}`;
            }
          } catch (jsonError) {
            console.error("Erro ao analisar resposta JSON de erro:", jsonError);
          }
          throw new Error(errorMessage);
        }
        const data = await response.json();
        if (!data || !data.id) { // Mantive data.id, verifique se a API retorna o ID
          throw new Error('Dados do Cuidador inválidos');
        }
        setCuidadorDetalhes(data);
      } catch (err) {
        console.error('Erro:', err);
        setError(err.message);
      } finally {
        setLoading(false);
        setHasTriedLoading(true);
      }
    };

    buscarDetalhesCuidador();
  }, [userId]); 


  if (loading && !hasTriedLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#8A2BE2" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro ao buscar detalhes: {error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setError(null);
            setLoading(true);
            setHasTriedLoading(false);

            const buscarDetalhesCuidador  = async () => {
              try {
               const response = await fetch(`http://192.168.3.7:3000/cuidadores/${userId}`); // Rota alterada
                if (!response.ok) {
                  let errorMessage = `Erro ao buscar cuidador: ${response.status}`;
                  try {
                    const errorData = await response.json();
                    if (errorData && errorData.message) {
                      errorMessage += ` - ${errorData.message}`;
                    }
                  } catch (jsonError) {
                    console.error("Erro ao analisar resposta JSON de erro:", jsonError);
                  }
                  throw new Error(errorMessage);
                }
                const data = await response.json();
                if (!data || !data.id) {  // Mantive data.id, verifique se a API retorna o ID
                  throw new Error('Dados do Cuidador inválidos');
                }
                setCuidadorDetalhes(data);
                setLoading(false);
                setHasTriedLoading(true);
              } catch (err) {
                setError(err.message);
                setLoading(false);
                setHasTriedLoading(true);
              }
            };
            buscarDetalhesCuidador();
          }}
        >
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!CuidadorDetalhes  && hasTriedLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Nenhum Cuidador encontrado</Text>
      </View>
    );
  }

  if (!CuidadorDetalhes) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Nenhum Cuidador encontrado</Text>
      </View>
    );
  }

  return (
     <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Detalhes do Cuidador</Text>
        <View style={styles.infoContainer}>
          <View style={styles.imageView}>
            <Image
              source={{ uri: `http://192.168.3.7:3000/cuidadores/${CuidadorDetalhes.id}/imagem` }} // Mantive CuidadorDetalhes.id, verifique
              style={styles.imgAdm}
            />
          </View>
          <Text style={styles.label}>Nome:</Text>
          <Text style={styles.value}>{CuidadorDetalhes.nome}</Text>

          <Text style={styles.label}>Idade:</Text>
          <Text style={styles.value}>{CuidadorDetalhes.idade}</Text>

          <Text style={styles.label}>Data de Nascimento:</Text>
          <Text style={styles.value}>{CuidadorDetalhes.dataNascimento}</Text>

          <Text style={styles.label}>Especie:</Text>
          <Text style={styles.value}>{CuidadorDetalhes.especie}</Text>

          <Text style={styles.label}>Porte:</Text>
          <Text style={styles.value}>{CuidadorDetalhes.porte}</Text>

          <Text style={styles.label}>Castrado(a):</Text>
          <Text style={styles.value}>{CuidadorDetalhes.castrado}</Text>

          <Text style={styles.label}>Doencas:</Text>
          <Text style={styles.value}>{CuidadorDetalhes.doencas}</Text>

          <Text style={styles.label}>Deficiências:</Text>
          <Text style={styles.value}>{CuidadorDetalhes.deficiencias}</Text>

          <Text style={styles.label}>Sobre:</Text>
          <Text style={styles.value}>{CuidadorDetalhes.informacoes}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
    marginTop: 40,

  },
  imageView: {
    alignItems: 'center',
  },
  imgAdm: {
    width: 250,
    height: 250,
    borderRadius: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
   retryButton: {
    backgroundColor: '#8A2BE2',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  infoContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
 
});
export default PerfilCuidador;

