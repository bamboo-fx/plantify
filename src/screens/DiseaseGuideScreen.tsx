import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface DiseaseGuideScreenProps {
  navigation: any;
}

const plantDiseases = [
  {
    name: 'Powdery Mildew',
    type: 'Fungal',
    symptoms: ['White powdery coating on leaves', 'Yellowing leaves', 'Stunted growth'],
    causes: ['High humidity', 'Poor air circulation', 'Overwatering'],
    treatment: ['Remove affected leaves', 'Improve air circulation', 'Apply fungicide spray', 'Reduce watering frequency'],
    prevention: ['Ensure good air flow', 'Water at soil level', 'Avoid overhead watering', 'Space plants properly'],
    commonPlants: ['Roses', 'Cucumber', 'Squash', 'Phlox']
  },
  {
    name: 'Root Rot',
    type: 'Fungal',
    symptoms: ['Yellowing leaves', 'Wilting despite moist soil', 'Brown, mushy roots', 'Foul smell from soil'],
    causes: ['Overwatering', 'Poor drainage', 'Contaminated soil', 'Fungal pathogens'],
    treatment: ['Remove from pot immediately', 'Trim black/brown roots', 'Repot in fresh soil', 'Reduce watering'],
    prevention: ['Use well-draining soil', 'Proper pot drainage', 'Water only when needed', 'Choose appropriate pot size'],
    commonPlants: ['Houseplants', 'Succulents', 'Tropical plants', 'Herbs']
  },
  {
    name: 'Leaf Spot',
    type: 'Fungal/Bacterial',
    symptoms: ['Brown or black spots on leaves', 'Yellow halos around spots', 'Premature leaf drop'],
    causes: ['Overhead watering', 'High humidity', 'Poor air circulation', 'Infected plant material'],
    treatment: ['Remove affected leaves', 'Apply copper fungicide', 'Improve ventilation', 'Water at soil level'],
    prevention: ['Avoid wetting leaves', 'Ensure good air flow', 'Remove fallen leaves', 'Disinfect tools'],
    commonPlants: ['Tomatoes', 'Peppers', 'Roses', 'Fruit trees']
  },
  {
    name: 'Aphid Infestation',
    type: 'Pest',
    symptoms: ['Small green/black insects on stems', 'Sticky honeydew on leaves', 'Curled or yellowing leaves', 'Stunted growth'],
    causes: ['Warm weather', 'New plant growth', 'Over-fertilization', 'Stress conditions'],
    treatment: ['Spray with water', 'Apply insecticidal soap', 'Use neem oil', 'Introduce beneficial insects'],
    prevention: ['Regular inspection', 'Avoid over-fertilizing', 'Encourage beneficial insects', 'Keep plants healthy'],
    commonPlants: ['Roses', 'Vegetables', 'Fruit trees', 'Houseplants']
  },
  {
    name: 'Spider Mites',
    type: 'Pest',
    symptoms: ['Fine webbing on leaves', 'Yellow stippled leaves', 'Tiny moving dots on leaves', 'Premature leaf drop'],
    causes: ['Hot, dry conditions', 'Low humidity', 'Stress', 'Indoor heating'],
    treatment: ['Increase humidity', 'Spray with water', 'Apply miticide', 'Use predatory mites'],
    prevention: ['Maintain humidity', 'Regular misting', 'Avoid over-fertilizing', 'Keep plants healthy'],
    commonPlants: ['Houseplants', 'Vegetables', 'Fruit trees', 'Ornamentals']
  },
  {
    name: 'Blight',
    type: 'Fungal/Bacterial',
    symptoms: ['Rapid browning of leaves', 'Black or brown lesions', 'Wilting', 'Plant death'],
    causes: ['Wet conditions', 'Poor air circulation', 'Infected seeds', 'Contaminated tools'],
    treatment: ['Remove affected parts', 'Apply fungicide', 'Improve drainage', 'Destroy infected plants'],
    prevention: ['Crop rotation', 'Proper spacing', 'Avoid overhead watering', 'Use disease-resistant varieties'],
    commonPlants: ['Tomatoes', 'Potatoes', 'Peppers', 'Beans']
  },
];

