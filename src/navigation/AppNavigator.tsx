import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import TabNavigator from './TabNavigator';
import PlantResultScreen from '../screens/PlantResultScreen';
import ManualEntryScreen from '../screens/ManualEntryScreen';
import ManualPlantResultScreen from '../screens/ManualPlantResultScreen';
import WateringRemindersScreen from '../screens/WateringRemindersScreen';
import LightTrackerScreen from '../screens/LightTrackerScreen';
import DiseaseGuideScreen from '../screens/DiseaseGuideScreen';
import ToxicPlantsScreen from '../screens/ToxicPlantsScreen';
import HelpScreen from '../screens/HelpScreen';
import AboutScreen from '../screens/AboutScreen';
import ComingSoonScreen from '../screens/ComingSoonScreen';

export type RootStackParamList = {
  Main: undefined;
  PlantResult: {
    imageUri: string;
    identificationData?: any;
  };
  ManualEntry: undefined;
  ManualPlantResult: {
    plantName: string;
    analysisResult: any;
    identification: any;
  };
  WateringReminders: undefined;
  LightTracker: undefined;
  DiseaseGuide: undefined;
  ToxicPlants: undefined;
  Help: undefined;
  About: undefined;
  ComingSoon: {
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen 
        name="PlantResult" 
        component={PlantResultScreen}
        options={{
          headerShown: false,
          presentation: 'card',
        }}
      />
      <Stack.Screen 
        name="ManualEntry" 
        component={ManualEntryScreen}
        options={{
          headerShown: false,
          presentation: 'card',
        }}
      />
      <Stack.Screen 
        name="ManualPlantResult" 
        component={ManualPlantResultScreen}
        options={{
          headerShown: false,
          presentation: 'card',
        }}
      />
      <Stack.Screen name="WateringReminders" component={WateringRemindersScreen} options={{ headerShown: false }} />
      <Stack.Screen name="LightTracker" component={LightTrackerScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DiseaseGuide" component={DiseaseGuideScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ToxicPlants" component={ToxicPlantsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Help" component={HelpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="About" component={AboutScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ComingSoon" component={ComingSoonScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}