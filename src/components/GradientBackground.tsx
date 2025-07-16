import React from 'react';
import { View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientBackgroundProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'dark';
  style?: ViewStyle;
  className?: string;
}

export default function GradientBackground({ 
  children, 
  variant = 'primary', 
  style, 
  className = '' 
}: GradientBackgroundProps) {
  const gradients = {
    primary: [
      '#374151', // gray 700
      '#4b5563', // gray 600
      '#6b7280', // gray 500
      '#9ca3af'  // gray 400
    ],
    secondary: [
      '#374151', // gray 700
      '#4b5563', // gray 600
      '#6b7280', // gray 500
      '#9ca3af'  // gray 400
    ],
    accent: [
      '#374151', // gray 700
      '#4b5563', // gray 600
      '#6b7280', // gray 500
      '#9ca3af'  // gray 400
    ],
    neutral: [
      '#f8fafc', // slate 50
      '#f1f5f9', // slate 100
      '#e2e8f0', // slate 200
      '#cbd5e1'  // slate 300
    ],
    dark: [
      '#374151', // gray 700
      '#4b5563', // gray 600
      '#6b7280', // gray 500
      '#9ca3af'  // gray 400
    ]
  };

  return (
    <LinearGradient
      colors={gradients[variant]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[{ flex: 1 }, style]}
      className={className}
    >

      
      {/* Content */}
      <View style={{ flex: 1, zIndex: 1 }}>
        {children}
      </View>
    </LinearGradient>
  );
} 