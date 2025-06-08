import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from '../store/authStore';

// Importar las pantallas (las crearemos después)
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import CameraScreen from '../screens/CameraScreen';
import SendSnapScreen from '../screens/SendSnapScreen';
import ViewSnapScreen from '../screens/ViewSnapScreen';
import StoriesViewerScreen from '../screens/StoriesViewerScreen';

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          // Usuario conectado → Pantalla principal
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Camera" component={CameraScreen} />
            <Stack.Screen name="SendSnap" component={SendSnapScreen} />
            <Stack.Screen name="ViewSnap" component={ViewSnapScreen} />
            <Stack.Screen name="StoriesViewer" component={StoriesViewerScreen} />
          </>
        ) : (
          // Usuario no conectado → Pantalla de login
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;