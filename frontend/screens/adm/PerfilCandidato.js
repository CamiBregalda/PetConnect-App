import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';

function PerfilCandidato({ route, onAprovado }) {
  const { userId, candidaturaId } = route.params;
  const [candidatoDetalhes, setCandidatoDetalhes] = useState(null);
  const [candidatura, setCandidatura] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasTriedLoading, setHasTriedLoading] = useState(false);

  useEffect(() => {
    const buscarDetalhesCandidato = async () => {
      setLoading(true);
      setError(null);
      try {
        // Busca os detalhes do usuário
        const userResponse = await fetch(`http://192.168.3.7:3000/users/${userId}`);
        const userData = await userResponse.json();
        setCandidatoDetalhes(userData);

        // Busca os detalhes da candidatura usando o ID da candidatura
        const candidaturaResponse = await fetch(`http://192.168.3.7:3000/candidaturas/${candidaturaId}`);
        if (!candidaturaResponse.ok) {
          throw new Error(`Erro ao buscar candidatura: ${candidaturaResponse.status}`);
        }
        const candidaturaData = await candidaturaResponse.json();
        setCandidatura(candidaturaData);

      } catch (err) {
        console.error('Erro:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    buscarDetalhesCandidato();
  }, [userId, candidaturaId]);

  const aprovarCandidato = async () => {
    try {
      const response = await fetch(`http://192.168.3.7:3000/candidaturas/${candidaturaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ aprovacao: true }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro ao aprovar candidato: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
      }

      Alert.alert('Sucesso', 'Candidato aprovado com sucesso!', [
        {
          text: 'OK', onPress: () => {
            if (onAprovado) {
              onAprovado(candidaturaId);
            }
          }
        },
      ]);
      // Atualizar a interface para refletir a aprovação
    } catch (err) {
      setError(`Erro ao aprovar candidato: ${err.message}`);
      Alert.alert('Erro', `Não foi possível aprovar o candidato: ${err.message}`);
    }
  };

  const rejeitarCandidato = async () => {
    try {
      const response = await fetch(`http://192.168.3.7:3000/candidaturas/${candidaturaId}`, { // Use candidaturaId
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro ao rejeitar candidato: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
      }

      Alert.alert('Sucesso', 'Candidatura removida com sucesso!', [
        { text: 'OK', onPress: () => { /* Atualizar a tela ou navegar de volta */ } },
      ]);
      // Atualizar a interface para refletir a rejeição
    } catch (err) {
      setError(`Erro ao rejeitar candidato: ${err.message}`);
      Alert.alert('Erro', `Não foi possível remover a candidatura: ${err.message}`);
    }
  };


  if (loading && !hasTriedLoading) {
    return <View style={styles.container}><ActivityIndicator size="large" color="#8A2BE2" /></View>;
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

            const buscarDetalhesCandidato = async () => {
              try {
                const userResponse = await fetch(`http://192.168.3.7:3000/users/${userId}`);
                const userData = await userResponse.json();
                setCandidatoDetalhes(userData);

                const candidaturaResponse = await fetch(`http://192.168.3.7:3000/candidaturas/${candidaturaId}`);
                if (!candidaturaResponse.ok) {
                  throw new Error(`Erro ao buscar candidatura: ${candidaturaResponse.status}`);
                }
                const candidaturaData = await candidaturaResponse.json();
                setCandidatura(candidaturaData);
                setLoading(false);
                setHasTriedLoading(true);
              } catch (err) {
                setError(err.message);
                setLoading(false);
                setHasTriedLoading(true);
              }
            };
            buscarDetalhesCandidato();
          }}
        >
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!candidatoDetalhes && hasTriedLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Nenhum candidato encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes do Candidato</Text>
      <View style={styles.infoContainer}>
        <Image
          source={{ uri: `http://192.168.3.7:3000/users/${userId}/imagem` }}
          style={styles.listImage} />
        {candidatoDetalhes && (
          <>
            <Text style={styles.label}>Nome:</Text>
            <Text style={styles.value}>{candidatoDetalhes.nome}</Text>

            <Text style={styles.label}>Idade:</Text>
            <Text style={styles.value}>{candidatoDetalhes.idade}</Text>

            <Text style={styles.label}>Contato:</Text>
            <Text style={styles.value}>{candidatoDetalhes.telefone}</Text>

            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{candidatoDetalhes.email}</Text>

            <Text style={styles.label}>Endereço:</Text>
            <Text style={styles.value}>{candidatoDetalhes.endereco}</Text>
            {/* Display other user data */}
          </>
        )}

        {candidatura && (
          <>
            <Text style={styles.label}>Cargo:</Text>
            <Text style={styles.value}>{candidatura.cargo}</Text>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{candidatura.aprovacao ? 'Aprovado' : 'Pendente'}</Text>
          </>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.aprovarButton} onPress={() => aprovarCandidato()}>
          <Text style={styles.buttonText}>Aprovar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rejeitarButton} onPress={rejeitarCandidato}>
          <Text style={styles.buttonText}>Rejeitar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
    marginTop: 40,

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
  infoContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 2,
  },
  listImage: {
    width: 130,
    height: 100,
    borderRadius: 10,
    marginBottom: 0,
    resizeMode: 'cover',
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  aprovarButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    flex: 1,
    alignItems: 'center',
  },
  rejeitarButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  retryButton: {
    backgroundColor: '#8A2BE2',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});

export default PerfilCandidato;

