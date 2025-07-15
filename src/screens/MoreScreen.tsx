import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlantStore } from '../state/plantStore';

interface MoreScreenProps {
  navigation: any;
}

export default function MoreScreen({ navigation }: MoreScreenProps) {
  const { userPlants, wateringReminders, notifications, setNotifications } = usePlantStore();

  const upcomingReminders = wateringReminders.filter(r => 
    !r.completed && r.dueDate <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  ).length;

  const MenuItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    badge, 
    color = '#16a34a' 
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    onPress: () => void;
    badge?: number;
    color?: string;
  }) => (
    <Pressable
      onPress={onPress}
      className="bg-white rounded-lg p-4 mb-3 flex-row items-center border border-gray-200"
    >
      <View className="w-10 h-10 rounded-full items-center justify-center mr-4" style={{ backgroundColor: `${color}20` }}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View className="flex-1">
        <Text className="font-semibold text-gray-800 text-lg">{title}</Text>
        {subtitle && (
          <Text className="text-gray-600 text-sm mt-1">{subtitle}</Text>
        )}
      </View>
      {badge !== undefined && badge > 0 && (
        <View className="bg-red-500 rounded-full w-6 h-6 items-center justify-center mr-2">
          <Text className="text-white text-xs font-bold">{badge}</Text>
        </View>
      )}
      <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
    </Pressable>
  );

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Plant Care Section */}
        <Text className="text-lg font-bold text-gray-800 mb-3">Plant Care</Text>
        
        <MenuItem
          icon="water"
          title="Watering Reminders"
          subtitle={`${upcomingReminders} upcoming reminder${upcomingReminders !== 1 ? 's' : ''}`}
          onPress={() => navigation.navigate('WateringReminders')}
          badge={upcomingReminders}
          color="#3b82f6"
        />
        
        <MenuItem
          icon="sunny"
          title="Light Tracker"
          subtitle="Monitor your plants' light exposure"
          onPress={() => navigation.navigate('LightTracker')}
          color="#f59e0b"
        />
        
        <MenuItem
          icon="medical"
          title="Plant Disease Guide"
          subtitle="Common diseases and treatments"
          onPress={() => navigation.navigate('DiseaseGuide')}
          color="#dc2626"
        />
        
        <MenuItem
          icon="warning"
          title="Toxic Plants Database"
          subtitle="Keep your family and pets safe"
          onPress={() => navigation.navigate('ToxicPlants')}
          color="#f97316"
        />

        {/* Tools Section */}
        <Text className="text-lg font-bold text-gray-800 mb-3 mt-6">Plant Tools</Text>
        
        <MenuItem
          icon="leaf"
          title="Weed Identifier"
          subtitle="Identify weeds in your garden"
          onPress={() => navigation.navigate('WeedIdentifier')}
          color="#22c55e"
        />
        
        <MenuItem
          icon="calculator"
          title="Fertilizer Calculator"
          subtitle="Calculate the right amount for your plants"
          onPress={() => navigation.navigate('FertilizerCalculator')}
          color="#8b5cf6"
        />
        
        <MenuItem
          icon="calendar"
          title="Plant Calendar"
          subtitle="Seasonal care reminders"
          onPress={() => navigation.navigate('PlantCalendar')}
          color="#06b6d4"
        />

        {/* Statistics Section */}
        <Text className="text-lg font-bold text-gray-800 mb-3 mt-6">Your Stats</Text>
        
        <View className="bg-white rounded-lg p-4 mb-3 border border-gray-200">
          <Text className="font-semibold text-gray-800 text-lg mb-3">Plant Collection</Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-600">{userPlants.length}</Text>
              <Text className="text-gray-600 text-sm">Plants</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-blue-600">
                {userPlants.filter(p => p.healthStatus === 'healthy').length}
              </Text>
              <Text className="text-gray-600 text-sm">Healthy</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-yellow-600">
                {userPlants.filter(p => p.healthStatus === 'needs-attention').length}
              </Text>
              <Text className="text-gray-600 text-sm">Attention</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-red-600">
                {userPlants.filter(p => p.healthStatus === 'sick').length}
              </Text>
              <Text className="text-gray-600 text-sm">Sick</Text>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <Text className="text-lg font-bold text-gray-800 mb-3 mt-6">Settings</Text>
        
        <Pressable
          onPress={() => setNotifications(!notifications)}
          className="bg-white rounded-lg p-4 mb-3 flex-row items-center justify-between border border-gray-200"
        >
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full items-center justify-center mr-4 bg-green-100">
              <Ionicons name="notifications" size={24} color="#16a34a" />
            </View>
            <View>
              <Text className="font-semibold text-gray-800 text-lg">Notifications</Text>
              <Text className="text-gray-600 text-sm">
                {notifications ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
          </View>
          <View className={`w-12 h-6 rounded-full ${notifications ? 'bg-green-600' : 'bg-gray-300'}`}>
            <View className={`w-5 h-5 rounded-full bg-white mt-0.5 transition-transform ${
              notifications ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </View>
        </Pressable>
        
        <MenuItem
          icon="help-circle"
          title="Help & Support"
          subtitle="Get help using the app"
          onPress={() => navigation.navigate('Help')}
          color="#6366f1"
        />
        
        <MenuItem
          icon="information-circle"
          title="About"
          subtitle="App version and information"
          onPress={() => navigation.navigate('About')}
          color="#64748b"
        />
      </View>
    </ScrollView>
  );
}