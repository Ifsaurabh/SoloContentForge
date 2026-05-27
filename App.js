/* eslint-disable */
import { registerRootComponent } from 'expo';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';
import { AppProvider } from './context/AppContext';
import DashboardScreen from './screens/DashboardScreen';
import LibraryScreen from './screens/LibraryScreen';
import NewVideoScreen from './screens/NewVideoScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();

function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: '#080810',
              borderTopColor: '#222233',
              height: 62,
              paddingBottom: 8,
              paddingTop: 4,
            },
            tabBarActiveTintColor: '#F5C518',
            tabBarInactiveTintColor: '#444466',
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: '600',
            },
          }}
        >
          <Tab.Screen
            name="Home"
            component={DashboardScreen}
            options={{
              tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🏠</Text>,
              tabBarLabel: 'Home',
            }}
          />
          <Tab.Screen
            name="New"
            component={NewVideoScreen}
            options={{
              tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>➕</Text>,
              tabBarLabel: 'New Video',
            }}
          />
          <Tab.Screen
            name="Library"
            component={LibraryScreen}
            options={{
              tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>📚</Text>,
              tabBarLabel: 'Library',
            }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>⚙️</Text>,
              tabBarLabel: 'Settings',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}

registerRootComponent(App);