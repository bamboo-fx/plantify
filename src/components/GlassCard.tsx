import React from 'react';
import { View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  className?: string;
  intensity?: number;
  gradient?: 'primary' | 'secondary' | 'accent' | 'neutral';
  variant?: 'glass' | 'solid' | 'gradient';
}

export default function GlassCard({ 
  children, 
  style, 
  className = '', 
  intensity = 20,
  gradient = 'neutral',
  variant = 'glass'
}: GlassCardProps) {
  const gradientColors = {
    primary: ['rgba(34, 197, 94, 0.15)', 'rgba(16, 185, 129, 0.1)', 'rgba(5, 150, 105, 0.08)'],
    secondary: ['rgba(34, 197, 94, 0.2)', 'rgba(16, 185, 129, 0.15)', 'rgba(5, 150, 105, 0.1)'],
    accent: ['rgba(34, 197, 94, 0.25)', 'rgba(16, 185, 129, 0.2)', 'rgba(5, 150, 105, 0.15)'],
    neutral: ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']
  };

  const solidGradients = {
    primary: ['#22c55e', '#16a34a', '#15803d'],
    secondary: ['#10b981', '#22c55e', '#16a34a'],
    accent: ['#059669', '#10b981', '#22c55e'],
    neutral: ['#f8fafc', '#e2e8f0']
  };

  if (variant === 'solid') {
    return (
      <LinearGradient
        colors={solidGradients[gradient]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          {
            borderRadius: 16,
            padding: 16,
          },
          style
        ]}
        className={className}
      >
        {children}
      </LinearGradient>
    );
  }

  if (variant === 'gradient') {
    return (
      <LinearGradient
        colors={gradientColors[gradient]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          {
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.2)',
          },
          style
        ]}
        className={className}
      >
        {children}
      </LinearGradient>
    );
  }

  // Glass variant (default)
  return (
    <BlurView
      intensity={intensity}
      style={[
        {
          borderRadius: 16,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.2)',
        },
        style
      ]}
      className={className}
    >
      <LinearGradient
        colors={gradientColors[gradient]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flex: 1,
          padding: 16,
        }}
      >
        {children}
      </LinearGradient>
    </BlurView>
  );
} 