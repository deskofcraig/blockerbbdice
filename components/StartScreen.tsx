import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './ui/Card';
import Button from './ui/Button';

interface StartScreenProps {
  onStartGame: () => void;
}

export default function StartScreen({ onStartGame }: StartScreenProps) {
  return (
    <View style={styles.container}>
      <Card title="🏈 Blocker BBDice" variant="highlight">
        <View style={styles.content}>
          <Text style={styles.subtitle}>Blood Bowl 2020 Blocking & Fouling Assistant</Text>
          
          <View style={styles.description}>
            <Text style={styles.text}>
              Welcome to Blocker BBDice, your digital assistant for Blood Bowl blocking and fouling actions.
            </Text>
            
            <Text style={styles.text}>
              This app helps you complete the entire blocking and fouling procedure according to Blood Bowl 2020 rules, 
              from dice selection through injury resolution.
            </Text>
            
            <Text style={styles.features}>Features:</Text>
            <View style={styles.featureList}>
              <Text style={styles.feature}>• Accurate block dice with proper 6-sided distribution</Text>
              <Text style={styles.feature}>• Complete injury resolution system</Text>
              <Text style={styles.feature}>• Integrated skills and traits system</Text>
              <Text style={styles.feature}>• Comprehensive statistics tracking</Text>
              <Text style={styles.feature}>• Action history and logging</Text>
            </View>
          </View>
          
          <Button
            title="Start New Game"
            onPress={onStartGame}
            size="large"
            variant="success"
            style={styles.startButton}
          />
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  content: {
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#a3a3a3',
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  description: {
    marginBottom: 32,
  },
  text: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  features: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  featureList: {
    alignSelf: 'stretch',
  },
  feature: {
    fontSize: 14,
    color: '#d1d5db',
    marginBottom: 6,
    paddingLeft: 8,
  },
  startButton: {
    width: '100%',
    maxWidth: 300,
  },
});