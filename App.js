import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';
import { AppProvider } from './context/AppContext';
import DashboardScreen from './screens/DashboardScreen';
import LibraryScreen from './screens/LibraryScreen';
import NewVideoScreen from './screens/NewVideoScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: '#13131a',
              borderTopColor: '#2a2a3a',
              height: 60,
              paddingBottom: 8,
            },
            tabBarActiveTintColor: '#f0c040',
            tabBarInactiveTintColor: '#8888aa',
          }}
        >
          <Tab.Screen
            name="Home"
            component={DashboardScreen}
            options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>🏠</Text> }}
          />
          <Tab.Screen
            name="New"
            component={NewVideoScreen}
            options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>➕</Text> }}
          />
          <Tab.Screen
            name="Library"
            component={LibraryScreen}
            options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>📚</Text> }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>⚙️</Text> }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}