export default function DiseaseGuideScreen({ navigation }: DiseaseGuideScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const insets = useSafeAreaInsets();

  const diseaseTypes = ['All', 'Fungal', 'Bacterial', 'Pest'];

  const filteredDiseases = plantDiseases.filter(disease => {
    const matchesSearch = disease.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         disease.symptoms.some(symptom => symptom.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'All' || disease.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Fungal':
        return 'bg-green-100 text-green-800';
      case 'Bacterial':
        return 'bg-blue-100 text-blue-800';
      case 'Pest':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View 
        className="bg-red-600 px-4 pb-4"
        style={{ paddingTop: insets.top + 10 }}
      >
        <View className="flex-row items-center mb-4">
          <Pressable
            onPress={() => navigation.goBack()}
            className="mr-4 p-2"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
          <Text className="text-white text-xl font-semibold">Plant Disease Guide</Text>
        </View>
        
        {/* Search Bar */}
        <View className="flex-row items-center bg-white rounded-lg px-3 py-2 mb-3">
          <Ionicons name="search" size={20} color="#6b7280" />
          <TextInput
            placeholder="Search diseases or symptoms..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-2 text-gray-800"
            placeholderTextColor="#6b7280"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#6b7280" />
            </Pressable>
          )}
        </View>
        
        {/* Filter Buttons */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          {diseaseTypes.map((type) => (
            <Pressable
              key={type}
              onPress={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-full mr-2 ${
                selectedType === type ? 'bg-white' : 'bg-red-500'
              }`}
            >
              <Text className={`font-medium ${
                selectedType === type ? 'text-red-600' : 'text-white'
              }`}>
                {type}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView className="flex-1 p-4">
        {filteredDiseases.map((disease, index) => (
          <View key={index} className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
            <View className="flex-row justify-between items-start mb-2">
              <Text className="font-bold text-gray-800 text-lg flex-1">{disease.name}</Text>
              <View className={`px-2 py-1 rounded-full ${getTypeColor(disease.type)}`}>
                <Text className="text-xs font-semibold">{disease.type.toUpperCase()}</Text>
              </View>
            </View>
            
            <View className="mb-3">
              <Text className="font-semibold text-gray-800 mb-1">Symptoms:</Text>
              {disease.symptoms.map((symptom, idx) => (
                <Text key={idx} className="text-gray-600 text-sm">• {symptom}</Text>
              ))}
            </View>
            
            <View className="mb-3">
              <Text className="font-semibold text-gray-800 mb-1">Common Causes:</Text>
              <Text className="text-gray-600 text-sm">
                {disease.causes.join(', ')}
              </Text>
            </View>
            
            <View className="mb-3">
              <Text className="font-semibold text-gray-800 mb-1">Treatment:</Text>
              {disease.treatment.map((treatment, idx) => (
                <Text key={idx} className="text-gray-600 text-sm">• {treatment}</Text>
              ))}
            </View>
            
            <View className="mb-3">
              <Text className="font-semibold text-gray-800 mb-1">Prevention:</Text>
              {disease.prevention.map((prevention, idx) => (
                <Text key={idx} className="text-gray-600 text-sm">• {prevention}</Text>
              ))}
            </View>
            
            <View>
              <Text className="font-semibold text-gray-800 mb-1">Commonly Affects:</Text>
              <View className="flex-row flex-wrap">
                {disease.commonPlants.map((plant, idx) => (
                  <View key={idx} className="bg-gray-100 rounded-full px-2 py-1 mr-2 mb-1">
                    <Text className="text-gray-700 text-xs">{plant}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ))}
        
        {filteredDiseases.length === 0 && (
          <View className="items-center py-8">
            <Ionicons name="search-outline" size={48} color="#9ca3af" />
            <Text className="text-gray-500 mt-2">No diseases found matching your search</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}