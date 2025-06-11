import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { urlIp } from '@env';

export default function RegistroAbandono() {
  const navigation = useNavigation();
  const { userId } = useRoute().params;
  console.log('abandono - userId from route.params:', userId);

  const [descricao, onChangeDescricao] = useState('');
  const [endereco, onChangeEndereco] = useState({
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
  });

  const [imageUri, onChangeImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleEnderecoChange = (campo, valor) => {
    onChangeEndereco(prev => ({ ...prev, [campo]: valor }));
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
      onChangeImageUri(result.assets[0].uri);
    }
  };

  const getImageMimeType = uri => {
    if (uri.endsWith('.png')) return 'image/png';
    if (uri.match(/\.(jpe?g)$/)) return 'image/jpeg';
    return 'image/jpeg';
  };

  const handleImageUpload = async (abandonoId) => {
    try {
      const form = new FormData();
      const mime = getImageMimeType(imageUri);
      const ext = mime.split('/')[1];
      form.append('image', {
        uri: imageUri,
        name: `abandono.${ext}`,
        type: mime,
      });

      const res = await fetch(`http://${urlIp}:3000/abandonos/${abandonoId}/imagem`, {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: form,
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
    } catch (err) {
      console.error('Erro ao enviar imagem:', err);

    }
  };

  const handleRegister = async () => {
  
    if (!descricao.trim() ||
        !endereco.rua.trim() ||
        !endereco.numero.trim() ||
        !endereco.bairro.trim() ||
        !endereco.cidade.trim() ||
        !endereco.estado.trim() ||
        !endereco.cep.trim()
    ) {
      Alert.alert('Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {

      const bodyData = {
        userId: userId,     
        descricao: descricao.trim(),
        local: {
          rua: endereco.rua.trim(),
          numero: endereco.numero.trim(),
          bairro: endereco.bairro.trim(),
          cidade: endereco.cidade.trim(),
          estado: endereco.estado.trim(),
          cep: endereco.cep.trim(),
        },
        animalResgatado: false,     
        ativo: true,                                 
      };

   
      const response = await fetch(`http://${urlIp}:3000/abandonos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });
      if (!response.ok) {
        throw new Error(`Status ${response.status}`);
      }

      const novoAbandono = await response.json(); 

  
      if (imageUri && novoAbandono.id) {
        await handleImageUpload(novoAbandono.id);
      }

      Alert.alert('Sucesso', 'Abandono registrado!');
      navigation.navigate('InicialUser', { userId });
    } catch (err) {
      console.error('Erro ao registrar abandono:', err);
      Alert.alert('Erro', 'Não foi possível salvar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.container}>
      
        <Text style={styles.label}>Descrição do animal</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          value={descricao}
          onChangeText={onChangeDescricao}
        />

        <Text style={styles.label}>Endereço onde encontrou</Text>
        {['rua','numero','bairro','cidade','estado','cep'].map(campo => (
          <TextInput
            key={campo}
            placeholder={campo.charAt(0).toUpperCase() + campo.slice(1)}
            style={styles.input}
            value={endereco[campo]}
            onChangeText={val => handleEnderecoChange(campo, val)}
            keyboardType={campo==='numero'||campo==='cep'?'number-pad':'default'}
          />
        ))}

        <Text style={styles.label}>Foto do animal (opcional)</Text>
        <TouchableOpacity onPress={pickImage}>
          {imageUri
            ? <Image source={{ uri: imageUri }} style={styles.photo} />
            : <View style={styles.photoPlaceholder}><Text style={styles.plus}>+</Text></View>
          }
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.buttonText}>Registrar</Text>
          }
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingVertical: 20, paddingHorizontal: 16 },
  container: { backgroundColor: '#f1f1f1', borderRadius: 10, padding: 16 },
  label: { fontWeight: 'bold', marginTop: 12, marginBottom: 6, color: '#333' },
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 8,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 8,
    alignSelf: 'center',
    marginVertical: 12,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 12,
  },
  plus: { fontSize: 36, color: '#888' },
  button: {
    backgroundColor: '#9333ea',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
