import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GradientBackground from '../components/GradientBackground';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';

interface AuthScreenProps {
  onAuthComplete: () => void;
}

export default function AuthScreen({ onAuthComplete }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Info', 'Please enter both email and password.');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }

    setIsLoading(true);

    // Mock authentication delay
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Welcome to Plantify! 🌿',
        `${isLogin ? 'Logged in' : 'Account created'} successfully! Ready to identify some plants?`,
        [{ text: 'Let\'s Go! 🚀', onPress: onAuthComplete }]
      );
    }, 1500);
  };

  const handleDemo = () => {
    Alert.alert(
      'Demo Mode 🌱',
      'Explore Plantify without an account! You can identify plants, chat with our AI expert, and see how everything works.',
      [{ text: 'Start Exploring! 📷', onPress: onAuthComplete }]
    );
  };

  return (
    <GradientBackground variant="primary">
      <View className="flex-1 justify-center px-6" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
        
        {/* Header */}
        <View className="items-center mb-8">
          <View className="w-20 h-20 bg-green-500 rounded-full items-center justify-center mb-4">
            <Text className="text-4xl">🐵</Text>
          </View>
          <Text className="text-3xl font-bold text-white mb-2">Plantify</Text>
          <Text className="text-white/80 text-center">
            AI-powered plant identification
          </Text>
        </View>

        {/* Auth Mode Toggle */}
        <View className="flex-row mb-6">
          <Pressable
            onPress={() => setIsLogin(true)}
            className="flex-1 mr-2"
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.8 : 1,
              }
            ]}
          >
            <LinearGradient
              colors={isLogin ? ['#059669', '#10b981'] : ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: 'center',
              }}
            >
              <Text className="text-white font-bold">Sign In</Text>
            </LinearGradient>
          </Pressable>
          
          <Pressable
            onPress={() => setIsLogin(false)}
            className="flex-1 ml-2"
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.8 : 1,
              }
            ]}
          >
            <LinearGradient
              colors={!isLogin ? ['#059669', '#10b981'] : ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: 'center',
              }}
            >
              <Text className="text-white font-bold">Sign Up</Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/* Email Input */}
        <View className="mb-4">
          <Text className="text-white/80 font-medium mb-2">Email</Text>
          <View 
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.3)',
              paddingHorizontal: 16,
              paddingVertical: 14,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Ionicons name="mail" size={20} color="white" />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              style={{
                flex: 1,
                color: 'white',
                fontSize: 16,
                marginLeft: 12,
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Password Input */}
        <View className="mb-4">
          <Text className="text-white/80 font-medium mb-2">Password</Text>
          <View 
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.3)',
              paddingHorizontal: 16,
              paddingVertical: 14,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Ionicons name="lock-closed" size={20} color="white" />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              style={{
                flex: 1,
                color: 'white',
                fontSize: 16,
                marginLeft: 12,
              }}
              secureTextEntry
            />
          </View>
        </View>

        {/* Confirm Password (Sign Up Only) */}
        {!isLogin && (
          <View className="mb-6">
            <Text className="text-white/80 font-medium mb-2">Confirm Password</Text>
            <View 
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.3)',
                paddingHorizontal: 16,
                paddingVertical: 14,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Ionicons name="shield-checkmark" size={20} color="white" />
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                style={{
                  flex: 1,
                  color: 'white',
                  fontSize: 16,
                  marginLeft: 12,
                }}
                secureTextEntry
              />
            </View>
          </View>
        )}

        {/* Auth Button */}
        <Pressable
          onPress={handleAuth}
          disabled={isLoading}
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.9 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            }
          ]}
        >
          <LinearGradient
            colors={['#059669', '#10b981', '#22c55e']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              paddingVertical: 16,
              borderRadius: 14,
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <Text className="text-white font-bold text-lg">
              {isLoading ? '🌱 Please wait...' : (isLogin ? '🌿 Sign In' : '🌱 Create Account')}
            </Text>
          </LinearGradient>
        </Pressable>

        {/* Demo Button */}
        <Pressable
          onPress={handleDemo}
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.8 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            }
          ]}
        >
          <View 
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.3)',
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <Text className="text-white font-semibold">
              🚀 Try Demo Mode
            </Text>
          </View>
        </Pressable>

        {/* Footer */}
        <Text className="text-white/60 text-center text-xs">
          By continuing, you agree to our Terms & Privacy Policy
        </Text>
      </View>
    </GradientBackground>
  );
} 