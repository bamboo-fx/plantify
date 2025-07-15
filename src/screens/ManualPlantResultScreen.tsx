import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PlantInfo, PlantIdentification } from '../types/plant';
import { PlantAnalysisResult } from '../services/plantAnalysis';

interface ManualPlantResultScreenProps {
  route: {
    params: {
      plantName: string;
      analysisResult: PlantAnalysisResult;
      identification: PlantIdentification;
    };
  };
  navigation: any;
}

export default function ManualPlantResultScreen({ route, navigation }: ManualPlantResultScreenProps) {
  const { plantName, analysisResult, identification } = route.params;
  const [activeTab, setActiveTab] = useState<'info' | 'care'>('info');
  const insets = useSafeAreaInsets();

  const plantInfo = analysisResult.plantInfo;

  const addToCollection = () => {
    Alert.alert(
      'Add to Collection',
      'This feature will allow you to add plants to your personal collection with custom names and care reminders.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View 
        className="bg-green-600 px-4 pb-4"
        style={{ paddingTop: insets.top + 10 }}
      >
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => navigation.goBack()}
            className="p-2"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
          
          <View className="flex-1 items-center">
            <Text className="text-white text-lg font-semibold">Plant Information</Text>
          </View>
          
          <View className="w-10" />
        </View>
        
        {/* Confidence Badge */}
        <View className="mt-3 flex-row justify-center">
          <View className={`px-3 py-1 rounded-full ${
            identification.confidence >= 0.8 ? 'bg-green-500' :
            identification.confidence >= 0.6 ? 'bg-yellow-500' :
            'bg-orange-500'
          }`}>
            <Text className="text-white text-sm font-medium">
              {Math.round(identification.confidence * 100)}% match
            </Text>
          </View>
        </View>
      </View>

      {/* Plant Name Section */}
      <View className="p-4 border-b border-gray-200 bg-white">
        <Text className="text-2xl font-bold text-gray-800 text-center">
          {plantInfo.name}
        </Text>
        <Text className="text-gray-600 italic text-center mt-1">
          {plantInfo.scientificName}
        </Text>
        {identification.family && (
          <Text className="text-gray-500 text-sm text-center mt-1">
            Family: {identification.family}
          </Text>
        )}
      </View>

      {/* Tabs */}
      <View className="flex-row border-b border-gray-200 bg-white">
        <Pressable
          onPress={() => setActiveTab('info')}
          className={`flex-1 py-3 ${activeTab === 'info' ? 'border-b-2 border-green-600' : ''}`}
        >
          <Text className={`text-center font-medium ${
            activeTab === 'info' ? 'text-green-600' : 'text-gray-600'
          }`}>
            Plant Info
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab('care')}
          className={`flex-1 py-3 ${activeTab === 'care' ? 'border-b-2 border-green-600' : ''}`}
        >
          <Text className={`text-center font-medium ${
            activeTab === 'care' ? 'text-green-600' : 'text-gray-600'
          }`}>
            Care Guide
          </Text>
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 p-4">
        {activeTab === 'info' && (
          <View>
            {/* Description */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-800 mb-2">About This Plant</Text>
              <Text className="text-gray-700 leading-relaxed">
                {plantInfo.description}
              </Text>
            </View>
            
            {/* Toxicity Warning */}
            {plantInfo.toxicity.toxic && (
              <View className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="warning" size={20} color="#dc2626" />
                  <Text className="font-semibold text-red-800 ml-2">
                    ⚠️ Toxicity Warning
                  </Text>
                </View>
                <Text className="text-red-700 font-medium">
                  Toxic to: {plantInfo.toxicity.toxicTo.join(', ')}
                </Text>
                <Text className="text-red-700 mt-1">
                  Severity: {plantInfo.toxicity.severity.toUpperCase()}
                </Text>
                {plantInfo.toxicity.symptoms.length > 0 && (
                  <Text className="text-red-600 text-sm mt-2">
                    Symptoms if ingested: {plantInfo.toxicity.symptoms.join(', ')}
                  </Text>
                )}
              </View>
            )}
            
            {/* Growth Habits */}
            <View className="bg-gray-50 rounded-lg p-4 mb-6">
              <Text className="font-semibold text-gray-800 mb-3">Growth Information</Text>
              <View className="space-y-2">
                <View className="flex-row">
                  <Text className="text-gray-600 font-medium w-20">Size:</Text>
                  <Text className="text-gray-800 flex-1">{plantInfo.growthHabits.size}</Text>
                </View>
                <View className="flex-row">
                  <Text className="text-gray-600 font-medium w-20">Rate:</Text>
                  <Text className="text-gray-800 flex-1">{plantInfo.growthHabits.growthRate}</Text>
                </View>
                {plantInfo.growthHabits.bloomTime && (
                  <View className="flex-row">
                    <Text className="text-gray-600 font-medium w-20">Blooms:</Text>
                    <Text className="text-gray-800 flex-1">{plantInfo.growthHabits.bloomTime}</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Safety Status */}
            {!plantInfo.toxicity.toxic && (
              <View className="bg-green-50 border border-green-200 rounded-lg p-4">
                <View className="flex-row items-center">
                  <Ionicons name="shield-checkmark" size={20} color="#16a34a" />
                  <Text className="font-semibold text-green-800 ml-2">
                    ✅ Pet & Child Safe
                  </Text>
                </View>
                <Text className="text-green-700 mt-1">
                  This plant is generally considered safe around pets and children.
                </Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'care' && (
          <View className="space-y-4">
            {/* Watering */}
            <View className="bg-blue-50 rounded-lg p-4">
              <View className="flex-row items-center mb-2">
                <Ionicons name="water" size={20} color="#2563eb" />
                <Text className="font-semibold text-blue-800 ml-2">Watering</Text>
              </View>
              <Text className="text-blue-700">{plantInfo.careInstructions.watering}</Text>
            </View>
            
            {/* Light */}
            <View className="bg-yellow-50 rounded-lg p-4">
              <View className="flex-row items-center mb-2">
                <Ionicons name="sunny" size={20} color="#d97706" />
                <Text className="font-semibold text-yellow-800 ml-2">Light Requirements</Text>
              </View>
              <Text className="text-yellow-700">{plantInfo.careInstructions.light}</Text>
            </View>
            
            {/* Temperature */}
            <View className="bg-green-50 rounded-lg p-4">
              <View className="flex-row items-center mb-2">
                <Ionicons name="thermometer" size={20} color="#16a34a" />
                <Text className="font-semibold text-green-800 ml-2">Temperature</Text>
              </View>
              <Text className="text-green-700">{plantInfo.careInstructions.temperature}</Text>
            </View>
            
            {/* Humidity */}
            <View className="bg-cyan-50 rounded-lg p-4">
              <View className="flex-row items-center mb-2">
                <Ionicons name="water-outline" size={20} color="#0891b2" />
                <Text className="font-semibold text-cyan-800 ml-2">Humidity</Text>
              </View>
              <Text className="text-cyan-700">{plantInfo.careInstructions.humidity}</Text>
            </View>
            
            {/* Fertilizer */}
            <View className="bg-purple-50 rounded-lg p-4">
              <View className="flex-row items-center mb-2">
                <Ionicons name="flower" size={20} color="#7c3aed" />
                <Text className="font-semibold text-purple-800 ml-2">Fertilizer</Text>
              </View>
              <Text className="text-purple-700">{plantInfo.careInstructions.fertilizer}</Text>
            </View>
            
            {/* Soil */}
            <View className="bg-amber-50 rounded-lg p-4">
              <View className="flex-row items-center mb-2">
                <Ionicons name="earth" size={20} color="#f59e0b" />
                <Text className="font-semibold text-amber-800 ml-2">Soil</Text>
              </View>
              <Text className="text-amber-700">{plantInfo.careInstructions.soil}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Actions */}
      <View className="p-4 border-t border-gray-200 bg-white">
        <Pressable
          onPress={addToCollection}
          className="bg-green-600 py-3 rounded-lg mb-3"
        >
          <Text className="text-white text-center font-semibold">
            Add to My Collection
          </Text>
        </Pressable>
        
        <View className="flex-row space-x-3">
          <Pressable
            onPress={() => navigation.navigate('Main', { screen: 'Expert' })}
            className="flex-1 bg-blue-600 py-3 rounded-lg"
          >
            <Text className="text-white text-center font-medium">Ask Expert</Text>
          </Pressable>
          
          <Pressable
            onPress={() => navigation.navigate('ManualEntry')}
            className="flex-1 bg-gray-200 py-3 rounded-lg"
          >
            <Text className="text-gray-800 text-center font-medium">Search Another</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}