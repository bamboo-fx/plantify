import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

import ScanScreen from '../screens/ScanScreen';
import CollectionScreen from '../screens/CollectionScreen';
import ExpertChatScreen from '../screens/ExpertChatScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Scan':
              iconName = focused ? 'camera' : 'camera-outline';
              break;
            case 'Collection':
              iconName = focused ? 'leaf' : 'leaf-outline';
              break;
            case 'Expert':
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#22c55e',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
        tabBarStyle: {
          backgroundColor: 'rgba(74, 85, 104, 0.95)',
          borderTopWidth: 1,
          borderTopColor: 'rgba(34, 197, 94, 0.3)',
          paddingBottom: insets.bottom,
          height: 60 + insets.bottom,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarBackground: () => (
          <BlurView 
            intensity={20} 
            style={{
              flex: 1,
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
            }}
          />
        ),
        headerStyle: {
          backgroundColor: 'transparent',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        headerBackground: () => (
          <LinearGradient
            colors={['#059669', '#10b981', '#22c55e']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
          >
            <BlurView 
              intensity={30} 
              style={{
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
              }}
            />
          </LinearGradient>
        ),
      })}
    >
      <Tab.Screen 
        name="Scan" 
        component={ScanScreen}
        options={{
          title: 'Plant Scanner',
          headerTitle: 'Identify Plants',
        }}
      />
      <Tab.Screen 
        name="Collection" 
        component={CollectionScreen}
        options={{
          title: 'My Plants',
          headerTitle: 'Plant Collection',
        }}
      />
      <Tab.Screen 
        name="Expert" 
        component={ExpertChatScreen}
        options={{
          title: 'Expert Chat',
          headerTitle: 'Plant Expert',
        }}
      />
    </Tab.Navigator>
  );
}