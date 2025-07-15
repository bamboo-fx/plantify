import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HelpScreenProps {
  navigation: any;
}

const faqData = [
  {
    question: 'How accurate is the plant identification?',
    answer: 'Our AI achieves 85-95% accuracy for common plants. Results depend on image quality, lighting, and how clear the plant features are visible. For best results, take clear photos of leaves, flowers, or distinctive plant parts.'
  },
  {
    question: 'Can I identify plants without taking photos?',
    answer: 'Yes! Use the Manual Entry feature to search for plants by name. You can enter common names (like "Snake Plant") or scientific names to get detailed care information.'
  },
  {
    question: 'What should I do if my plant looks sick?',
    answer: 'Take a clear photo of the affected areas and use our plant identification feature. The AI will check for common diseases and provide treatment recommendations. For serious issues, consult with local plant experts.'
  },
  {
    question: 'How do I get the best identification results?',
    answer: 'Take photos in good lighting, focus on distinctive features like leaves or flowers, get close to the plant, avoid shadows, and keep the camera steady. Multiple angles can help improve accuracy.'
  },
  {
    question: 'Are the care instructions personalized?',
    answer: 'Yes! Care instructions are tailored to each specific plant species, including watering schedules, light requirements, soil needs, and seasonal care tips.'
  },
  {
    question: 'How do I set up watering reminders?',
    answer: 'Add plants to your collection, and the app will suggest watering schedules based on the plant type. You can customize the frequency and receive notifications when it\'s time to water.'
  },
  {
    question: 'Is the plant toxicity information reliable?',
    answer: 'Our toxicity database is sourced from veterinary and poison control resources. However, if poisoning occurs, immediately contact your veterinarian or poison control center.'
  },
  {
    question: 'Can I use the app offline?',
    answer: 'Plant identification and expert chat require internet connection. However, your saved plant collection and care reminders work offline.'
  },
  {
    question: 'What types of plants can the app identify?',
    answer: 'The app can identify thousands of plant species including houseplants, garden plants, trees, flowers, succulents, herbs, and weeds. It works best with common cultivated plants.'
  },
  {
    question: 'How do I ask the expert for help?',
    answer: 'Go to the Expert Chat tab, type your question, and optionally attach a photo. The AI expert provides personalized advice based on your specific plant and situation.'
  }
];

export default function HelpScreen({ navigation }: HelpScreenProps) {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const insets = useSafeAreaInsets();

  const toggleExpanded = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
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
          <Text className="text-white text-xl font-semibold">Help & Support</Text>
        </View>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Quick Start Guide */}
        <View className="bg-white rounded-lg p-4 mb-4">
          <Text className="font-bold text-gray-800 text-lg mb-3">🚀 Quick Start Guide</Text>
          
          <View className="flex-row items-start mb-3">
            <Text className="text-green-600 font-bold mr-3">1.</Text>
            <Text className="text-gray-700 flex-1">
              <Text className="font-semibold">Identify Plants:</Text> Tap the camera icon, take a photo of your plant, or use manual search by name
            </Text>
          </View>
          
          <View className="flex-row items-start mb-3">
            <Text className="text-green-600 font-bold mr-3">2.</Text>
            <Text className="text-gray-700 flex-1">
              <Text className="font-semibold">Get Care Info:</Text> View detailed care instructions, toxicity warnings, and growing tips
            </Text>
          </View>
          
          <View className="flex-row items-start mb-3">
            <Text className="text-green-600 font-bold mr-3">3.</Text>
            <Text className="text-gray-700 flex-1">
              <Text className="font-semibold">Build Collection:</Text> Add plants to your personal collection with custom names and locations
            </Text>
          </View>
          
          <View className="flex-row items-start">
            <Text className="text-green-600 font-bold mr-3">4.</Text>
            <Text className="text-gray-700 flex-1">
              <Text className="font-semibold">Ask Expert:</Text> Chat with our AI expert for personalized plant care advice
            </Text>
          </View>
        </View>

        {/* FAQ Section */}
        <Text className="font-bold text-gray-800 text-lg mb-3">Frequently Asked Questions</Text>
        
        {faqData.map((faq, index) => (
          <View key={index} className="bg-white rounded-lg mb-2 border border-gray-200">
            <Pressable
              onPress={() => toggleExpanded(index)}
              className="p-4 flex-row items-center justify-between"
            >
              <Text className="font-semibold text-gray-800 flex-1 mr-3">
                {faq.question}
              </Text>
              <Ionicons 
                name={expandedItems.includes(index) ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#6b7280" 
              />
            </Pressable>
            
            {expandedItems.includes(index) && (
              <View className="px-4 pb-4 border-t border-gray-100">
                <Text className="text-gray-600 leading-relaxed mt-2">
                  {faq.answer}
                </Text>
              </View>
            )}
          </View>
        ))}

        {/* Contact Support */}
        <View className="bg-blue-50 rounded-lg p-4 mt-4 mb-4">
          <View className="flex-row items-center mb-2">
            <Ionicons name="mail" size={20} color="#3b82f6" />
            <Text className="font-semibold text-blue-800 ml-2">Still Need Help?</Text>
          </View>
          <Text className="text-blue-700 text-sm mb-3">
            Can't find what you're looking for? Our support team is here to help!
          </Text>
          <Text className="text-blue-600 text-sm font-medium">
            Email: support@plantcare-ai.com{'\n'}
            Response time: Within 24 hours
          </Text>
        </View>

        {/* Tips */}
        <View className="bg-green-50 rounded-lg p-4 mb-4">
          <Text className="font-semibold text-green-800 mb-2">💡 Pro Tips</Text>
          <Text className="text-green-700 text-sm mb-1">• Take photos in natural light for best identification results</Text>
          <Text className="text-green-700 text-sm mb-1">• Include flowers or fruit in photos when available</Text>
          <Text className="text-green-700 text-sm mb-1">• Use the expert chat for specific care questions</Text>
          <Text className="text-green-700 text-sm mb-1">• Check toxicity warnings before bringing new plants home</Text>
          <Text className="text-green-700 text-sm">• Set up watering reminders to keep plants healthy</Text>
        </View>
      </ScrollView>
    </View>
  );
}