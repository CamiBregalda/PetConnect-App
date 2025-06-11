import React, { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import TelaInicial from '../../screens/login/TelaInicial';
import LoginScreen from '../../screens/login/LoginScreen';
import CadastroUser from '../../screens/cadastros/CadastroUser';
import AtualizarUser from '../../screens/cadastros/AtualizarUser';
import CadastroAbrigo from '../../screens/cadastros/CadastroAbrigo';
import AtualizarAbrigo from '../../screens/cadastros/AtualizarAbrigo';
import CadastroAnimal from '../../screens/cadastros/CadastroAnimal';
import AtualizarAnimal from '../../screens/cadastros/AtualizarAnimal';
import HomeAdm from '../../screens/adm/HomeAdm';
import AnimaisAdm from "../../screens/adm/AnimaisAdm";
import InfoAdm from "../../screens/adm/InfoAdm";
import Voluntariarse from "../../screens/voluntarios/Voluntariarse";
import Candidatos from "../../screens/voluntarios/Candidatos";
import VoluntariosAdm from "../../screens/voluntarios/VoluntariosAdm";
import TelaPrincipal from "../../screens/login/TelaPrincipal";
import PerfilCandidato from "../../screens/perfils/PerfilCandidato";
import IconVoluntariar from '../../img/candidatos.png';
import PerfilAnimal from "../../screens/perfils/PerfilAnimais";
import PerfilCuidador from "../../screens/perfils/PerfilCuidador";
import InicialUser from "../../screens/user/InicialUser";
import AnimaisUser from "../../screens/user/AnimaisUser";
import RegistroAbandono from "../../screens/user/RegistroAbandono";
import ListaEventos from '../../screens/eventos/ListaEventos';
import EventoDetalhe from '../../screens/eventos/EventoDetalhe';
import EventosAdm from '../../screens/eventos/EventosAdm';
import EventoDetalheAdm from '../../screens/eventos/EventoDetalheAdm';
import VoluntariosEvento from '../../screens/eventos/VoluntariosEvento';
import EditarEvento from '../../screens/eventos/EditarEvento';
import CriarEvento from '../../screens/eventos/CriarEvento';
import UsuarioInfo from '../../screens/user/InicialUser';
import ChamadoAbandono from '../../screens/adm/ChamadoAbandono';
import AdocaoAnimal from '../../screens/cadastros/AdocaoAnimal';
import Ionicons from 'react-native-vector-icons/Ionicons';



const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


function MainTabs({ route }) {
  const userId = route?.params?.userId;
  const abrigoId = route?.params?.abrigoId;
  console.log('MainTabs userId:', userId, 'abrigoId:', abrigoId);
  

  return (
    <Tab.Navigator
      initialRouteName="HomeAdm"
      screenOptions={({ route, navigation: tabNavigationProp }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: '#8A2BE2',
        },
        headerTintColor: 'white',
        headerTitleAlign: 'center',
        headerLeft: () => (
          <TouchableOpacity onPress={() => {
            tabNavigationProp.reset({
              index: 0,
              routes: [{ name: 'TelaPrincipal', params: { userId } }],
            });
          }}>
            <Image
              source={require('../../img/seta.png')}
              style={styles.homeIcon}
            />
          </TouchableOpacity>
        ),
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'HomeAdm') {
            iconName = focused
              ? require('../../img/Home_Active.png')
              : require('../../img/Home_Inactive.png');
          } else if (route.name === 'AnimaisAdm') {
            iconName = focused
              ? require('../../img/Animais_Active.png')
              : require('../../img/Animais_Inactive.png');
          } else if (route.name === 'InfoAdm') {
            iconName = focused
              ? require('../../img/Profile_Active.png')
              : require('../../img/Profile_Inactive.png');
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
        name="HomeAdm"
        component={HomeAdm}
        initialParams={{ userId, abrigoId }}
        options={{
          title: 'Inicio',
          tabBarShowLabel: false,
        }}
      />
      <Tab.Screen
        name="AnimaisAdm"
        component={AnimaisAdm}
        initialParams={{ userId, abrigoId }}
        options={{
          title: 'Animais',
          tabBarShowLabel: false,
        }}
      />
      <Tab.Screen
        name="InfoAdm"
        component={InfoAdm}
        initialParams={{ userId, abrigoId }}
        options={{
          title: 'Informações',
          tabBarShowLabel: false,
        }}
      />
    </Tab.Navigator>
  );
}

function UserTabs({ route }) {
  const userId = route?.params?.userId;
  const abrigoId = route?.params?.abrigoId;
  console.log('MainTabs userId:', userId, 'abrigoId:', abrigoId);
  

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route, navigation: tabNavigationProp }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: '#8A2BE2',
        },
        headerTintColor: 'white',
        headerTitleAlign: 'center',
        headerLeft: () => (
          <TouchableOpacity onPress={() => {
            tabNavigationProp.reset({
              index: 0,
              routes: [{ name: 'TelaPrincipal', params: { userId } }],
            });
          }}>
            <Image
              source={require('../../img/seta.png')}
              style={styles.homeIcon}
            />
          </TouchableOpacity>
        ),
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused
              ? require('../../img/Home_Active.png')
              : require('../../img/Home_Inactive.png');
          } else if (route.name === 'AnimaisUser') {
            iconName = focused
              ? require('../../img/Animais_Active.png')
              : require('../../img/Animais_Inactive.png');
          } else if (route.name === 'RegistroAbandono') {
            iconName = focused
              ? require('../../img/Profile_Active.png')
              : require('../../img/Profile_Inactive.png');
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
        name="Home"
        component={InicialUser}
        initialParams={{ userId, abrigoId }}
        options={{
          title: 'Inicio',
          tabBarShowLabel: false,
        }}
      />
      <Tab.Screen
        name="AnimaisUser"
        component={AnimaisUser}
        initialParams={{ userId, abrigoId }}
        options={{
          title: 'Animais',
          tabBarShowLabel: false,
        }}
      />
      <Tab.Screen
        name="RegistroAbandono"
        component={RegistroAbandono}
        initialParams={{ userId, abrigoId }}
        options={{
          title: 'Informações',
          tabBarShowLabel: false,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="TelaInicial" component={TelaInicial} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="CadastroUser" component={CadastroUser} />
        <Stack.Screen name="AtualizarUser" component={AtualizarUser} />
        <Stack.Screen name="CadastroAbrigo" component={CadastroAbrigo} />
        <Stack.Screen name="AtualizarAbrigo" component={AtualizarAbrigo} />
        <Stack.Screen name="CadastroAnimal" component={CadastroAnimal} />
        <Stack.Screen name="AtualizarAnimal" component={AtualizarAnimal} />
        <Stack.Screen name="TelaPrincipal" component={TelaPrincipal} />
        <Stack.Screen name="RegistroAbandono" component={RegistroAbandono} />
        <Stack.Screen name="AnimaisUser" component={AnimaisUser} />
        <Stack.Screen name="ListaEventos" component={ListaEventos} />
        <Stack.Screen name="InfoAdm" component={InfoAdm} />
        <Stack.Screen name="VoluntariosEvento" component={VoluntariosEvento} />
        <Stack.Screen name="EditarEvento" component={EditarEvento} />
        <Stack.Screen name="CriarEvento" component={CriarEvento} />
        <Stack.Screen name="ChamadoAbandono" component={ChamadoAbandono} />
        <Stack.Screen name="AdocaoAnimal" component={AdocaoAnimal} />

        <Stack.Screen name="InicialUser"
          component={UserTabs}
          options={{
            headerShown: false
          }} />

        <Stack.Screen
          name="EventosAdm"
          component={EventosAdm}
          options={{ headerShown: true }}
        />

        <Stack.Screen
          name="EventoDetalheAdm"
          component={EventoDetalheAdm}
          options={{ headerShown: true }}
        />

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
          name="EventoDetalhe" component={EventoDetalhe}
          options={({ navigation }) => ({
            headerShown: true,
            title: 'Detalhes do Evento',
            headerStyle: {
              backgroundColor: '#8A2BE2',
            },
            headerTintColor: 'white',
          })}
        />

        <Stack.Screen
          name="Candidatos" component={Candidatos}
          options={{
            headerShown: true,
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
            headerShown: true,
            title: 'Candidatar-se como voluntário',
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
  );
}

const styles = StyleSheet.create({
  homeIcon: {
    width: 24,
    height: 24,
    marginHorizontal: 15,
    tintColor: 'white',
  },
  headerIcon: {
    width: 24,
    height: 24,
    marginHorizontal: 15,
    tintColor: 'white',
  },
});