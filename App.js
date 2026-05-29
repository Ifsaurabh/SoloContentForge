/* eslint-disable */
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, PlusCircle, BookOpen, Settings } from 'lucide-react-native';
import { AppProvider, useApp } from './context/AppContext';
import DashboardScreen from './screens/DashboardScreen';
import NewVideoScreen from './screens/NewVideoScreen';
import LibraryScreen from './screens/LibraryScreen';
import SettingsScreen from './screens/SettingsScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  const { C } = useApp();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: C.surface,
            borderTopColor: C.border,
            borderTopWidth: 1,
            paddingBottom: 8,
            paddingTop: 8,
            height: 60,
          },
          tabBarActiveTintColor: C.accent,
          tabBarInactiveTintColor: C.text3,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            letterSpacing: 0.3,
          },
          tabBarIcon: ({ color }) => {
            if (route.name === 'Home') return <Home color={color} size={22} strokeWidth={1.8} />;
            if (route.name === 'New') return <PlusCircle color={color} size={22} strokeWidth={1.8} />;
            if (route.name === 'Library') return <BookOpen color={color} size={22} strokeWidth={1.8} />;
            if (route.name === 'Settings') return <Settings color={color} size={22} strokeWidth={1.8} />;
          },
        })}>
        <Tab.Screen name="Home" component={DashboardScreen} options={{ tabBarLabel: 'Home' }} />
        <Tab.Screen name="New" component={NewVideoScreen} options={{ tabBarLabel: 'Create' }} />
        <Tab.Screen name="Library" component={LibraryScreen} options={{ tabBarLabel: 'Library' }} />
        <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: 'Settings' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <TabNavigator />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
