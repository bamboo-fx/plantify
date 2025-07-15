import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DemoModeNoticeProps {
  message?: string;
}

export default function DemoModeNotice({ 
  message = "Demo mode active - showing sample plant data" 
}: DemoModeNoticeProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <View className="bg-blue-50 border border-blue-200 mx-4 mt-4 p-3 rounded-lg flex-row items-center">
      <Ionicons name="information-circle" size={20} color="#3b82f6" />
      <Text className="text-blue-800 text-sm flex-1 ml-2">
        {message}
      </Text>
      <Pressable
        onPress={() => setIsVisible(false)}
        className="ml-2 p-1"
      >
        <Ionicons name="close" size={16} color="#3b82f6" />
      </Pressable>
    </View>
  );
}