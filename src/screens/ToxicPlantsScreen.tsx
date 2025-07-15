import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ToxicPlantsScreenProps {
  navigation: any;
}

const toxicPlantsData = [
  {
    name: 'Oleander',
    scientificName: 'Nerium oleander',
    toxicTo: ['Dogs', 'Cats', 'Children', 'Horses'],
    severity: 'High',
    symptoms: ['Vomiting', 'Diarrhea', 'Heart problems', 'Difficulty breathing'],
    description: 'Extremely poisonous ornamental shrub. All parts are toxic.',
  },
  {
    name: 'Foxglove',
    scientificName: 'Digitalis purpurea',
    toxicTo: ['Dogs', 'Cats', 'Children'],
    severity: 'High',
    symptoms: ['Heart rhythm problems', 'Vomiting', 'Diarrhea', 'Weakness'],
    description: 'Beautiful flowering plant but highly toxic. Contains cardiac glycosides.',
  },
  {
    name: 'Sago Palm',
    scientificName: 'Cycas revoluta',
    toxicTo: ['Dogs', 'Cats', 'Children'],
    severity: 'High',
    symptoms: ['Liver failure', 'Vomiting', 'Diarrhea', 'Seizures'],
    description: 'Popular houseplant but extremely dangerous, especially seeds.',
  },
  {
    name: 'Azalea',
    scientificName: 'Rhododendron spp.',
    toxicTo: ['Dogs', 'Cats', 'Children'],
    severity: 'Medium',
    symptoms: ['Vomiting', 'Diarrhea', 'Weakness', 'Heart problems'],
    description: 'Common garden shrub containing grayanotoxins.',
  },
  {
    name: 'Lily (Easter, Tiger, Day)',
    scientificName: 'Lilium spp.',
    toxicTo: ['Cats'],
    severity: 'High',
    symptoms: ['Kidney failure', 'Vomiting', 'Loss of appetite'],
    description: 'Extremely toxic to cats. Even pollen can cause kidney failure.',
  },
  {
    name: 'Philodendron',
    scientificName: 'Philodendron spp.',
    toxicTo: ['Dogs', 'Cats', 'Children'],
    severity: 'Medium',
    symptoms: ['Mouth irritation', 'Difficulty swallowing', 'Vomiting'],
    description: 'Popular houseplant containing calcium oxalate crystals.',
  },
  {
    name: 'Pothos',
    scientificName: 'Epipremnum aureum',
    toxicTo: ['Dogs', 'Cats', 'Children'],
    severity: 'Medium',
    symptoms: ['Mouth irritation', 'Difficulty swallowing', 'Vomiting'],
    description: 'Common trailing houseplant, mildly toxic when ingested.',
  },
  {
    name: 'Dieffenbachia',
    scientificName: 'Dieffenbachia spp.',
    toxicTo: ['Dogs', 'Cats', 'Children'],
    severity: 'Medium',
    symptoms: ['Mouth swelling', 'Difficulty speaking', 'Drooling'],
    description: 'Also called "Dumb Cane" due to effects on speech.',
  },
];

export default function ToxicPlantsScreen({ navigation }: ToxicPlantsScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const insets = useSafeAreaInsets();

  const filteredPlants = toxicPlantsData.filter(plant =>
    plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plant.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-orange-600 bg-orange-100';
      case 'low':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
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
          <Text className="text-white text-xl font-semibold">Toxic Plants Guide</Text>
        </View>
        
        {/* Search Bar */}
        <View className="flex-row items-center bg-white rounded-lg px-3 py-2">
          <Ionicons name="search" size={20} color="#6b7280" />
          <TextInput
            placeholder="Search toxic plants..."
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
      </View>

      {/* Warning Banner */}
      <View className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-4 mt-4 rounded">
        <View className="flex-row items-center">
          <Ionicons name="warning" size={20} color="#f59e0b" />
          <Text className="font-semibold text-yellow-800 ml-2">Important Safety Notice</Text>
        </View>
        <Text className="text-yellow-700 text-sm mt-1">
          If ingestion occurs, contact your veterinarian or poison control immediately. 
          This list is not exhaustive - always research before bringing plants home.
        </Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {filteredPlants.map((plant, index) => (
          <View key={index} className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
            <View className="flex-row justify-between items-start mb-2">
              <View className="flex-1">
                <Text className="font-bold text-gray-800 text-lg">{plant.name}</Text>
                <Text className="text-gray-600 italic">{plant.scientificName}</Text>
              </View>
              <View className={`px-2 py-1 rounded-full ${getSeverityColor(plant.severity)}`}>
                <Text className={`text-xs font-semibold`}>
                  {plant.severity.toUpperCase()} RISK
                </Text>
              </View>
            </View>
            
            <Text className="text-gray-700 mb-3">{plant.description}</Text>
            
            <View className="mb-3">
              <Text className="font-semibold text-gray-800 mb-1">Toxic to:</Text>
              <View className="flex-row flex-wrap">
                {plant.toxicTo.map((target, idx) => (
                  <View key={idx} className="bg-red-100 rounded-full px-2 py-1 mr-2 mb-1">
                    <Text className="text-red-800 text-xs">{target}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View>
              <Text className="font-semibold text-gray-800 mb-1">Symptoms:</Text>
              <Text className="text-gray-600 text-sm">
                {plant.symptoms.join(', ')}
              </Text>
            </View>
          </View>
        ))}
        
        {filteredPlants.length === 0 && (
          <View className="items-center py-8">
            <Ionicons name="search-outline" size={48} color="#9ca3af" />
            <Text className="text-gray-500 mt-2">No plants found matching "{searchQuery}"</Text>
          </View>
        )}
      </ScrollView>

      {/* Emergency Contacts */}
      <View className="bg-white border-t border-gray-200 p-4">
        <Text className="font-semibold text-gray-800 mb-2">Emergency Contacts:</Text>
        <Text className="text-gray-600 text-sm">
          • Pet Poison Helpline: (855) 764-7661{'\n'}
          • ASPCA Animal Poison Control: (888) 426-4435{'\n'}
          • Poison Control Center: (800) 222-1222
        </Text>
      </View>
    </View>
  );
}