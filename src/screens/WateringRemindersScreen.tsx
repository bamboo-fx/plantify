import React from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePlantStore } from '../state/plantStore';
import { WateringReminder } from '../types/plant';

interface WateringRemindersScreenProps {
  navigation: any;
}

export default function WateringRemindersScreen({ navigation }: WateringRemindersScreenProps) {
  const { wateringReminders, completeWatering } = usePlantStore();
  const insets = useSafeAreaInsets();

  const upcomingReminders = wateringReminders.filter(r => !r.completed);
  const completedReminders = wateringReminders.filter(r => r.completed);

  const handleCompleteWatering = (plantId: string) => {
    completeWatering(plantId);
  };

  const renderReminderCard = ({ item }: { item: WateringReminder }) => {
    const isOverdue = item.dueDate < new Date();
    const daysUntilDue = Math.ceil((item.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    return (
      <View className="bg-white rounded-lg p-4 mb-3 border border-gray-200">
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="font-semibold text-gray-800 text-lg">
              {item.plantName}
            </Text>
            <Text className={`text-sm ${
              isOverdue ? 'text-red-600' : 
              daysUntilDue <= 1 ? 'text-orange-600' : 
              'text-gray-600'
            }`}>
              {isOverdue 
                ? `Overdue by ${Math.abs(daysUntilDue)} day${Math.abs(daysUntilDue) !== 1 ? 's' : ''}`
                : daysUntilDue === 0 
                ? 'Due today'
                : `Due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}`
              }
            </Text>
            <Text className="text-gray-500 text-sm mt-1">
              Every {item.frequency} days
            </Text>
          </View>
          
          {!item.completed && (
            <Pressable
              onPress={() => handleCompleteWatering(item.plantId)}
              className={`px-4 py-2 rounded-lg ${
                isOverdue ? 'bg-red-600' : 'bg-blue-600'
              }`}
            >
              <Text className="text-white font-medium">Water Now</Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View 
        className="bg-blue-600 px-4 pb-4"
        style={{ paddingTop: insets.top + 10 }}
      >
        <View className="flex-row items-center">
          <Pressable
            onPress={() => navigation.goBack()}
            className="mr-4 p-2"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
          <Text className="text-white text-xl font-semibold">Watering Reminders</Text>
        </View>
      </View>

      {upcomingReminders.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="water-outline" size={64} color="#9ca3af" />
          <Text className="text-xl font-semibold text-gray-800 mt-4 text-center">
            No Watering Reminders
          </Text>
          <Text className="text-gray-600 text-center mt-2">
            Add plants to your collection to set up watering reminders
          </Text>
          <Pressable
            onPress={() => navigation.navigate('Main', { screen: 'Collection' })}
            className="bg-blue-600 px-6 py-3 rounded-lg mt-6"
          >
            <Text className="text-white font-semibold">View Collection</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={upcomingReminders}
          renderItem={renderReminderCard}
          keyExtractor={(item) => item.id}
          className="flex-1"
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}