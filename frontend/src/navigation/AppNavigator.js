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


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


function MainTabs({ navigation, route }) {
  const routeParams = route.params || {};
  const actualParams = routeParams.params || {};
  const userIdFromMainRoute = actualParams.userId;
  const abrigoIdFromMainRoute = actualParams.abrigoId;

  console.log('MainTabs - Montado/Renderizado com userIdFromMainRoute:', userIdFromMainRoute, 'e abrigoIdFromMainRoute:', abrigoIdFromMainRoute);

  useEffect(() => {
    const backAction = () => {
      const parentState = navigation.getState();
      let currentTab = null;
      const mainTabsRouteObject = parentState.routes[parentState.index];

      if (mainTabsRouteObject && mainTabsRouteObject.state && mainTabsRouteObject.state.routeNames) {
        const tabState = mainTabsRouteObject.state;
        const tabIndex = tabState.index ?? 0;
        currentTab = tabState.routeNames[tabIndex];
      } else if (mainTabsRouteObject && mainTabsRouteObject.params && mainTabsRouteObject.params.screen) {
        currentTab = mainTabsRouteObject.params.screen;
      } else if (mainTabsRouteObject && mainTabsRouteObject.name === 'Home') {
        currentTab = mainTabsRouteObject.name;
      }

      if (currentTab === 'Home' || currentTab === 'Animais' || currentTab === 'Informações') {
        if (userIdFromMainRoute) { // Verifica se userIdFromMainRoute existe
          navigation.reset({
            index: 0,
            routes: [{ name: 'TelaPrincipal', params: { userId: userIdFromMainRoute } }], // Passa o userId
          });
        } else {
          navigation.reset({ index: 0, routes: [{ name: 'TelaPrincipal' }] });
        }
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigation, userIdFromMainRoute]);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route: tabRoute, navigation: tabNavigationProp }) => {
        return {
          headerShown: true,
          headerStyle: { backgroundColor: '#8A2BE2' },
          headerTintColor: 'white',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'TelaPrincipal', params: { userId: userIdFromMainRoute } }], // Passa o userId
              });
            }}>
              <Image source={require('../../img/seta.png')} style={styles.homeIcon} />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (tabRoute.name === 'Home') {
              iconName = focused ? require('../../img/Home_Active.png') : require('../../img/Home_Inactive.png');
            } else if (tabRoute.name === 'Animais') {
              iconName = focused ? require('../../img/Animais_Active.png') : require('../../img/Animais_Inactive.png');
            } else if (tabRoute.name === 'Informações') {
              iconName = focused ? require('../../img/Profile_Active.png') : require('../../img/Profile_Inactive.png');
            }
            return <Image source={iconName} style={{ width: size, height: size, tintColor: color }} />;
          },
          tabBarActiveTintColor: '#8A2BE2',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: { backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#E7E3E3', height: 100, paddingBottom: 5, paddingTop: 5 },
          tabBarLabelStyle: { fontSize: 12 },
        };
      }}
    >
      <Tab.Screen
        name="Animais"
        component={AnimaisAdm}
        initialParams={{ userId: userIdFromMainRoute }}
        options={{ title: 'Animais', tabBarShowLabel: false }}
      />
      <Tab.Screen
        name="Home"
        component={HomeAdm}
        initialParams={{ userId: userIdFromMainRoute, abrigoId: abrigoIdFromMainRoute }}
        options={{ title: 'Abrigo', tabBarShowLabel: false }}
      />
      <Tab.Screen
        name="Informações"
        component={InfoAdm}
        initialParams={{ userId: userIdFromMainRoute }}
        options={{ title: 'Informações', tabBarShowLabel: false }}
      />
    </Tab.Navigator>
  );
}

function UserTabs({ navigation, route }) {
  const { userId } = route.params;

  useEffect(() => {
    const backAction = () => {
      const parentState = navigation.getState();
      let currentTab = null;
      const mainTabsRouteObject = parentState.routes[parentState.index];

      if (mainTabsRouteObject && mainTabsRouteObject.state && mainTabsRouteObject.state.routeNames) {
        const tabState = mainTabsRouteObject.state;
        const tabIndex = tabState.index ?? 0;
        currentTab = tabState.routeNames[tabIndex];
      } else if (mainTabsRouteObject && mainTabsRouteObject.params && mainTabsRouteObject.params.screen) {
        currentTab = mainTabsRouteObject.params.screen;
      } else if (mainTabsRouteObject && mainTabsRouteObject.name === 'Home') {
        currentTab = mainTabsRouteObject.name;
      }

      if (
        currentTab === 'Home' ||
        currentTab === 'Animais' ||
        currentTab === 'Informações'
      ) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'InicialUser', params: { userId } }],
        });
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [navigation, userId]);

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
            navigation.reset({
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
          } else if (route.name === 'Animais') {
            iconName = focused
              ? require('../../img/Animais_Active.png')
              : require('../../img/Animais_Inactive.png');
          } else if (route.name === 'Informações') {
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
        name="Animais"
        component={AnimaisUser}
        initialParams={{ userId }}
        options={{
          title: 'Animais',
          tabBarShowLabel: false,
        }}
      />
      <Tab.Screen
        name="Home"
        component={InicialUser}
        initialParams={{ userId }}
        options={{
          title: 'Usuario',
          tabBarShowLabel: false,
        }}
      />
      <Tab.Screen
        name="Informações"
        component={RegistroAbandono}
        initialParams={{ userId }}
        options={{
          title: 'Registrar Abandono',
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
        <Stack.Screen name="EventoDetalhe" component={EventoDetalhe} />
        <Stack.Screen name="InfoAdm" component={InfoAdm} />
        <Stack.Screen name="VoluntariosEvento" component={VoluntariosEvento} />
        <Stack.Screen name="EditarEvento" component={EditarEvento} />
        <Stack.Screen name="CriarEvento" component={CriarEvento} />
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