import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlantStore } from '../state/plantStore';
import { PlantIdentification } from '../types/plant';

interface HistoryScreenProps {
  navigation: any;
}

export default function HistoryScreen({ navigation }: HistoryScreenProps) {
  const { identifications, removeIdentification } = usePlantStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIdentifications = identifications.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderIdentificationCard = ({ item }: { item: PlantIdentification }) => {
    const confidenceColor = 
      item.confidence >= 0.8 ? 'text-green-600' :
      item.confidence >= 0.6 ? 'text-yellow-600' :
      'text-red-600';

    return (
      <Pressable
        onPress={() => navigation.navigate('PlantResult', { 
          imageUri: item.imageUri,
          identificationData: item 
        })}
        className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 overflow-hidden"
      >
        <View className="flex-row">
          <Image
            source={{ uri: item.imageUri }}
            className="w-20 h-20"
            resizeMode="cover"
          />
          <View className="flex-1 p-4">
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Text className="font-semibold text-gray-800 text-lg">
                  {item.name}
                </Text>
                <Text className="text-gray-600 italic text-sm">
                  {item.scientificName}
                </Text>
                <Text className="text-gray-500 text-xs mt-1">
                  {item.createdAt.toLocaleDateString()} • {item.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
              
              <View className="items-end">
                <Text className={`font-medium text-sm ${confidenceColor}`}>
                  {Math.round(item.confidence * 100)}% match
                </Text>
                <Pressable
                  onPress={() => removeIdentification(item.id)}
                  className="mt-2 p-1"
                >
                  <Ionicons name="trash-outline" size={16} color="#ef4444" />
                </Pressable>
              </View>
            </View>
            
            {item.family && (
              <View className="flex-row items-center mt-2">
                <Text className="text-gray-500 text-xs">
                  Family: {item.family}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Search Bar */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
          <Ionicons name="search" size={20} color="#6b7280" />
          <TextInput
            placeholder="Search plant identifications..."
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

      {filteredIdentifications.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons 
            name={searchQuery ? "search-outline" : "camera-outline"} 
            size={64} 
            color="#9ca3af" 
          />
          <Text className="text-xl font-semibold text-gray-800 mt-4 text-center">
            {searchQuery ? 'No Results Found' : 'No Scan History'}
          </Text>
          <Text className="text-gray-600 text-center mt-2">
            {searchQuery 
              ? `No plants found matching "${searchQuery}"`
              : 'Your plant identification history will appear here'
            }
          </Text>
          {!searchQuery && (
            <Pressable
              onPress={() => navigation.navigate('Scan')}
              className="bg-green-600 px-6 py-3 rounded-lg mt-6"
            >
              <Text className="text-white font-semibold">Scan Your First Plant</Text>
            </Pressable>
          )}
        </View>
      ) : (
        <>
          <FlatList
            data={filteredIdentifications}
            renderItem={renderIdentificationCard}
            keyExtractor={(item) => item.id}
            className="flex-1"
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
          />
          
          <View className="bg-white px-4 py-3 border-t border-gray-200">
            <Text className="text-center text-gray-500 text-sm">
              {filteredIdentifications.length} identification{filteredIdentifications.length !== 1 ? 's' : ''}
              {searchQuery && ` matching "${searchQuery}"`}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}