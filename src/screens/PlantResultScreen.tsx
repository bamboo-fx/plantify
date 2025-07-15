import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePlantStore } from '../state/plantStore';
import { PlantIdentification, PlantInfo, PlantDisease } from '../types/plant';
import { analyzePlantImage } from '../services/plantAnalysis';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type PlantResultScreenProps = NativeStackScreenProps<RootStackParamList, 'PlantResult'>;

export default function PlantResultScreen({ route, navigation }: PlantResultScreenProps) {
  const { imageUri } = route.params;
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [plantInfo, setPlantInfo] = useState<PlantInfo | null>(null);
  const [diseaseInfo, setDiseaseInfo] = useState<PlantDisease | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'care' | 'disease'>('info');
  
  const { addIdentification } = usePlantStore();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    analyzePlant();
  }, []);

  const analyzePlant = async () => {
    try {
      setIsAnalyzing(true);
      setError(null);

      // Convert image to base64 for analysis
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]); // Remove data:image/jpeg;base64, prefix
        };
        reader.readAsDataURL(blob);
      });

      // Analyze with AI
      const analysisResult = await analyzePlantImage(base64);
      
      // Create identification record
      const identification: PlantIdentification = {
        id: Date.now().toString(),
        name: analysisResult.identification.name,
        scientificName: analysisResult.identification.scientificName,
        commonNames: [analysisResult.identification.name],
        confidence: analysisResult.identification.confidence,
        imageUri,
        createdAt: new Date(),
        family: analysisResult.identification.family,
        genus: analysisResult.identification.genus,
        species: analysisResult.identification.species,
      };

      // Save to store
      addIdentification(identification);
      
      // Set plant info
      setPlantInfo(analysisResult.plantInfo);
      
      // Set disease info if present
      if (analysisResult.diseaseCheck.hasDisease && analysisResult.diseaseCheck.diseaseInfo) {
        setDiseaseInfo(analysisResult.diseaseCheck.diseaseInfo);
      }

    } catch (err) {
      console.error('Plant analysis error:', err);
      let errorMessage = 'Failed to analyze the plant. Please try again with a clearer image.';
      
      if (err instanceof Error) {
        if (err.message.includes('parse')) {
          errorMessage = 'Our AI had trouble processing the image. Please try again with a clearer, well-lit photo of the plant.';
        } else if (err.message.includes('Invalid response')) {
          errorMessage = 'Unable to identify this plant. Please ensure the image clearly shows the plant leaves, flowers, or distinctive features.';
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addToCollection = () => {
    if (!plantInfo) return;
    
    // For now, show a simple alert - can be enhanced later
    Alert.alert(
      'Add to Collection',
      'This feature will allow you to add plants to your personal collection with custom names and care reminders.',
      [{ text: 'OK' }]
    );
  };

  if (isAnalyzing) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#16a34a" />
        <Text className="text-lg font-semibold text-gray-800 mt-4">
          Analyzing Plant...
        </Text>
        <Text className="text-gray-600 text-center mt-2 px-8">
          Our AI is identifying your plant and gathering care information
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
        <Text className="text-lg font-semibold text-gray-800 mt-4 text-center">
          Analysis Failed
        </Text>
        <Text className="text-gray-600 text-center mt-2">
          {error}
        </Text>
        <Pressable
          onPress={analyzePlant}
          className="bg-green-600 px-6 py-3 rounded-lg mt-6"
        >
          <Text className="text-white font-semibold">Try Again</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.goBack()}
          className="mt-4"
        >
          <Text className="text-green-600 font-medium">Take New Photo</Text>
        </Pressable>
      </View>
    );
  }

  if (!plantInfo) return null;

  return (
    <View className="flex-1 bg-white">
      {/* Header Image */}
      <View className="relative">
        <Image
          source={{ uri: imageUri }}
          className="w-full h-64"
          resizeMode="cover"
        />
        <Pressable
          onPress={() => navigation.goBack()}
          className="absolute top-12 left-4 bg-black/30 rounded-full p-2"
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        
        {diseaseInfo && (
          <View className="absolute top-12 right-4 bg-red-500 rounded-full px-3 py-1">
            <Text className="text-white text-xs font-semibold">Disease Detected</Text>
          </View>
        )}
      </View>

      {/* Plant Name */}
      <View className="p-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800">
          {plantInfo.name}
        </Text>
        <Text className="text-gray-600 italic mt-1">
          {plantInfo.scientificName}
        </Text>
      </View>

      {/* Tabs */}
      <View className="flex-row border-b border-gray-200">
        <Pressable
          onPress={() => setActiveTab('info')}
          className={`flex-1 py-3 ${activeTab === 'info' ? 'border-b-2 border-green-600' : ''}`}
        >
          <Text className={`text-center font-medium ${
            activeTab === 'info' ? 'text-green-600' : 'text-gray-600'
          }`}>
            Info
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab('care')}
          className={`flex-1 py-3 ${activeTab === 'care' ? 'border-b-2 border-green-600' : ''}`}
        >
          <Text className={`text-center font-medium ${
            activeTab === 'care' ? 'text-green-600' : 'text-gray-600'
          }`}>
            Care
          </Text>
        </Pressable>
        {diseaseInfo && (
          <Pressable
            onPress={() => setActiveTab('disease')}
            className={`flex-1 py-3 ${activeTab === 'disease' ? 'border-b-2 border-red-600' : ''}`}
          >
            <Text className={`text-center font-medium ${
              activeTab === 'disease' ? 'text-red-600' : 'text-gray-600'
            }`}>
              Disease
            </Text>
          </Pressable>
        )}
      </View>

      {/* Content */}
      <ScrollView className="flex-1 p-4">
        {activeTab === 'info' && (
          <View>
            <Text className="text-gray-800 leading-relaxed mb-4">
              {plantInfo.description}
            </Text>
            
            {plantInfo.toxicity.toxic && (
              <View className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="warning" size={20} color="#dc2626" />
                  <Text className="font-semibold text-red-800 ml-2">
                    Toxicity Warning
                  </Text>
                </View>
                <Text className="text-red-700">
                  Toxic to: {plantInfo.toxicity.toxicTo.join(', ')}
                </Text>
                {plantInfo.toxicity.symptoms && (
                  <Text className="text-red-600 text-sm mt-1">
                    Symptoms: {plantInfo.toxicity.symptoms.join(', ')}
                  </Text>
                )}
              </View>
            )}
            
            <View className="bg-gray-50 rounded-lg p-4">
              <Text className="font-semibold text-gray-800 mb-2">Growth Habits</Text>
              <Text className="text-gray-600">Size: {plantInfo.growthHabits.size}</Text>
              <Text className="text-gray-600">Growth Rate: {plantInfo.growthHabits.growthRate}</Text>
              {plantInfo.growthHabits.bloomTime && (
                <Text className="text-gray-600">Bloom Time: {plantInfo.growthHabits.bloomTime}</Text>
              )}
            </View>
          </View>
        )}

        {activeTab === 'care' && (
          <View className="space-y-4">
            <View className="bg-blue-50 rounded-lg p-4">
              <View className="flex-row items-center mb-2">
                <Ionicons name="water" size={20} color="#2563eb" />
                <Text className="font-semibold text-blue-800 ml-2">Watering</Text>
              </View>
              <Text className="text-blue-700">{plantInfo.careInstructions.watering}</Text>
            </View>
            
            <View className="bg-yellow-50 rounded-lg p-4">
              <View className="flex-row items-center mb-2">
                <Ionicons name="sunny" size={20} color="#d97706" />
                <Text className="font-semibold text-yellow-800 ml-2">Light</Text>
              </View>
              <Text className="text-yellow-700">{plantInfo.careInstructions.light}</Text>
            </View>
            
            <View className="bg-green-50 rounded-lg p-4">
              <View className="flex-row items-center mb-2">
                <Ionicons name="thermometer" size={20} color="#16a34a" />
                <Text className="font-semibold text-green-800 ml-2">Temperature</Text>
              </View>
              <Text className="text-green-700">{plantInfo.careInstructions.temperature}</Text>
            </View>
            
            <View className="bg-purple-50 rounded-lg p-4">
              <View className="flex-row items-center mb-2">
                <Ionicons name="flower" size={20} color="#7c3aed" />
                <Text className="font-semibold text-purple-800 ml-2">Fertilizer</Text>
              </View>
              <Text className="text-purple-700">{plantInfo.careInstructions.fertilizer}</Text>
            </View>
            
            <View className="bg-amber-50 rounded-lg p-4">
              <View className="flex-row items-center mb-2">
                <Ionicons name="earth" size={20} color="#f59e0b" />
                <Text className="font-semibold text-amber-800 ml-2">Soil</Text>
              </View>
              <Text className="text-amber-700">{plantInfo.careInstructions.soil}</Text>
            </View>
          </View>
        )}

        {activeTab === 'disease' && diseaseInfo && (
          <View>
            <View className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <Text className="font-semibold text-red-800 text-lg mb-2">
                {diseaseInfo.name}
              </Text>
              <Text className="text-red-700 mb-2">
                Severity: {diseaseInfo.severity.toUpperCase()}
              </Text>
              <Text className="text-red-600">
                {diseaseInfo.description}
              </Text>
            </View>
            
            <View className="mb-4">
              <Text className="font-semibold text-gray-800 mb-2">Symptoms</Text>
              {diseaseInfo.symptoms.map((symptom, index) => (
                <Text key={index} className="text-gray-600">• {symptom}</Text>
              ))}
            </View>
            
            <View className="mb-4">
              <Text className="font-semibold text-gray-800 mb-2">Treatment</Text>
              {diseaseInfo.treatment.map((treatment, index) => (
                <Text key={index} className="text-gray-600 mb-1">
                  {index + 1}. {treatment}
                </Text>
              ))}
            </View>
            
            <View className="bg-green-50 rounded-lg p-4">
              <Text className="font-semibold text-green-800 mb-2">Prevention</Text>
              {diseaseInfo.prevention.map((prevention, index) => (
                <Text key={index} className="text-green-700">• {prevention}</Text>
              ))}
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
            onPress={() => navigation.navigate('Main')}
            className="flex-1 bg-blue-600 py-3 rounded-lg"
          >
            <Text className="text-white text-center font-medium">Ask Expert</Text>
          </Pressable>
          
          <Pressable
            onPress={() => navigation.goBack()}
            className="flex-1 bg-gray-200 py-3 rounded-lg"
          >
            <Text className="text-gray-800 text-center font-medium">Scan Another</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}