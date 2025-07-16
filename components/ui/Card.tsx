import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'highlight' | 'warning' | 'success';
}

export default function Card({ title, children, style, variant = 'default' }: CardProps) {
  return (
    <View style={[styles.card, styles[variant], style]}>
      {title && (
        <Text style={[styles.title, styles[`${variant}Title`]]} accessibilityRole="header">
          {title}
        </Text>
      )}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  // Variants
  default: {
    backgroundColor: '#1a472a',
    borderColor: '#2d5a3d',
  },
  highlight: {
    backgroundColor: '#2d5a3d',
    borderColor: '#4a7c59',
  },
  warning: {
    backgroundColor: '#7c2d12',
    borderColor: '#ea580c',
  },
  success: {
    backgroundColor: '#166534',
    borderColor: '#22c55e',
  },
  
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  
  // Variant title colors
  defaultTitle: {
    color: '#ffffff',
  },
  highlightTitle: {
    color: '#ffffff',
  },
  warningTitle: {
    color: '#ffffff',
  },
  successTitle: {
    color: '#ffffff',
  },
  
  content: {
    flex: 1,
  },
});