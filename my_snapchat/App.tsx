import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Contexts
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";

// Screens
import CustomSplashScreen from "./src/screens/SplashScreen";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import HomeScreen from "./src/screens/Home";
import FriendsSelectionScreen from "./src/screens/FriendsSelectionScreen";
import EditProfileScreen from "./src/screens/EditProfileScreen";
import ProfileScreen from "./src/screens/ProfileScreen";

export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
  CameraPage: undefined;
  EditProfileScreen: undefined;
  ProfileScreen: undefined;
  FriendsSelection: { photoUri: string; cameraType: "back" | "front" };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { isAuthenticated, isInitialized } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<
    "welcome" | "login" | "signup"
  >("welcome");

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleForgotPassword = () => {
    console.log("Mot de passe oublié - fonctionnalité à implémenter");
  };

  if (showSplash || !isInitialized) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash">
          {() => <CustomSplashScreen onFinish={handleSplashFinish} />}
        </Stack.Screen>
      </Stack.Navigator>
    );
  }

  if (isAuthenticated) {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        
        <Stack.Screen
          name="FriendsSelection"
          component={FriendsSelectionScreen}
          options={{
            gestureDirection: "vertical",
            cardStyleInterpolator: ({ current, layouts }) => {
              return {
                cardStyle: {
                  transform: [
                    {
                      translateY: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.height, 0],
                      }),
                    },
                  ],
                },
              };
            },
          }}
        />
        
        <Stack.Screen
          name="EditProfileScreen"
          component={EditProfileScreen}
          options={{
            gestureDirection: "horizontal",
            cardStyleInterpolator: ({ current, layouts }) => {
              return {
                cardStyle: {
                  transform: [
                    {
                      translateX: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.width, 0],
                      }),
                    },
                  ],
                },
              };
            },
          }}
        />
        
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{ gestureDirection: "horizontal" }}
        />
        
        <Stack.Screen
          name="CameraPage"
          component={HomeScreen}
          options={{
            gestureDirection: "vertical",
            cardStyleInterpolator: ({ current, layouts }) => {
              return {
                cardStyle: {
                  transform: [
                    {
                      translateY: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.height, 0],
                      }),
                    },
                  ],
                },
              };
            },
          }}
        />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome">
        {() => {
          switch (currentScreen) {
            case "login":
              return (
                <LoginScreen
                  onBack={() => setCurrentScreen("welcome")}
                  onLogin={async (email, password) => {}}
                  onForgotPassword={handleForgotPassword}
                />
              );
            case "signup":
              return (
                <SignUpScreen
                  onBack={() => setCurrentScreen("welcome")}
                  onSignUp={async (email, password, username) => {}}
                />
              );
            default:
              return (
                <WelcomeScreen
                  onLogin={() => setCurrentScreen("login")}
                  onSignUp={() => setCurrentScreen("signup")}
                />
              );
          }
        }}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;