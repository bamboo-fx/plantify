import React from 'react';
import { View, Text, FlatList, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlantStore } from '../state/plantStore';
import { PlantIdentification } from '../types/plant';
import GradientBackground from '../components/GradientBackground';
import GlassCard from '../components/GlassCard';

interface CollectionScreenProps {
  navigation: any;
}

export default function CollectionScreen({ navigation }: CollectionScreenProps) {
  const { identifications, wateringReminders } = usePlantStore();

  const getUpcomingReminders = () => {
    const today = new Date();
    return wateringReminders.filter(reminder => 
      !reminder.completed && 
      reminder.dueDate <= new Date(today.getTime() + 24 * 60 * 60 * 1000)
    ).length;
  };

  const renderPlantCard = ({ item }: { item: PlantIdentification }) => {
    return (
      <Pressable
        onPress={() => navigation.navigate('PlantResult', { imageUri: item.imageUri })}
        style={({ pressed }) => [
          {
            transform: [{ scale: pressed ? 0.98 : 1 }],
            opacity: pressed ? 0.9 : 1,
            marginBottom: 16,
          }
        ]}
      >
        <View className="flex-row">
          <Image
            source={{ uri: item.imageUri || 'https://via.placeholder.com/100' }}
            className="w-20 h-20 rounded-lg"
            resizeMode="cover"
          />
          <View className="flex-1 p-4">
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Text className="font-bold text-white text-lg">
                  {item.name}
                </Text>
                <Text className="text-white/70 text-sm italic">
                  {item.scientificName}
                </Text>
                {item.family && (
                  <Text className="text-white/60 text-xs mt-1">
                    Family: {item.family}
                  </Text>
                )}
              </View>
              
              <View className="items-end">
                <View className={`px-3 py-1 rounded-full ${
                  item.confidence >= 0.8 ? 'bg-green-500/80' :
                  item.confidence >= 0.6 ? 'bg-yellow-500/80' :
                  'bg-orange-500/80'
                }`}>
                  <Text className="text-xs font-bold text-white">
                    {Math.round(item.confidence * 100)}% match
                  </Text>
                </View>
              </View>
            </View>
            
            <View className="flex-row justify-between items-center mt-3">
              <Text className="text-white/60 text-sm">
                📅 Identified {item.createdAt.toLocaleDateString()}
              </Text>
              <Text className="text-white/60 text-sm">
                🕐 {item.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  const upcomingReminders = getUpcomingReminders();

  return (
    <GradientBackground variant="primary">
      {identifications.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <GlassCard variant="glass" style={{ alignItems: 'center' }}>
            <Ionicons name="leaf-outline" size={80} color="rgba(34, 197, 94, 0.8)" />
            <Text className="text-2xl font-bold text-white mt-6 text-center">
              🔍 No Plants Identified Yet
            </Text>
            <Text className="text-white/80 text-center mt-3 mb-8 text-lg leading-6">
              Start identifying plants around you to see them in your collection
            </Text>
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
                <Text className="text-white font-bold text-lg">📷 Identify Your First Plant</Text>
              </GlassCard>
            </Pressable>
          </GlassCard>
        </View>
      ) : (
        <>
          {upcomingReminders > 0 && (
            <View className="px-4 py-3">
              <Pressable
                onPress={() => navigation.navigate('WateringReminders')}
                style={({ pressed }) => [
                  {
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                    opacity: pressed ? 0.9 : 1,
                  }
                ]}
              >
                <GlassCard variant="accent" style={{ marginBottom: 0 }}>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Ionicons name="water" size={20} color="white" />
                      <Text className="text-white font-bold ml-2">
                        💧 {upcomingReminders} plant{upcomingReminders !== 1 ? 's' : ''} need{upcomingReminders === 1 ? 's' : ''} water
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="white" />
                  </View>
                </GlassCard>
              </Pressable>
            </View>
          )}
          
          <FlatList
            data={identifications}
            renderItem={renderPlantCard}
            keyExtractor={(item) => item.id}
            className="flex-1"
            contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}

      {identifications.length > 0 && (
        <View className="p-4 pb-8">
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
              <View className="flex-row items-center justify-center">
                <Ionicons name="add" size={20} color="white" />
                <Text className="text-white font-bold ml-2">🔍 Identify Another Plant</Text>
              </View>
            </GlassCard>
          </Pressable>
        </View>
      )}
    </GradientBackground>
  );
}