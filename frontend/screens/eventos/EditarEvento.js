import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
  Pressable,
  Modal,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { urlIp } from '@env';

const FormularioEvento = ({
    titulo, setTitulo,
    descricao, setDescricao,
    objetivo, setObjetivo,
    dataInicio, setShowInicio,
    dataFim, setShowFim,
    endereco, handleEnderecoChange
}) => {
    return (
        <>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Título:</Text>
                <TextInput
                    style={styles.input}
                    value={titulo}
                    onChangeText={setTitulo}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Descrição:</Text>
                <TextInput
                    style={[styles.input, { height: 80, paddingTop: 8 }]}
                    value={descricao}
                    onChangeText={setDescricao}
                    multiline
                    textAlignVertical="top"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Objetivo:</Text>
                <TextInput
                    style={[styles.input, { height: 80, paddingTop: 8 }]} 
                    value={objetivo}
                    onChangeText={setObjetivo}
                    multiline
                    textAlignVertical="top"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Início:</Text>
                <TouchableOpacity style={styles.input} onPress={() => setShowInicio(true)}>
                    <Text style={{fontSize: 16}}>{dataInicio.toLocaleDateString('pt-BR')}</Text>
                </TouchableOpacity>
            </View>
            
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Término:</Text>
                <TouchableOpacity style={styles.input} onPress={() => setShowFim(true)}>
                    <Text style={{fontSize: 16}}>{dataFim.toLocaleDateString('pt-BR')}</Text>
                </TouchableOpacity>
            </View>
            
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Rua:</Text>
                <TextInput style={styles.input} value={endereco.rua} onChangeText={val => handleEnderecoChange('rua', val)} />
            </View>
            
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Número:</Text>
                <TextInput style={styles.input} value={endereco.numero} onChangeText={val => handleEnderecoChange('numero', val)} keyboardType="number-pad" />
            </View>
            
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Bairro:</Text>
                <TextInput style={styles.input} value={endereco.bairro} onChangeText={val => handleEnderecoChange('bairro', val)} />
            </View>
            
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Cidade:</Text>
                <TextInput style={styles.input} value={endereco.cidade} onChangeText={val => handleEnderecoChange('cidade', val)} />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Estado:</Text>
                <TextInput style={styles.input} value={endereco.estado} onChangeText={val => handleEnderecoChange('estado', val)} />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>CEP:</Text>
                <TextInput style={styles.input} value={endereco.cep} onChangeText={val => handleEnderecoChange('cep', val)} keyboardType="number-pad" />
            </View>
        </>
    );
};


