import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { urlIp } from '@env';

function VoluntarioFormScreen() {
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [cep, setCep] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [error, setError] = useState(null);
  const [jaInscrito, setJaInscrito] = useState(false); // Novo estado
  const route = useRoute();
  const { abrigoId } = route.params || {};

  const userId = '681ea614e52f3511668cda67'; // Substitua pela forma real de obter o ID

  const verificarInscricao = async () => {
    try {
      const inscricaoUrl = `http://${urlIp}:3000/candidaturas?userId=${userId}&abrigoId=${abrigoId}`;
      const response = await fetch(inscricaoUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao verificar inscrição: ${response.status}`);
      }

      const data = await response.json();
      setJaInscrito(data.length > 0);
    } catch (error) {
      setError(`Erro ao verificar inscrição: ${error.message}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoadingUser(true);
      setError(null);
      try {
        const userUrl = `http://${urlIp}:3000/users/${userId}`;
        const response = await fetch(userUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Erro ao buscar dados do usuário: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
        }

        const userData = await response.json();
        setNome(userData.nome || '');
        setIdade(userData.idade ? userData.idade.toString() : '');
        setCpf(userData.cpf || '');
        setTelefone(userData.telefone || '');
        setEmail(userData.email || '');
        setRua(userData.endereco?.rua || '');
        setNumero(userData.endereco?.numero || '');
        setBairro(userData.endereco?.bairro || '');
        setCidade(userData.endereco?.cidade || '');
        setEstado(userData.endereco?.estado || '');
        setCep(userData.endereco?.cep || '');

        await verificarInscricao(); // Verificar a inscrição após buscar os dados do usuário
      } catch (err) {
        setError(`Erro ao buscar dados: ${err.message}`);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchData();
  }, [userId, abrigoId]);

  const handleVoluntariar = async () => {
    setLoading(true);
    setError(null);

    if (!nome || !idade || !telefone || !email) {
      setError('Por favor, preencha todos os campos.');
      setLoading(false);
      return;
    }

    try {
      const volunteerUrl = `http://${urlIp}:3000/candidaturas`;
      const volunteerResponse = await fetch(volunteerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          abrigoId: abrigoId,
          userId: userId,
          nome: nome,
          cpf: cpf,
          idade: parseInt(idade, 10),
          endereco: {
            rua: rua,
            numero: numero,
            bairro: bairro,
            cidade: cidade,
            estado: estado,
            cep: cep
          },
          telefone: telefone,
          email: email,
          cargo: 'Voluntario',
          curriculo: 'N/A',
          aprovacao: false,
        }),
      });

      const responseContentType = volunteerResponse.headers.get('content-type');
      let responseData;

      if (responseContentType && responseContentType.includes('application/json')) {
        responseData = await volunteerResponse.json();
      } else {
        responseData = await volunteerResponse.text();
      }

      console.log('Resposta da candidatura:', responseData);

      if (!volunteerResponse.ok) {
        const errorMessage = typeof responseData === 'object' && responseData.message ?
          responseData.message :
          responseData;
        throw new Error(`Erro ao candidatar-se ao abrigo: ${volunteerResponse.status} - ${errorMessage || 'Erro desconhecido'}`);
      }

      Alert.alert('Sucesso', 'Sua candidatura foi enviada com sucesso!', [
        {
          text: 'OK', onPress: () => {
            setNome('');
            setIdade('');
            setTelefone('');
            setCpf('');
            setEmail('');
            setRua('');
            setNumero('');
            setBairro('');
            setCidade('');
            setEstado('');
            setCep('');
            setJaInscrito(true); // Atualizar o estado após a inscrição
          }
        },
      ]);
    } catch (err) {
      setError(`Erro ao realizar a operação: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loadingUser) {
    return <View style={styles.container}><ActivityIndicator size="large" color="#8A2BE2" /></View>;
  }

  if (error) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.title}>Candidatar-se como Voluntário</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome Completo"
          value={nome}
          onChangeText={setNome}
        />

        <TextInput
          style={styles.input}
          placeholder="Idade"
          value={idade}
          onChangeText={setIdade}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="CPF"
          value={cpf}
          onChangeText={setCpf}
          keyboardType="text"
        />

        <TextInput
          style={styles.input}
          placeholder="Telefone"
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="phone-pad"
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Rua"
          value={rua}
          onChangeText={setRua}
        />

        <TextInput
          style={styles.input}
          placeholder="Número"
          value={numero}
          onChangeText={setNumero}
          keyboardType="text"
        />

        <TextInput
          style={styles.input}
          placeholder="Bairro"
          value={bairro}
          onChangeText={setBairro}
        />

        <TextInput
          style={styles.input}
          placeholder="Cidade"
          value={cidade}
          onChangeText={setCidade}
        />

        <TextInput
          style={styles.input}
          placeholder="Estado"
          value={estado}
          onChangeText={setEstado}
        />

        <TextInput
          style={styles.input}
          placeholder="CEP"
          value={cep}
          onChangeText={setCep}
          keyboardType="text"
        />

        <Pressable style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }]} onPress={handleVoluntariar} disabled={loading}>
          {loading ? <ActivityIndicator color="white" /> : <Text style={{ color: 'white', fontSize: 16 }}>Candidatar-se</Text>}
        </Pressable>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {jaInscrito ? (
        <Text style={styles.title}>Você já está inscrito, aguarde o resultado.</Text>
      ) : (
        <>
          <Text style={styles.title}>Candidatar-se como Voluntário</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome Completo"
            value={nome}
            onChangeText={setNome}
          />
          <TextInput
            style={styles.input}
            placeholder="Idade"
            value={idade}
            onChangeText={setIdade}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="CPF"
            value={cpf}
            onChangeText={setCpf}
            keyboardType="text"
          />
          <TextInput
            style={styles.input}
            placeholder="Telefone"
            value={telefone}
            onChangeText={setTelefone}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Rua"
            value={rua}
            onChangeText={setRua}
          />
          <TextInput
            style={styles.input}
            placeholder="Número"
            value={numero}
            onChangeText={setNumero}
            keyboardType="text"
          />
          <TextInput
            style={styles.input}
            placeholder="Bairro"
            value={bairro}
            onChangeText={setBairro}
          />
          <TextInput
            style={styles.input}
            placeholder="Cidade"
            value={cidade}
            onChangeText={setCidade}
          />
          <TextInput
            style={styles.input}
            placeholder="Estado"
            value={estado}
            onChangeText={setEstado}
          />
          <TextInput
            style={styles.input}
            placeholder="CEP"
            value={cep}
            onChangeText={setCep}
            keyboardType="text"
          />
          {error && <Text style={styles.errorText}>{error}</Text>}
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && { opacity: 0.8 },
            ]}
            onPress={handleVoluntariar}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{ color: 'white', fontSize: 16 }}>Candidatar-se</Text>
            )}
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    width: 280,
    height: 40,
    margin: 10,
    borderRadius: 30,
    borderWidth: 0.2,
    borderBottomWidth: 1,
    padding: 10,
  },
  button: {
    backgroundColor: '#8A2BE2',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 50,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default VoluntarioFormScreen;