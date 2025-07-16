import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  contentStyle?: ViewStyle;
}

export default function Card({ 
  title, 
  children, 
  style,
  titleStyle,
  contentStyle
}: CardProps) {
  return (
    <View style={[styles.card, style]}>
      {title && (
        <View style={styles.header}>
          <Text style={[styles.title, titleStyle]}>{title}</Text>
        </View>
      )}
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F5F5DC', // parchment
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CD7F32', // bronze
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    margin: 8,
  },
  header: {
    backgroundColor: '#CD7F32', // bronze
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  content: {
    padding: 16,
  },
});