import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlantStore } from '../state/plantStore';
import { PlantIdentification } from '../types/plant';
import GradientBackground from '../components/GradientBackground';
import GlassCard from '../components/GlassCard';

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
        style={({ pressed }) => [
          {
            transform: [{ scale: pressed ? 0.98 : 1 }],
            opacity: pressed ? 0.9 : 1,
          }
        ]}
      >
        <GlassCard variant="glass" style={{ marginBottom: 16 }}>
        <View className="flex-row">
          <Image
            source={{ uri: item.imageUri }}
            className="w-20 h-20"
            resizeMode="cover"
          />
          <View className="flex-1 p-4">
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Text className="font-bold text-white text-lg">
                  {item.name}
                </Text>
                <Text className="text-white/80 italic text-sm">
                  {item.scientificName}
                </Text>
                <Text className="text-white/60 text-xs mt-1">
                  📅 {item.createdAt.toLocaleDateString()} • 🕐 {item.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
              
              <View className="items-end">
                <Text className={`font-bold text-sm ${
                  item.confidence >= 0.8 ? 'text-green-400' :
                  item.confidence >= 0.6 ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
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
                <Text className="text-white/60 text-xs">
                  🌿 Family: {item.family}
                </Text>
              </View>
            )}
          </View>
        </View>
        </GlassCard>
      </Pressable>
    );
  };

  return (
    <GradientBackground variant="primary">
      {/* Search Bar */}
      <View className="px-4 py-3">
        <GlassCard variant="glass">
          <View className="flex-row items-center">
            <Ionicons name="search" size={20} color="rgba(255, 255, 255, 0.8)" />
            <TextInput
              placeholder="Search plant identifications..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 ml-2 text-white"
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="rgba(255, 255, 255, 0.8)" />
              </Pressable>
            )}
          </View>
        </GlassCard>
      </View>

      {filteredIdentifications.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <GlassCard variant="glass" style={{ alignItems: 'center' }}>
            <Ionicons 
              name={searchQuery ? "search-outline" : "camera-outline"} 
              size={64} 
              color="rgba(34, 197, 94, 0.8)" 
            />
            <Text className="text-xl font-bold text-white mt-4 text-center">
              {searchQuery ? '🔍 No Results Found' : '📷 No Scan History'}
            </Text>
            <Text className="text-white/80 text-center mt-2 mb-6">
              {searchQuery 
                ? `No plants found matching "${searchQuery}"`
                : 'Your plant identification history will appear here'
              }
            </Text>
            {!searchQuery && (
              <Pressable
                onPress={() => navigation.navigate('Scan')}
                style={({ pressed }) => [
                  {
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                    opacity: pressed ? 0.9 : 1,
                  }
                ]}
              >
                <GlassCard variant="solid" gradient="primary" style={{ marginBottom: 0 }}>
                  <Text className="text-white font-bold">📷 Scan Your First Plant</Text>
                </GlassCard>
              </Pressable>
            )}
          </GlassCard>
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
          
          <View className="px-4 py-3">
            <GlassCard variant="glass" style={{ marginBottom: 0 }}>
              <Text className="text-center text-white/80 text-sm">
                📊 {filteredIdentifications.length} identification{filteredIdentifications.length !== 1 ? 's' : ''}
                {searchQuery && ` matching "${searchQuery}"`}
              </Text>
            </GlassCard>
          </View>
        </>
      )}
    </GradientBackground>
  );
}