import React, { useState, useRef } from 'react';
import { View, Text, FlatList, TextInput, Pressable, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ExpertChatMessage } from '../types/plant';
import { getExpertChatResponse } from '../services/expertChat';
import * as ImagePicker from 'expo-image-picker';
import GradientBackground from '../components/GradientBackground';
import GlassCard from '../components/GlassCard';

interface ExpertChatScreenProps {
  navigation: any;
  route?: {
    params?: {
      plantInfo?: any;
      imageUri?: string;
    };
  };
}

export default function ExpertChatScreen({ navigation, route }: ExpertChatScreenProps) {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<ExpertChatMessage[]>([
    {
      id: '1',
      role: 'expert',
      content: "Hi! I'm your AI plant expert. I can help you with plant identification, care advice, disease diagnosis, and any other plant-related questions. How can I assist you today?",
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const flatListRef = useRef<FlatList>(null);

  // If we came from a plant result, add initial context
  React.useEffect(() => {
    if (route?.params?.plantInfo && route?.params?.imageUri) {
      const contextMessage: ExpertChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: `I just identified this plant as ${route.params.plantInfo.name} (${route.params.plantInfo.scientificName}). Can you tell me more about caring for it?`,
        timestamp: new Date(),
        imageUri: route.params.imageUri,
      };
      setMessages(prev => [...prev, contextMessage]);
      handleSendMessage(contextMessage.content, route.params.imageUri, false);
    }
  }, []); // Empty dependency array to run only once on mount

  const handleSendMessage = async (text: string, imageUri?: string, addToMessages: boolean = true) => {
    if (!text.trim() && !imageUri) return;

    const userMessage: ExpertChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text || 'Please analyze this plant image',
      timestamp: new Date(),
      imageUri,
    };

    if (addToMessages) {
      setMessages(prev => [...prev, userMessage]);
    }
    setInputText('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      let base64Image: string | undefined;
      
      if (imageUri) {
        // Convert image to base64
        const response = await fetch(imageUri);
        const blob = await response.blob();
        base64Image = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
          };
          reader.readAsDataURL(blob);
        });
      }

      const responseContent = await getExpertChatResponse(
        text || 'Please analyze this plant image',
        base64Image
      );
      
      const expertMessage: ExpertChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'expert',
        content: responseContent,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, expertMessage]);
      
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);

    } catch (error) {
      console.error('Expert chat error:', error);
      const errorMessage: ExpertChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'expert',
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const renderMessage = ({ item }: { item: ExpertChatMessage }) => {
    const isUser = item.role === 'user';
    
    return (
      <View className={`mb-4 ${isUser ? 'items-end' : 'items-start'}`}>
        <GlassCard
          variant={isUser ? 'solid' : 'glass'}
          gradient={isUser ? 'primary' : 'neutral'}
          style={{ 
            maxWidth: '80%',
            marginBottom: 0,
          }}
        >
          {item.imageUri && (
            <Image
              source={{ uri: item.imageUri }}
              className="w-48 h-48 rounded-lg mb-3"
              resizeMode="cover"
            />
          )}
          <Text className={`${isUser ? 'text-white font-medium' : 'text-white'}`}>
            {item.content}
          </Text>
          <Text className={`text-xs mt-2 ${isUser ? 'text-white/80' : 'text-white/60'}`}>
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </GlassCard>
      </View>
    );
  };

  return (
    <GradientBackground variant="primary">
      <View className="flex-1">
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          className="flex-1"
          contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {isLoading && (
          <View className="px-4 py-2">
            <GlassCard 
              variant="glass" 
              style={{ maxWidth: '80%' }}
            >
              <Text className="text-white/80">🤖 Expert is typing...</Text>
            </GlassCard>
          </View>
        )}

        {selectedImage && (
          <View className="px-4 py-2">
            <GlassCard variant="glass">
              <View className="flex-row items-center">
                <Image
                  source={{ uri: selectedImage }}
                  className="w-12 h-12 rounded-lg mr-3"
                  resizeMode="cover"
                />
                <Text className="flex-1 text-white font-medium">📷 Image selected</Text>
                <Pressable
                  onPress={() => setSelectedImage(null)}
                  className="p-2"
                >
                  <Ionicons name="close" size={20} color="rgba(255, 255, 255, 0.8)" />
                </Pressable>
              </View>
            </GlassCard>
          </View>
        )}

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ paddingBottom: insets.bottom }}
        >
          <View className="p-4 pt-2 bg-gray-900/50 border-t border-white/10">
            <View className="flex-row items-end space-x-3">
              <View className="flex-1">
                <View 
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    minHeight: 50,
                  }}
                >
                  <View className="flex-row items-end">
                    <TextInput
                      value={inputText}
                      onChangeText={setInputText}
                      placeholder="Ask about plant care, diseases, identification..."
                      multiline
                      maxLength={500}
                      style={{
                        flex: 1,
                        color: 'white',
                        fontSize: 16,
                        maxHeight: 100,
                        minHeight: 20,
                      }}
                      placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    />
                    <Pressable
                      onPress={pickImage}
                      style={{
                        marginLeft: 8,
                        padding: 4,
                      }}
                    >
                      <Ionicons name="camera" size={24} color="rgba(255, 255, 255, 0.8)" />
                    </Pressable>
                  </View>
                </View>
              </View>
              
              <Pressable
                onPress={() => handleSendMessage(inputText, selectedImage || undefined)}
                disabled={!inputText.trim() && !selectedImage}
                style={({ pressed }) => [
                  {
                    transform: [{ scale: pressed ? 0.95 : 1 }],
                    opacity: pressed ? 0.8 : 1,
                    backgroundColor: (inputText.trim() || selectedImage) ? '#22c55e' : 'rgba(255, 255, 255, 0.2)',
                    borderRadius: 25,
                    width: 50,
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }
                ]}
              >
                <Ionicons 
                  name="send" 
                  size={24} 
                  color="white"
                />
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </GradientBackground>
  );
}