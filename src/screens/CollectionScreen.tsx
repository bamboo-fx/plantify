import React from 'react';
import { View, Text, FlatList, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlantStore } from '../state/plantStore';
import { UserPlant } from '../types/plant';

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
        className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 overflow-hidden"
      >
        <View className="flex-row">
          <Image
            source={{ uri: item.photos[0] || 'https://via.placeholder.com/100' }}
            className="w-20 h-20"
            resizeMode="cover"
          />
          <View className="flex-1 p-4">
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Text className="font-semibold text-gray-800 text-lg">
                  {item.nickname || 'My Plant'}
                </Text>
                <Text className="text-gray-600 text-sm">
                  {item.location}
                </Text>
              </View>
              
              <View className="flex-row items-center space-x-2">
                {needsWater && (
                  <View className={`px-2 py-1 rounded-full ${
                    isOverdue ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    <Text className={`text-xs font-medium ${
                      isOverdue ? 'text-red-800' : 'text-blue-800'
                    }`}>
                      {isOverdue ? 'Overdue!' : 'Water today'}
                    </Text>
                  </View>
                )}
                
                <View className={`w-3 h-3 rounded-full ${
                  item.healthStatus === 'healthy' ? 'bg-green-500' :
                  item.healthStatus === 'needs-attention' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`} />
              </View>
            </View>
            
            <View className="flex-row justify-between items-center mt-2">
              <Text className="text-gray-500 text-sm">
                Added {item.dateAdded.toLocaleDateString()}
              </Text>
              {item.lastWatered && (
                <Text className="text-gray-500 text-sm">
                  Last watered {Math.floor((Date.now() - item.lastWatered.getTime()) / (1000 * 60 * 60 * 24))}d ago
                </Text>
              )}
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  const upcomingReminders = getUpcomingReminders();

  return (
    <View className="flex-1 bg-gray-50">
      {upcomingReminders > 0 && (
        <View className="bg-blue-600 px-4 py-3">
          <Pressable
            onPress={() => navigation.navigate('WateringReminders')}
            className="flex-row items-center justify-between"
          >
            <View className="flex-row items-center">
              <Ionicons name="water" size={20} color="white" />
              <Text className="text-white font-medium ml-2">
                {upcomingReminders} plant{upcomingReminders !== 1 ? 's' : ''} need{upcomingReminders === 1 ? 's' : ''} water
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="white" />
          </Pressable>
        </View>
      )}

      {userPlants.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="leaf-outline" size={64} color="#9ca3af" />
          <Text className="text-xl font-semibold text-gray-800 mt-4 text-center">
            No Plants Yet
          </Text>
          <Text className="text-gray-600 text-center mt-2">
            Start building your plant collection by scanning and identifying plants
          </Text>
          <Pressable
            onPress={() => navigation.navigate('Scan')}
            className="bg-green-600 px-6 py-3 rounded-lg mt-6"
          >
            <Text className="text-white font-semibold">Scan Your First Plant</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={userPlants}
          renderItem={renderPlantCard}
          keyExtractor={(item) => item.id}
          className="flex-1"
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {userPlants.length > 0 && (
        <View className="p-4 bg-white border-t border-gray-200">
          <Pressable
            onPress={() => navigation.navigate('Scan')}
            className="bg-green-600 py-3 rounded-lg flex-row items-center justify-center"
          >
            <Ionicons name="add" size={20} color="white" />
            <Text className="text-white font-semibold ml-2">Add New Plant</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}