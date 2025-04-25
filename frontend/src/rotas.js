import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

function SeuComponente() {
  const [cadastroInfo, setCadastroInfo] = useState(null); // Para armazenar as informações do backend
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const buscarCadastro = async () => {
      try {
        // 1. Defina a URL do seu endpoint de backend para buscar as informações
        //    Use a mesma URL que você usa no Postman para a requisição GET.
        const apiUrl = 'http://localhost:3000/users'; // <------------------- SUBSTITUA PELA SUA URL DO POSTMAN

        // Se a sua requisição GET no Postman inclui parâmetros na URL,
        // adicione-os aqui. Exemplo:
        // const apiUrl = 'http://localhost:8082/cadastro?id=123&detalhes=true';

        // 2. Faça a requisição GET usando fetch (o método GET é o padrão)
        const response = await fetch(apiUrl);

        // 3. Verifique se a resposta foi bem-sucedida
        if (!response.ok) {
          const errorData = await response.json(); // Tenta parsear a resposta de erro como JSON
          throw new Error(`Erro ao buscar informações: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
        }

        // 4. Se a busca foi bem-sucedida, parseie a resposta JSON
        const data = await response.json();
        setCadastroInfo(data); // Armazena as informações do backend
        setLoading(false);
      } catch (err) {
        // 5. Trate erros na requisição ou no processamento
        setError(err.message);
        setLoading(false);
      }
    };

    // Chame a função de busca quando o componente for montado
    buscarCadastro();
  }, []);

  // 6. Renderize a interface com base no estado
  if (loading) {
    return <View style={styles.container}><ActivityIndicator size="large" color="#8A2BE2" /></View>;
  }

  if (error) {
    return <View style={styles.container}><Text style={styles.errorText}>Erro ao buscar informações: {error}</Text></View>;
  }

  if (cadastroInfo) {
    // 7. Se as informações foram carregadas com sucesso, renderize-as
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Informações do Cadastro:</Text>
        {/* Aqui você pode acessar as propriedades do objeto cadastroInfo
           e exibir as informações que você precisa.
           Adapte de acordo com a estrutura da resposta do seu backend.
           Exemplo: */}
        {cadastroInfo.nome && <Text>Nome: {cadastroInfo.nome}</Text>}
        {cadastroInfo.idade && <Text>Idade: {cadastroInfo.idade}</Text>}
        {cadastroInfo.telefone && <Text>Contato: {cadastroInfo.telefone}</Text>}
        {/* ... adicione outras informações que você precisa exibir */}
      </View>
    );
  }

  return null; // Estado inicial
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default SeuComponente;