import React, { useState, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Alert, Image } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import GlassButton from '../components/GlassButton';
import GradientBackground from '../components/GradientBackground';

interface ScanScreenProps {
  navigation: any;
}

export default function ScanScreen({ navigation }: ScanScreenProps) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const insets = useSafeAreaInsets();

  if (!permission) {
    return (
      <GradientBackground variant="primary">
        <View className="flex-1 justify-center items-center px-6">
          <BlurView intensity={20} style={{ borderRadius: 16, padding: 24, alignItems: 'center' }}>
            <Text className="text-white/80 text-lg">Loading camera...</Text>
          </BlurView>
        </View>
      </GradientBackground>
    );
  }

  if (!permission.granted) {
    return (
      <GradientBackground variant="primary">
        <View className="flex-1 justify-center items-center px-6">
          <BlurView 
            intensity={30} 
            style={{ 
              borderRadius: 20, 
              padding: 32, 
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.2)',
            }}
          >
            <LinearGradient
              colors={['rgba(34, 197, 94, 0.8)', 'rgba(16, 185, 129, 0.6)']}
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24,
              }}
            >
              <Ionicons name="camera-outline" size={40} color="white" />
            </LinearGradient>
            
            <Text className="text-white text-xl font-bold mb-3 text-center">
              Camera Access Needed
            </Text>
            <Text className="text-white/80 text-center mb-8 leading-6">
              We need camera access to identify plants from photos and help you discover the botanical world around you.
            </Text>
            
            <GlassButton
              title="Grant Permission"
              onPress={requestPermission}
              variant="accent"
              icon="camera"
              size="lg"
            />
          </BlurView>
        </View>
      </GradientBackground>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current) return;
    
    try {
      const photo = await (cameraRef.current as any).takePictureAsync({
        quality: 0.8,
        base64: false,
      });
      
      if (photo?.uri) {
        setCapturedImage(photo.uri);
        navigation.navigate('PlantResult', { imageUri: photo.uri });
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to capture image. Please try again.');
    }
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      navigation.navigate('PlantResult', { imageUri: result.assets[0].uri });
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash(current => !current);
  };

  return (
    <View className="flex-1 bg-black">
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing={facing}
        enableTorch={flash}
      >
        {/* Top Controls */}
        <View 
          className="absolute top-0 left-0 right-0 z-10 flex-row justify-between items-center px-4"
          style={{ paddingTop: insets.top + 10 }}
        >
          <Pressable
            onPress={toggleFlash}
            style={({ pressed }) => [
              {
                transform: [{ scale: pressed ? 0.95 : 1 }],
                opacity: pressed ? 0.8 : 1,
              }
            ]}
          >
            <BlurView 
              intensity={30} 
              style={{
                borderRadius: 20,
                padding: 12,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.2)',
              }}
            >
              <Ionicons
                name={flash ? 'flash' : 'flash-off'}
                size={24}
                color={flash ? '#3b82f6' : 'white'}
              />
            </BlurView>
          </Pressable>
          
          <BlurView 
            intensity={30} 
            style={{
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.2)',
            }}
          >
            <LinearGradient
              colors={['rgba(34, 197, 94, 0.8)', 'rgba(16, 185, 129, 0.6)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ borderRadius: 16, paddingHorizontal: 8, paddingVertical: 4 }}
            >
              <Text className="text-white font-semibold text-sm">🌿 Point at a plant</Text>
            </LinearGradient>
          </BlurView>
          
          <Pressable
            onPress={toggleCameraFacing}
            style={({ pressed }) => [
              {
                transform: [{ scale: pressed ? 0.95 : 1 }],
                opacity: pressed ? 0.8 : 1,
              }
            ]}
          >
            <BlurView 
              intensity={30} 
              style={{
                borderRadius: 20,
                padding: 12,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.2)',
              }}
            >
              <Ionicons name="camera-reverse" size={24} color="white" />
            </BlurView>
          </Pressable>
        </View>

        {/* Bottom Controls */}
        <View className="absolute bottom-0 left-0 right-0 z-10 pb-8">
          <View className="flex-row justify-center items-center px-8">
            {/* Gallery Button */}
            <Pressable
              onPress={pickFromGallery}
              style={({ pressed }) => [
                {
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                  opacity: pressed ? 0.8 : 1,
                  marginRight: 16
                }
              ]}
            >
              <BlurView 
                intensity={40} 
                style={{
                  borderRadius: 20,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                }}
              >
                <Ionicons name="images" size={24} color="white" />
              </BlurView>
            </Pressable>

            {/* Manual Entry Button */}
            <Pressable
              onPress={() => navigation.navigate('ManualEntry')}
              style={({ pressed }) => [
                {
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                  opacity: pressed ? 0.8 : 1,
                  marginRight: 16
                }
              ]}
            >
              <BlurView 
                intensity={40} 
                style={{
                  borderRadius: 20,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                }}
              >
                <Ionicons name="text" size={24} color="white" />
              </BlurView>
            </Pressable>

            {/* Capture Button */}
            <Pressable
              onPress={takePicture}
              style={({ pressed }) => [
                {
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                  opacity: pressed ? 0.9 : 1,
                }
              ]}
            >
              <LinearGradient
                colors={['#22c55e', '#16a34a', '#15803d']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 3,
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                }}
              >
                <BlurView 
                  intensity={20} 
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    borderWidth: 3,
                    borderColor: 'rgba(255, 255, 255, 0.8)',
                  }}
                />
              </LinearGradient>
            </Pressable>

            {/* Info Button */}
            <Pressable
              onPress={() => {
                Alert.alert(
                  '📸 Camera Tips',
                  '🌿 Hold camera steady\n☀️ Ensure good lighting\n🍃 Focus on leaves or flowers\n📏 Get close to the plant\n🚫 Avoid shadows',
                  [{ text: 'Got it! 👍' }]
                );
              }}
              style={({ pressed }) => [
                {
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                  opacity: pressed ? 0.8 : 1,
                  marginLeft: 16
                }
              ]}
            >
              <BlurView 
                intensity={40} 
                style={{
                  borderRadius: 20,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                }}
              >
                <Ionicons name="information-circle" size={24} color="white" />
              </BlurView>
            </Pressable>
          </View>

          {/* Instructions */}
          <View className="mt-6 px-8">
            <BlurView 
              intensity={30} 
              style={{
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.2)',
              }}
            >
              <Text className="text-white text-center text-sm font-medium">
                📷 Take a photo • 🖼️ Choose from gallery • ✍️ Search by name
              </Text>
            </BlurView>
          </View>
        </View>

        {/* Focus Grid (optional visual aid) */}
        <View className="absolute inset-0 z-5 flex justify-center items-center pointer-events-none">
          <LinearGradient
            colors={['rgba(34, 197, 94, 0.3)', 'rgba(16, 185, 129, 0.25)', 'rgba(5, 150, 105, 0.2)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 280,
              height: 280,
              borderRadius: 20,
              borderWidth: 2,
              borderColor: 'rgba(255, 255, 255, 0.4)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View 
              style={{
                width: 240,
                height: 240,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderStyle: 'dashed',
              }}
            />
          </LinearGradient>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});