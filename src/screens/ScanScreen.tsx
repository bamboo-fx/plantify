import React, { useState, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Alert, Image } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

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
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-gray-600">Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100 px-6">
        <Ionicons name="camera-outline" size={64} color="#9ca3af" />
        <Text className="text-lg font-semibold text-gray-800 mb-2 text-center">
          Camera Access Needed
        </Text>
        <Text className="text-gray-600 text-center mb-6">
          We need camera access to identify plants from photos
        </Text>
        <Pressable
          onPress={requestPermission}
          className="bg-green-600 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Grant Permission</Text>
        </Pressable>
      </View>
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
            className="bg-black/30 rounded-full p-3"
          >
            <Ionicons
              name={flash ? 'flash' : 'flash-off'}
              size={24}
              color="white"
            />
          </Pressable>
          
          <View className="bg-black/30 rounded-full px-4 py-2">
            <Text className="text-white font-medium">Point at a plant</Text>
          </View>
          
          <Pressable
            onPress={toggleCameraFacing}
            className="bg-black/30 rounded-full p-3"
          >
            <Ionicons name="camera-reverse" size={24} color="white" />
          </Pressable>
        </View>

        {/* Bottom Controls */}
        <View className="absolute bottom-0 left-0 right-0 z-10 pb-8">
          <View className="flex-row justify-center items-center px-8">
            {/* Gallery Button */}
            <Pressable
              onPress={pickFromGallery}
              className="bg-black/30 rounded-full p-4 mr-8"
            >
              <Ionicons name="images" size={28} color="white" />
            </Pressable>

            {/* Capture Button */}
            <Pressable
              onPress={takePicture}
              className="bg-white rounded-full p-2"
              style={styles.captureButton}
            >
              <View className="bg-white rounded-full w-16 h-16 border-4 border-gray-300" />
            </Pressable>

            {/* Info Button */}
            <Pressable
              onPress={() => navigation.navigate('ScanTips')}
              className="bg-black/30 rounded-full p-4 ml-8"
            >
              <Ionicons name="information-circle" size={28} color="white" />
            </Pressable>
          </View>

          {/* Instructions */}
          <View className="mt-4 px-8">
            <Text className="text-white text-center text-sm opacity-80">
              Position the plant clearly in the frame for best results
            </Text>
          </View>
        </View>

        {/* Focus Grid (optional visual aid) */}
        <View className="absolute inset-0 z-5 flex justify-center items-center pointer-events-none">
          <View 
            className="border-2 border-white/30 rounded-lg"
            style={{ width: 250, height: 250 }}
          />
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