import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ScrollView, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import TextInputExample from './text';
import BottomMenu from './menu';
import SearchInput from './botaodepesquisar';

function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.imgChat} edges={['top']}>
        <Image
          style={styles.imgChat}
            source={require('./img/Chat.png')}
          />
      </View>
      <View style={styles.divPesquisa} >
        <Image
          style={styles.imgPesquisa}
          source={require('./img/Filtro.png')}
        />
        <SearchInput />
        <Image
          style={styles.imgPesquisa}
          source={require('./img/Lupa.png')}
        />
      </View>
      <View style={styles.divAnimais}>
        <Text style={styles.textoAnimais}>Animais próximo a você:</Text>
        <View style={styles.imagensContainer}>
          <Image
            style={styles.imgAnimais}
            source={require('./img/Gato.png')}
          />
          <Image
            style={styles.imgAnimais}
            source={require('./img/Cachorro.png')}
          />
        </View>
        <Text style={styles.viewMore}>View more...</Text>
      </View>
      <View style={styles.divAnimais}>
        <Text style={styles.textoAnimais}>Abrigos próximo a você:</Text>
        <View style={styles.imagensContainer}>
          <Image
            style={styles.imgAnimais}
            source={require('./img/PET.png')}
          />
          <Image
            style={styles.imgAnimais}
            source={require('./img/PET.png')}
          />
        </View>
        <Text style={styles.viewMore}>View more...</Text>
      </View>
      <BottomMenu />
    </View>
  );
}

function LoginScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.divCadastro} edges={['top']}>
      <Image
        style={styles.logo}
        source={require('./img/PET.png')}
      />
      <TextInputExample />
      <Pressable
        style={styles.botao}
        onPress={() => navigation.navigate('Home')} 
      >
        <Text style={styles.textoBotao}>Login</Text>
      </Pressable>
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="a" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E7E3E3',
    maxHeight: 900,
  },
  imgChat: {
    width: 60,
    height: 60,
    paddingEnd: 20,
    alignSelf: 'flex-end',
    borderRadius: 0,
    marginTop: -20,

  },
  divPesquisa: {
    flex: 1,
    marginBottom: 40,
    justifyContent: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    width: 300,
    padding: 20,
    borderRadius: 15,
    maxHeight: 80,
  },
  imgPesquisa: {
    width: 40,
    height: 40,
  },
  divAnimais: {
    backgroundColor: 'white',
    width: 300,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    
    margin: 20,
  },
  imagensContainer: {
    flexDirection: 'row', 
    margin: 15,
  },
  imgAnimais: {
    width: 100,
    height: 100,
  },
  textoAnimais: {
    fontSize: 20,
    alignSelf: 'flex-start', 
  },
  viewMore: {
    alignSelf: 'flex-end',
  },
  divCadastro: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',

  },
  logo: {
    marginTop: 100,
    width: 150,
    height: 150,
    marginBottom: 40,
  },
  botao: {
    backgroundColor: '#8A2BE2',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 80,
    elevation: 3,
    marginTop: 50,
  },
  textoBotao: {
    color: 'white',
    fontSize: 16,
  },
});