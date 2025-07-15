import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ComingSoonScreenProps {
  navigation: any;
  route: {
    params: {
      title: string;
      description: string;
      icon: keyof typeof Ionicons.glyphMap;
    };
  };
}

export default function ComingSoonScreen({ navigation, route }: ComingSoonScreenProps) {
  const { title, description, icon } = route.params;
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View 
        className="bg-purple-600 px-4 pb-4"
        style={{ paddingTop: insets.top + 10 }}
      >
        <View className="flex-row items-center">
          <Pressable
            onPress={() => navigation.goBack()}
            className="mr-4 p-2"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
          <Text className="text-white text-xl font-semibold">{title}</Text>
        </View>
      </View>

      <View className="flex-1 justify-center items-center px-6">
        <View className="w-24 h-24 bg-purple-100 rounded-full items-center justify-center mb-6">
          <Ionicons name={icon} size={48} color="#7c3aed" />
        </View>
        
        <Text className="text-2xl font-bold text-gray-800 text-center mb-4">
          Coming Soon!
        </Text>
        
        <Text className="text-gray-600 text-center text-lg mb-6">
          {description}
        </Text>
        
        <View className="bg-blue-50 rounded-lg p-4 mb-6">
          <Text className="text-blue-800 text-center text-sm">
            This feature is currently in development and will be available in a future update. 
            Stay tuned for more plant care tools!
          </Text>
        </View>

        <Pressable
          onPress={() => navigation.goBack()}
          className="bg-purple-600 px-8 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </Pressable>
      </View>
    </View>
  );
}