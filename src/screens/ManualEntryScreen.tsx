import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { analyzeManualPlantEntry } from '../services/manualPlantAnalysis';
import { usePlantStore } from '../state/plantStore';
import { PlantIdentification, PlantInfo } from '../types/plant';
import GradientBackground from '../components/GradientBackground';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';

interface ManualEntryScreenProps {
  navigation: any;
}

const commonPlants = [
  'Monstera Deliciosa',
  'Snake Plant',
  'Pothos',
  'Fiddle Leaf Fig',
  'Peace Lily',
  'Spider Plant',
  'Rubber Plant',
  'ZZ Plant',
  'Philodendron',
  'Aloe Vera',
  'English Ivy',
  'Boston Fern'
];

export default function ManualEntryScreen({ navigation }: ManualEntryScreenProps) {
  const [plantName, setPlantName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { addIdentification } = usePlantStore();
  const insets = useSafeAreaInsets();

  const handlePlantNameChange = (text: string) => {
    setPlantName(text);
    
    if (text.length > 1) {
      const filteredSuggestions = commonPlants.filter(plant =>
        plant.toLowerCase().includes(text.toLowerCase())
      );
      setSuggestions(filteredSuggestions.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const analyzePlant = async (name: string) => {
    if (!name.trim()) {
      Alert.alert('Enter Plant Name', 'Please enter a plant name to get information.');
      return;
    }

    setIsAnalyzing(true);
    setPlantName(name);
    setSuggestions([]);

    try {
      const analysisResult = await analyzeManualPlantEntry(name.trim());
      
      // Create identification record
      const identification: PlantIdentification = {
        id: Date.now().toString(),
        name: analysisResult.identification.name,
        scientificName: analysisResult.identification.scientificName,
        commonNames: [analysisResult.identification.name],
        confidence: analysisResult.identification.confidence,
        imageUri: '', // No image for manual entry
        createdAt: new Date(),
        family: analysisResult.identification.family,
        genus: analysisResult.identification.genus,
        species: analysisResult.identification.species,
      };

      // Save to store
      addIdentification(identification);
      
      // Navigate to result screen with the analysis data
      navigation.navigate('ManualPlantResult', { 
        plantName: name,
        analysisResult,
        identification
      });

    } catch (error) {
      console.error('Manual plant analysis error:', error);
      Alert.alert(
        'Analysis Failed',
        'Unable to find information for this plant. Please check the spelling or try a different name.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setPlantName(suggestion);
    setSuggestions([]);
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
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
          <Text className="text-white text-xl font-semibold">Manual Plant Entry</Text>
        </View>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Instructions */}
        <View className="bg-blue-50 rounded-lg p-4 mb-6">
          <View className="flex-row items-center mb-2">
            <Ionicons name="information-circle" size={20} color="#2563eb" />
            <Text className="font-semibold text-blue-800 ml-2">How it works</Text>
          </View>
          <Text className="text-blue-700 text-sm">
            Enter the name of any plant (common or scientific name) to get detailed care instructions, 
            toxicity information, and growing tips. No photo required!
          </Text>
        </View>

        {/* Plant Name Input */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Plant Name
          </Text>
          <View className="relative">
            <TextInput
              value={plantName}
              onChangeText={handlePlantNameChange}
              placeholder="Enter plant name (e.g., Monstera, Snake Plant, Aloe Vera)"
              className="bg-gray-100 rounded-lg px-4 py-3 text-gray-800 text-lg"
              placeholderTextColor="#6b7280"
              autoCapitalize="words"
              autoCorrect={false}
              editable={!isAnalyzing}
            />
            {plantName.length > 0 && (
              <Pressable
                onPress={() => {
                  setPlantName('');
                  setSuggestions([]);
                }}
                className="absolute right-3 top-3"
              >
                <Ionicons name="close-circle" size={24} color="#6b7280" />
              </Pressable>
            )}
          </View>
        </View>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <View className="mb-6">
            <Text className="text-gray-600 font-medium mb-2">Suggestions:</Text>
            {suggestions.map((suggestion, index) => (
              <Pressable
                key={index}
                onPress={() => selectSuggestion(suggestion)}
                className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-2"
              >
                <Text className="text-gray-800">{suggestion}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Common Plants */}
        <View className="mb-6">
          <Text className="text-gray-800 font-semibold mb-3">Popular Plants:</Text>
          <View className="flex-row flex-wrap">
            {commonPlants.map((plant, index) => (
              <Pressable
                key={index}
                onPress={() => selectSuggestion(plant)}
                className="bg-green-100 border border-green-200 rounded-full px-3 py-2 mr-2 mb-2"
              >
                <Text className="text-green-800 text-sm">{plant}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Examples */}
        <View className="bg-gray-50 rounded-lg p-4 mb-6">
          <Text className="font-semibold text-gray-800 mb-2">Examples of what you can search:</Text>
          <Text className="text-gray-600 text-sm mb-1">• Common names: "Snake Plant", "Peace Lily"</Text>
          <Text className="text-gray-600 text-sm mb-1">• Scientific names: "Sansevieria trifasciata"</Text>
          <Text className="text-gray-600 text-sm mb-1">• Descriptive names: "Money Tree", "Swiss Cheese Plant"</Text>
          <Text className="text-gray-600 text-sm">• Categories: "Indoor fern", "Succulent plants"</Text>
        </View>
      </ScrollView>

      {/* Analyze Button */}
      <View className="p-4 border-t border-gray-200 bg-white">
        <Pressable
          onPress={() => analyzePlant(plantName)}
          disabled={!plantName.trim() || isAnalyzing}
          className={`py-4 rounded-lg flex-row items-center justify-center ${
            plantName.trim() && !isAnalyzing
              ? 'bg-green-600'
              : 'bg-gray-300'
          }`}
        >
          {isAnalyzing ? (
            <>
              <ActivityIndicator size="small" color="white" />
              <Text className="text-white font-semibold ml-2">Analyzing...</Text>
            </>
          ) : (
            <>
              <Ionicons 
                name="search" 
                size={20} 
                color={plantName.trim() ? 'white' : '#6b7280'} 
              />
              <Text className={`font-semibold ml-2 ${
                plantName.trim() ? 'text-white' : 'text-gray-600'
              }`}>
                Get Plant Information
              </Text>
            </>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}