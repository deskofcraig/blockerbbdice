import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle
}: ButtonProps) {
  const buttonStyle = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    style
  ];

  const buttonTextStyle = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={disabled ? 'Button is disabled' : undefined}
    >
      <Text style={buttonTextStyle}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44, // Accessibility touch target
    borderWidth: 2,
  },
  
  // Variants
  primary: {
    backgroundColor: '#2d5a3d',
    borderColor: '#4a7c59',
  },
  secondary: {
    backgroundColor: '#374151',
    borderColor: '#6b7280',
  },
  danger: {
    backgroundColor: '#7f1d1d',
    borderColor: '#dc2626',
  },
  success: {
    backgroundColor: '#166534',
    borderColor: '#22c55e',
  },
  
  // Sizes
  small: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: 36,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 44,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    minHeight: 52,
  },
  
  // Disabled state
  disabled: {
    opacity: 0.5,
  },
  
  // Text styles
  text: {
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  
  // Variant text colors
  primaryText: {
    color: '#ffffff',
  },
  secondaryText: {
    color: '#ffffff',
  },
  dangerText: {
    color: '#ffffff',
  },
  successText: {
    color: '#ffffff',
  },
  
  // Size text styles
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  
  disabledText: {
    color: '#9ca3af',
  },
});