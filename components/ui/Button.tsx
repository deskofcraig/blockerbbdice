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
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 44, // Touch target size
      ...style
    };

    // Size styles
    switch (size) {
      case 'small':
        return { ...baseStyle, paddingHorizontal: 12, paddingVertical: 8, minHeight: 36 };
      case 'large':
        return { ...baseStyle, paddingHorizontal: 24, paddingVertical: 16, minHeight: 52 };
      default:
        return { ...baseStyle, paddingHorizontal: 16, paddingVertical: 12 };
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontWeight: '600',
      textAlign: 'center',
      ...textStyle
    };

    switch (size) {
      case 'small':
        return { ...baseTextStyle, fontSize: 14 };
      case 'large':
        return { ...baseTextStyle, fontSize: 18 };
      default:
        return { ...baseTextStyle, fontSize: 16 };
    }
  };

  return (
    <TouchableOpacity
      style={[
        getButtonStyle(),
        styles[variant],
        disabled && styles.disabled
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[getTextStyle(), styles[`${variant}Text`], disabled && styles.disabledText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primary: {
    backgroundColor: '#8B0000', // blood-red
    borderWidth: 2,
    borderColor: '#A52A2A',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondary: {
    backgroundColor: '#2E7D32', // field-green
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  danger: {
    backgroundColor: '#D32F2F',
    borderWidth: 2,
    borderColor: '#F44336',
  },
  dangerText: {
    color: '#FFFFFF',
  },
  success: {
    backgroundColor: '#388E3C',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  successText: {
    color: '#FFFFFF',
  },
  disabled: {
    backgroundColor: '#CCCCCC',
    borderColor: '#999999',
  },
  disabledText: {
    color: '#666666',
  },
});