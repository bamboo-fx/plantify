import React from 'react';
import { Pressable, Text, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'glass' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  className?: string;
}

export default function GlassButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  disabled = false,
  style,
  textStyle,
  className = ''
}: GlassButtonProps) {
  const gradients = {
    primary: ['#22c55e', '#16a34a', '#15803d'],
    secondary: ['#10b981', '#22c55e', '#16a34a'],
    accent: ['#059669', '#10b981', '#22c55e'],
    glass: ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)'],
    outline: ['transparent', 'transparent']
  };

  const sizes = {
    sm: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 14, iconSize: 16, borderRadius: 12 },
    md: { paddingVertical: 12, paddingHorizontal: 20, fontSize: 16, iconSize: 20, borderRadius: 14 },
    lg: { paddingVertical: 16, paddingHorizontal: 24, fontSize: 18, iconSize: 24, borderRadius: 16 }
  };

  const sizeConfig = sizes[size];
  const isGlass = variant === 'glass';
  const isOutline = variant === 'outline';

  const ButtonContent = () => (
    <LinearGradient
      colors={gradients[variant]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: sizeConfig.paddingVertical,
          paddingHorizontal: sizeConfig.paddingHorizontal,
          borderRadius: sizeConfig.borderRadius,
          opacity: disabled ? 0.5 : 1,
          ...(isOutline && {
            borderWidth: 2,
            borderColor: 'rgba(59, 130, 246, 0.5)',
            backgroundColor: 'transparent'
          })
        },
        style
      ]}
      className={className}
    >
      {icon && iconPosition === 'left' && (
        <Ionicons 
          name={icon} 
          size={sizeConfig.iconSize} 
          color={isGlass || isOutline ? '#1f2937' : 'white'} 
          style={{ marginRight: 8 }} 
        />
      )}
      <Text
        style={[
          {
            fontSize: sizeConfig.fontSize,
            fontWeight: '600',
            color: isGlass || isOutline ? '#1f2937' : 'white',
          },
          textStyle
        ]}
      >
        {title}
      </Text>
      {icon && iconPosition === 'right' && (
        <Ionicons 
          name={icon} 
          size={sizeConfig.iconSize} 
          color={isGlass || isOutline ? '#1f2937' : 'white'} 
          style={{ marginLeft: 8 }} 
        />
      )}
    </LinearGradient>
  );

  if (isGlass) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
          {
            transform: [{ scale: pressed ? 0.98 : 1 }],
            opacity: pressed ? 0.9 : 1,
          }
        ]}
      >
        <BlurView
          intensity={20}
          style={{
            borderRadius: sizeConfig.borderRadius,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.3)',
          }}
        >
          <ButtonContent />
        </BlurView>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          transform: [{ scale: pressed ? 0.98 : 1 }],
          opacity: pressed ? 0.9 : 1,
        }
      ]}
    >
      <ButtonContent />
    </Pressable>
  );
} 