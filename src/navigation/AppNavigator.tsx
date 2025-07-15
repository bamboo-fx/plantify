import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import PlantResultScreen from '../screens/PlantResultScreen';
import ManualEntryScreen from '../screens/ManualEntryScreen';
import ManualPlantResultScreen from '../screens/ManualPlantResultScreen';

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
    </Stack.Navigator>
  );
}