export default function EditarEvento() {
  const navigation = useNavigation();
  const { evento, userId, abrigoId } = useRoute().params;

  const [titulo, setTitulo] = useState(evento.titulo);
  const [descricao, setDescricao] = useState(evento.descricao);
  const [objetivo, setObjetivo] = useState(evento.objetivo);
  const [dataInicio, setDataInicio] = useState(new Date(evento.dataInicio));
  const [dataFim, setDataFim] = useState(new Date(evento.dataFim));
  const [endereco, setEndereco] = useState({
    rua: evento.endereco.rua || '',
    numero: evento.endereco.numero || '',
    bairro: evento.endereco.bairro || '',
    cidade: evento.endereco.cidade || '',
    estado: evento.endereco.estado || '',
    cep: evento.endereco.cep || '',
  });
  const [imageUri, setImageUri] = useState(evento.imagemUrl || null);
  const [loading, setLoading] = useState(false);
  const [showInicio, setShowInicio] = useState(false);
  const [showFim, setShowFim] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleEnderecoChange = (campo, valor) => {
    setEndereco(prev => ({ ...prev, [campo]: valor }));
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de acesso à galeria.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const getImageMimeType = uri => {
    if (uri.endsWith('.jpg') || uri.endsWith('.jpeg')) return 'image/jpeg';
    if (uri.endsWith('.png')) return 'image/png';
    return 'image/jpeg';
  };

  const handleImageUpload = async eventoId => {
    const mimeType = getImageMimeType(imageUri);
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      name: `profile.${mimeType === 'image/png' ? 'png' : 'jpg'}`,
      type: mimeType,
    });
    try {
      const response = await fetch(`http://${urlIp}:3000/eventos/${eventoId}/imagem`, {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData,
      });
      if (!response.ok) throw new Error('Falha ao enviar a imagem');
      console.log('Imagem enviada com sucesso');
    } catch (error) {
      console.error('Erro ao enviar imagem:', error);
    }
  };

  const handleSalvar = async () => {
    if (
      !titulo.trim() ||
      !descricao.trim() ||
      !objetivo.trim() ||
      !endereco.rua.trim() ||
      !endereco.numero.trim() ||
      !endereco.bairro.trim() ||
      !endereco.cidade.trim() ||
      !endereco.estado.trim() ||
      !endereco.cep.trim()
    ) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }
    setLoading(true);
    try {
      const bodyData = {
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        objetivo: objetivo.trim(),
        dataInicio: dataInicio.toISOString().split('T')[0],
        dataFim: dataFim.toISOString().split('T')[0],
        idAbrigo: evento.abrigoId,
        endereco: {
          rua: endereco.rua.trim(),
          numero: endereco.numero.trim(),
          bairro: endereco.bairro.trim(),
          cidade: endereco.cidade.trim(),
          estado: endereco.estado.trim(),
          cep: endereco.cep.trim(),
        },
      };
      const resp = await fetch(`http://${urlIp}:3000/eventos/${evento.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });
      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(errText || `Status ${resp.status}`);
      }
      await handleImageUpload(evento.id);
      Alert.alert('Sucesso', 'Evento atualizado!');
      navigation.navigate('EventosAdm', { userId, abrigoId });
    } catch (err) {
      console.error('Erro ao salvar evento:', err);
      Alert.alert('Erro', err.message || 'Não foi possível salvar.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://${urlIp}:3000/eventos/${evento.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Erro ao deletar evento');

    } catch (error) {
      console.error('Erro ao deletar evento:', error);
      Alert.alert('Erro', 'Não foi possível deletar o evento');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: 'white' }}>
        <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={28} color="#333" />
            </TouchableOpacity>
            <Text style={styles.title}>Edite seu Evento</Text>
        </View>

      <View style={styles.divCadastro}>
        
        <FormularioEvento 
            titulo={titulo} setTitulo={setTitulo}
            descricao={descricao} setDescricao={setDescricao}
            objetivo={objetivo} setObjetivo={setObjetivo}
            dataInicio={dataInicio} setShowInicio={setShowInicio}
            dataFim={dataFim} setShowFim={setShowFim}
            endereco={endereco} handleEnderecoChange={handleEnderecoChange}
        />

          {showInicio && (
            <DateTimePicker
              value={dataInicio}
              mode="date"
              display="default"
              onChange={(_, d) => {
                setShowInicio(Platform.OS === 'ios');
                if (d) setDataInicio(d);
              }}
            />
          )}

          {showFim && (
            <DateTimePicker
              value={dataFim}
              mode="date"
              display="default"
              onChange={(_, d) => {
                setShowFim(Platform.OS === 'ios');
                if (d) setDataFim(d);
              }}
            />
          )}

          <Pressable onPress={pickImage} style={styles.imagePicker}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>Selecionar Imagem</Text>
              </View>
            )}
          </Pressable>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleSalvar}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text
                  style={styles.textoBotao}
                >
                  Salvar
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => setModalVisible(true)}
              disabled={loading}
            >
              <Text style={styles.textoBotao}>Deletar</Text>
            </TouchableOpacity>
          </View>

          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>
                  Tem certeza que deseja deletar este evento?
                </Text>
                <View style={styles.modalButtons}>
                  <Pressable
                    style={styles.modalCancelButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.textoBotao}>Cancelar</Text>
                  </Pressable>
                  <Pressable
                    style={styles.modalConfirmButton}
                    onPress={() => {
                      handleDelete();
                      navigation.navigate('EventosAdm', { userId, abrigoId });
                    }}
                  >
                    <Text style={styles.textoBotao}>Confirmar</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 40,
        paddingHorizontal: 16,
        backgroundColor: 'white',
        paddingBottom: 10,
    },
    backButton: {
        padding: 5,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginLeft: 15,
    },
    divCadastro: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 25,
        paddingBottom: 25,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 15, 
    },
    label: {
        fontWeight: 'bold',
        fontSize: 16,
        marginRight: 5,
        width: '25%', 
    },
    input: {
        flex: 1, 
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 25, 
        paddingVertical: 8,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        fontSize: 16,
        elevation: 7, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    imagePicker: {
        alignItems: 'center',
        marginTop: 10,
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 10,
    },
    imagePlaceholder: {
        width: 150,
        height: 150,
        borderRadius: 10,
        backgroundColor: '#eee',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ddd'
    },
    imagePlaceholderText: {
        color: '#888',
        textAlign: 'center',
    },
    textoBotao: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 40,
    },
    updateButton: {
        backgroundColor: '#8A2BE2',
        borderRadius: 8, 
        paddingVertical: 12,
        paddingHorizontal: 30,
        flex: 1,
        marginHorizontal: 5,
        elevation: 2,
    },
    deleteButton: {
        backgroundColor: '#B22222',
        borderRadius: 8, 
        paddingVertical: 12,
        paddingHorizontal: 30,
        flex: 1,
        marginHorizontal: 5,
        elevation: 2,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
        elevation: 5,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalCancelButton: {
        backgroundColor: '#888',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25, 
        marginHorizontal: 10,
    },
    modalConfirmButton: {
        backgroundColor: '#B22222',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25, 
        marginHorizontal: 10,
    },
});