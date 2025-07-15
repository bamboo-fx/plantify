import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AboutScreenProps {
  navigation: any;
}

export default function AboutScreen({ navigation }: AboutScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View 
        className="bg-green-600 px-4 pb-4"
        style={{ paddingTop: insets.top + 10 }}
      >
        <View className="flex-row items-center">
          <Pressable
            onPress={() => navigation.goBack()}
            className="mr-4 p-2"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
          <Text className="text-white text-xl font-semibold">About PlantCare</Text>
        </View>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* App Info */}
        <View className="bg-white rounded-lg p-6 mb-4 items-center">
          <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="leaf" size={40} color="#16a34a" />
          </View>
          <Text className="text-2xl font-bold text-gray-800 mb-2">PlantCare AI</Text>
          <Text className="text-gray-600 text-center mb-2">Your AI-powered plant companion</Text>
          <Text className="text-gray-500 text-sm">Version 1.0.0</Text>
        </View>

        {/* Features */}
        <View className="bg-white rounded-lg p-4 mb-4">
          <Text className="font-bold text-gray-800 text-lg mb-3">Features</Text>
          
          <View className="flex-row items-center mb-3">
            <Ionicons name="camera" size={20} color="#16a34a" />
            <Text className="text-gray-700 ml-3">AI Plant Identification</Text>
          </View>
          
          <View className="flex-row items-center mb-3">
            <Ionicons name="medical" size={20} color="#dc2626" />
            <Text className="text-gray-700 ml-3">Disease Detection & Treatment</Text>
          </View>
          
          <View className="flex-row items-center mb-3">
            <Ionicons name="chatbubbles" size={20} color="#3b82f6" />
            <Text className="text-gray-700 ml-3">24/7 Expert Consultation</Text>
          </View>
          
          <View className="flex-row items-center mb-3">
            <Ionicons name="water" size={20} color="#0891b2" />
            <Text className="text-gray-700 ml-3">Care Reminders & Tracking</Text>
          </View>
          
          <View className="flex-row items-center mb-3">
            <Ionicons name="warning" size={20} color="#f59e0b" />
            <Text className="text-gray-700 ml-3">Toxicity Warnings</Text>
          </View>
          
          <View className="flex-row items-center">
            <Ionicons name="library" size={20} color="#7c3aed" />
            <Text className="text-gray-700 ml-3">Personal Plant Collection</Text>
          </View>
        </View>

        {/* Technology */}
        <View className="bg-white rounded-lg p-4 mb-4">
          <Text className="font-bold text-gray-800 text-lg mb-3">Powered by AI</Text>
          <Text className="text-gray-600 text-sm leading-relaxed">
            PlantCare uses advanced AI vision models to identify plants with high accuracy. 
            Our system analyzes plant features, diseases, and provides personalized care advice 
            based on the latest botanical knowledge.
          </Text>
        </View>

        {/* Disclaimer */}
        <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <View className="flex-row items-center mb-2">
            <Ionicons name="information-circle" size={20} color="#f59e0b" />
            <Text className="font-semibold text-yellow-800 ml-2">Important Disclaimer</Text>
          </View>
          <Text className="text-yellow-700 text-sm leading-relaxed">
            While our AI provides accurate plant identification and care advice, it should not replace 
            professional consultation for serious plant health issues. Always consult with local 
            botanists or extension services for critical plant problems.
          </Text>
        </View>

        {/* Privacy */}
        <View className="bg-white rounded-lg p-4 mb-4">
          <Text className="font-bold text-gray-800 text-lg mb-3">Privacy & Data</Text>
          <Text className="text-gray-600 text-sm leading-relaxed">
            Your plant photos and data are processed securely. We do not store personal images 
            or share your plant collection data with third parties. All AI processing is done 
            through secure, encrypted connections.
          </Text>
        </View>

        {/* Contact */}
        <View className="bg-white rounded-lg p-4 mb-4">
          <Text className="font-bold text-gray-800 text-lg mb-3">Contact & Support</Text>
          <Text className="text-gray-600 text-sm mb-2">
            Need help? Have suggestions? We'd love to hear from you!
          </Text>
          <Text className="text-gray-600 text-sm">
            Email: support@plantcare-ai.com{'\n'}
            Website: www.plantcare-ai.com
          </Text>
        </View>

        {/* Credits */}
        <View className="bg-white rounded-lg p-4 mb-4">
          <Text className="font-bold text-gray-800 text-lg mb-3">Credits</Text>
          <Text className="text-gray-600 text-sm leading-relaxed">
            Built with React Native, Expo, and powered by OpenAI's vision models. 
            Plant data sourced from botanical databases and expert knowledge.
          </Text>
        </View>

        {/* Copyright */}
        <View className="items-center py-4">
          <Text className="text-gray-500 text-sm">
            © 2024 PlantCare AI. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}