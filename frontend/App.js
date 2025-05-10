import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { AbrigoProvider } from './AppContext';
import LoginScreen from './screens/login/LoginScreen';
import HomeAdm from './screens/adm/HomeAdm';
import AnimaisAdm from "./screens/adm/AnimaisAdm";
import InfoAdm from "./screens/adm/InfoAdm";
import Voluntariarse from "./screens/adm/Voluntariarse";
import Candidatos from "./screens/adm/Candidatos";
import VoluntariosAdm from "./screens/adm/VoluntariosAdm";
import TelaPrincipal from "./screens/login/TelaPrincipal";
import PerfilCandidato from "./screens/adm/PerfilCandidato";
import IconVoluntariar from './img/candidatos.png';
import PerfilAnimal from "./screens/adm/PerfilAnimais";
import PerfilCuidador from "./screens/adm/PerfilCuidador";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route, navigation }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: '#8A2BE2',
        },
        headerTintColor: 'white',
        headerTitleAlign: 'center', // Opcional: centralizar o título
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: 'white', marginLeft: 15 }}>Voltar</Text>
          </TouchableOpacity>
        ),
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused
              ? require('./img/Home_Active.png')
              : require('./img/Home_Inactive.png');
          } else if (route.name === 'Animais') {
            iconName = focused
              ? require('./img/Animais_Active.png')
              : require('./img/Animais_Inactive.png');
          } else if (route.name === 'Informações') {
            iconName = focused
              ? require('./img/Profile_Active.png')
              : require('./img/Profile_Inactive.png');
          }

          return <Image source={iconName} style={{ width: size, height: size, tintColor: color }} />;
        },
        tabBarActiveTintColor: '#8A2BE2',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#E7E3E3', height: 100, paddingBottom: 5, paddingTop: 5 },
        tabBarLabelStyle: { fontSize: 12 },
      })}
    >

      <Tab.Screen
        name="Animais"
        component={AnimaisAdm}
        options={{
          title: 'Animais',
          tabBarShowLabel: false,
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeAdm}
        options={{
          title: 'Abrigo',
          tabBarShowLabel: false,
        }}
      />
      <Tab.Screen
        name="Informações"
        component={InfoAdm}
        options={{
          title: 'Informações',
          tabBarShowLabel: false,
        }}
      />

    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AbrigoProvider>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
      
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="User" component={TelaPrincipal} />
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{
            headerShown: false
          }} />
        <Stack.Screen
          name="VoluntariosAdm" component={VoluntariosAdm}
          options={({ navigation }) => ({
            headerShown: true,
            title: 'Voluntarios',
            headerStyle: {
              backgroundColor: '#8A2BE2',
            },
            headerTintColor: 'white',
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('Candidatos')}>
                <Image
                  source={IconVoluntariar}
                  style={styles.headerIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Candidatos" component={Candidatos}
          options={{
            headerShown: true, title: 'Candidatos', headerShown: true,
            title: 'Candidatos',
            headerStyle: {
              backgroundColor: '#8A2BE2',
            },
            headerTintColor: 'white',
          }}

        />
        <Stack.Screen
          name="Voluntariarse"
          component={Voluntariarse}
          options={{
            headerShown: true, title: 'Candidatos', headerShown: true,
            title: 'Voluntariar-se',
            headerStyle: {
              backgroundColor: '#8A2BE2',
            },
            headerTintColor: 'white',
          }} />
        <Stack.Screen name="PerfilCandidato" component={PerfilCandidato} />
        <Stack.Screen name="PerfilCuidador" component={PerfilCuidador} />
        <Stack.Screen name="PerfilAnimal" component={PerfilAnimal} />
      </Stack.Navigator>
    </NavigationContainer>
    </AbrigoProvider>
  );
}

const styles = StyleSheet.create({
  headerIcon: {
    width: 24,
    height: 24,
    marginHorizontal: 15,
    tintColor: 'white',
  },
});