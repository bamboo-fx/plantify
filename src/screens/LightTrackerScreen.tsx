import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface LightTrackerScreenProps {
  navigation: any;
}

const lightLevels = [
  {
    name: 'Direct Sun',
    icon: 'sunny',
    color: '#f59e0b',
    description: '6+ hours of direct sunlight',
    footCandles: '10,000+',
    examples: ['South-facing windows', 'Outdoor gardens', 'Sunrooms'],
    plants: ['Succulents', 'Cacti', 'Tomatoes', 'Peppers', 'Herbs']
  },
  {
    name: 'Bright Light',
    icon: 'partly-sunny',
    color: '#eab308',
    description: '4-6 hours of bright, indirect light',
    footCandles: '1,000-2,500',
    examples: ['East/West windows', '3-5 feet from south window'],
    plants: ['Fiddle Leaf Fig', 'Rubber Plant', 'Monstera', 'Bird of Paradise']
  },
  {
    name: 'Medium Light',
    icon: 'cloudy',
    color: '#84cc16',
    description: '2-4 hours of indirect light',
    footCandles: '250-1,000',
    examples: ['North windows', '5-8 feet from bright window'],
    plants: ['Pothos', 'Philodendron', 'Peace Lily', 'Chinese Evergreen']
  },
  {
    name: 'Low Light',
    icon: 'moon',
    color: '#6b7280',
    description: 'Less than 2 hours of indirect light',
    footCandles: '25-250',
    examples: ['Interior rooms', 'Offices with fluorescent light'],
    plants: ['Snake Plant', 'ZZ Plant', 'Cast Iron Plant', 'Chinese Evergreen']
  }
];

export default function LightTrackerScreen({ navigation }: LightTrackerScreenProps) {
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const insets = useSafeAreaInsets();

  const measureLight = () => {
    Alert.alert(
      'Light Measurement Tips',
      'To measure light levels:\n\n• Use a light meter app on your phone\n• Check readings at different times of day\n• Consider seasonal changes\n• Measure where your plant will be placed\n\nProfessional light meters provide the most accurate readings.',
      [{ text: 'Got it' }]
    );
  };

  const addRoom = () => {
    Alert.alert(
      'Add Room',
      'This feature will allow you to save light measurements for different rooms and track which plants work best in each location.',
      [{ text: 'Coming Soon' }]
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View 
        className="bg-yellow-500 px-4 pb-4"
        style={{ paddingTop: insets.top + 10 }}
      >
        <View className="flex-row items-center">
          <Pressable
            onPress={() => navigation.goBack()}
            className="mr-4 p-2"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
          <Text className="text-white text-xl font-semibold">Light Tracker</Text>
        </View>
      </View>

      {/* Info Banner */}
      <View className="bg-blue-50 border-l-4 border-blue-400 p-4 mx-4 mt-4 rounded">
        <View className="flex-row items-center">
          <Ionicons name="information-circle" size={20} color="#3b82f6" />
          <Text className="font-semibold text-blue-800 ml-2">Understanding Light Levels</Text>
        </View>
        <Text className="text-blue-700 text-sm mt-1">
          Light is measured in foot-candles (fc). Most smartphones have light meter apps that can help you measure the light in your space.
        </Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Light Level Cards */}
        {lightLevels.map((level, index) => (
          <View key={index} className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
            <View className="flex-row items-center mb-3">
              <View 
                className="w-12 h-12 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: `${level.color}20` }}
              >
                <Ionicons name={level.icon as any} size={24} color={level.color} />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-gray-800 text-lg">{level.name}</Text>
                <Text className="text-gray-600">{level.description}</Text>
              </View>
              <Text className="text-gray-500 text-sm font-medium">{level.footCandles} fc</Text>
            </View>
            
            <View className="mb-3">
              <Text className="font-semibold text-gray-800 mb-1">Typical Locations:</Text>
              <Text className="text-gray-600 text-sm">
                {level.examples.join(', ')}
              </Text>
            </View>
            
            <View>
              <Text className="font-semibold text-gray-800 mb-1">Good for these plants:</Text>
              <View className="flex-row flex-wrap">
                {level.plants.map((plant, idx) => (
                  <View key={idx} className="bg-gray-100 rounded-full px-2 py-1 mr-2 mb-1">
                    <Text className="text-gray-700 text-xs">{plant}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ))}

        {/* Quick Tips */}
        <View className="bg-green-50 rounded-lg p-4 mb-4">
          <Text className="font-semibold text-green-800 mb-2">💡 Quick Light Tips</Text>
          <Text className="text-green-700 text-sm mb-1">• Most houseplants prefer bright, indirect light</Text>
          <Text className="text-green-700 text-sm mb-1">• Light levels change with seasons - monitor regularly</Text>
          <Text className="text-green-700 text-sm mb-1">• Rotate plants weekly for even growth</Text>
          <Text className="text-green-700 text-sm mb-1">• Use grow lights to supplement natural light</Text>
          <Text className="text-green-700 text-sm">• Signs of too little light: leggy growth, pale leaves</Text>
        </View>

        {/* Seasonal Changes */}
        <View className="bg-orange-50 rounded-lg p-4 mb-4">
          <Text className="font-semibold text-orange-800 mb-2">🍂 Seasonal Considerations</Text>
          <Text className="text-orange-700 text-sm mb-1"><Text className="font-medium">Spring/Summer:</Text> Longer days, stronger light</Text>
          <Text className="text-orange-700 text-sm mb-1"><Text className="font-medium">Fall/Winter:</Text> Shorter days, weaker light</Text>
          <Text className="text-orange-700 text-sm mb-1"><Text className="font-medium">Solution:</Text> Move plants closer to windows in winter</Text>
          <Text className="text-orange-700 text-sm">Consider grow lights for tropical plants</Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="p-4 bg-white border-t border-gray-200">
        <Pressable
          onPress={measureLight}
          className="bg-yellow-500 py-3 rounded-lg mb-3"
        >
          <Text className="text-white text-center font-semibold">How to Measure Light</Text>
        </Pressable>
        
        <Pressable
          onPress={addRoom}
          className="bg-green-600 py-3 rounded-lg"
        >
          <Text className="text-white text-center font-semibold">Track Room Light Levels</Text>
        </Pressable>
      </View>
    </View>
  );
}