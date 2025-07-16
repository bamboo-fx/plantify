import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlantStore } from '../state/plantStore';
import GradientBackground from '../components/GradientBackground';
import GlassCard from '../components/GlassCard';

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
      style={({ pressed }) => [
        {
          transform: [{ scale: pressed ? 0.98 : 1 }],
          opacity: pressed ? 0.9 : 1,
        }
      ]}
    >
      <GlassCard 
        variant="glass" 
        intensity={25}
        style={{ marginBottom: 12 }}
      >
        <View className="flex-row items-center">
          <View 
            className="w-12 h-12 rounded-full items-center justify-center mr-4" 
            style={{ 
              backgroundColor: color + '40',
              borderWidth: 1,
              borderColor: color + '60'
            }}
          >
            <Ionicons name={icon} size={26} color={color} />
          </View>
          <View className="flex-1">
            <Text className="font-bold text-white text-lg">{title}</Text>
            {subtitle && (
              <Text className="text-white/70 text-sm mt-1">{subtitle}</Text>
            )}
          </View>
          {badge !== undefined && badge > 0 && (
            <View 
              className="rounded-full w-7 h-7 items-center justify-center mr-3"
              style={{
                backgroundColor: '#ef4444',
                shadowColor: '#ef4444',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.5,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Text className="text-white text-xs font-bold">{badge}</Text>
            </View>
          )}
          <Ionicons name="chevron-forward" size={22} color="rgba(255, 255, 255, 0.6)" />
        </View>
      </GlassCard>
    </Pressable>
  );

  return (
    <GradientBackground variant="primary">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
        {/* Plant Care Section */}
        <Text className="text-xl font-bold text-white mb-4 mt-2">🌿 Plant Care</Text>
        
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
        <Text className="text-xl font-bold text-white mb-4 mt-8">🛠️ Plant Tools</Text>
        
        <MenuItem
          icon="text"
          title="Manual Plant Search"
          subtitle="Search plant by name without photo"
          onPress={() => navigation.navigate('ManualEntry')}
          color="#3b82f6"
        />
        
        <MenuItem
          icon="leaf"
          title="Weed Identifier"
          subtitle="Identify weeds in your garden"
          onPress={() => navigation.navigate('ComingSoon', {
            title: 'Weed Identifier',
            description: 'This feature will help you identify and manage weeds in your garden using AI-powered image recognition.',
            icon: 'leaf'
          })}
          color="#22c55e"
        />
        
        <MenuItem
          icon="calculator"
          title="Fertilizer Calculator"
          subtitle="Calculate the right amount for your plants"
          onPress={() => navigation.navigate('ComingSoon', {
            title: 'Fertilizer Calculator',
            description: 'Calculate the perfect fertilizer amounts and schedules for your plants based on their specific needs.',
            icon: 'calculator'
          })}
          color="#8b5cf6"
        />
        
        <MenuItem
          icon="calendar"
          title="Plant Calendar"
          subtitle="Seasonal care reminders"
          onPress={() => navigation.navigate('ComingSoon', {
            title: 'Plant Calendar',
            description: 'Get seasonal care reminders and track important plant care activities throughout the year.',
            icon: 'calendar'
          })}
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
        <Text className="text-xl font-bold text-white mb-4 mt-8">⚙️ Settings</Text>
        
        <Pressable
          onPress={() => setNotifications(!notifications)}
          style={({ pressed }) => [
            {
              transform: [{ scale: pressed ? 0.98 : 1 }],
              opacity: pressed ? 0.9 : 1,
            }
          ]}
        >
          <GlassCard 
            variant="glass" 
            intensity={25}
            style={{ marginBottom: 12 }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View 
                  className="w-12 h-12 rounded-full items-center justify-center mr-4"
                  style={{
                    backgroundColor: '#10b98140',
                    borderWidth: 1,
                    borderColor: '#10b98160'
                  }}
                >
                  <Ionicons name="notifications" size={26} color="#10b981" />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-white text-lg">Notifications</Text>
                  <Text className="text-white/70 text-sm">
                    {notifications ? 'Stay updated with plant care reminders' : 'Enable to get care reminders'}
                  </Text>
                </View>
              </View>
              <View 
                className={`w-14 h-8 rounded-full p-1 ${notifications ? 'bg-green-500' : 'bg-gray-500'}`}
                style={{
                  shadowColor: notifications ? '#10b981' : '#6b7280',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <View 
                  className={`w-6 h-6 rounded-full bg-white transition-transform ${
                    notifications ? 'translate-x-6' : 'translate-x-0'
                  }`}
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.2,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                />
              </View>
            </View>
          </GlassCard>
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
    </GradientBackground>
  );
}