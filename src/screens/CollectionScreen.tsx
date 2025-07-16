import React from 'react';
import { View, Text, FlatList, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlantStore } from '../state/plantStore';
import { UserPlant } from '../types/plant';
import GradientBackground from '../components/GradientBackground';
import GlassCard from '../components/GlassCard';

interface CollectionScreenProps {
  navigation: any;
}

export default function CollectionScreen({ navigation }: CollectionScreenProps) {
  const { userPlants, wateringReminders } = usePlantStore();

  const getUpcomingReminders = () => {
    const today = new Date();
    return wateringReminders.filter(reminder => 
      !reminder.completed && 
      reminder.dueDate <= new Date(today.getTime() + 24 * 60 * 60 * 1000)
    ).length;
  };

  const renderPlantCard = ({ item }: { item: UserPlant }) => {
    const needsWater = item.nextWateringDue && item.nextWateringDue <= new Date();
    const isOverdue = item.nextWateringDue && item.nextWateringDue < new Date();
    
    return (
      <Pressable
        onPress={() => navigation.navigate('PlantDetail', { plantId: item.id })}
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
            source={{ uri: item.photos[0] || 'https://via.placeholder.com/100' }}
            className="w-20 h-20"
            resizeMode="cover"
          />
          <View className="flex-1 p-4">
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Text className="font-bold text-white text-lg">
                  {item.nickname || 'My Plant'}
                </Text>
                <Text className="text-white/80 text-sm">
                  📍 {item.location}
                </Text>
              </View>
              
              <View className="flex-row items-center space-x-2">
                {needsWater && (
                  <View className={`px-3 py-1 rounded-full ${
                    isOverdue ? 'bg-red-500/80' : 'bg-blue-500/80'
                  }`}>
                    <Text className="text-xs font-bold text-white">
                      {isOverdue ? '💧 Overdue!' : '💧 Water today'}
                    </Text>
                  </View>
                )}
                
                <View className={`w-3 h-3 rounded-full ${
                  item.healthStatus === 'healthy' ? 'bg-green-400' :
                  item.healthStatus === 'needs-attention' ? 'bg-yellow-400' :
                  'bg-red-400'
                }`} />
              </View>
            </View>
            
            <View className="flex-row justify-between items-center mt-2">
              <Text className="text-white/60 text-sm">
                Added {item.dateAdded.toLocaleDateString()}
              </Text>
              {item.lastWatered && (
                <Text className="text-white/60 text-sm">
                  Last watered {Math.floor((Date.now() - item.lastWatered.getTime()) / (1000 * 60 * 60 * 24))}d ago
                </Text>
              )}
            </View>
          </View>
        </View>
        </GlassCard>
      </Pressable>
    );
  };

  const upcomingReminders = getUpcomingReminders();

  return (
    <GradientBackground variant="primary">
      {userPlants.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <GlassCard variant="glass" style={{ alignItems: 'center' }}>
            <Ionicons name="leaf-outline" size={80} color="rgba(34, 197, 94, 0.8)" />
            <Text className="text-2xl font-bold text-white mt-6 text-center">
              🌱 Start Your Plant Journey
            </Text>
            <Text className="text-white/80 text-center mt-3 mb-8 text-lg leading-6">
              Build your personal plant collection by scanning and identifying plants around you
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
                <Text className="text-white font-bold text-lg">📷 Scan Your First Plant</Text>
              </GlassCard>
            </Pressable>
          </GlassCard>
        </View>
      ) : (
        <View className="flex-1">
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
            data={userPlants}
            renderItem={renderPlantCard}
            keyExtractor={(item) => item.id}
            className="flex-1"
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      {userPlants.length > 0 && (
        <View className="p-4">
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
                <Text className="text-white font-bold ml-2">🌱 Add New Plant</Text>
              </View>
            </GlassCard>
          </Pressable>
        </View>
      )}
    </GradientBackground>
  );
}