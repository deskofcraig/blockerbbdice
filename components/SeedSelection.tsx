import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './ui/Card';
import Button from './ui/Button';

interface SeedSelectionProps {
  seedWords: string[];
  onSelectSeed: (seed: string) => void;
}

export default function SeedSelection({ seedWords, onSelectSeed }: SeedSelectionProps) {
  return (
    <View style={styles.container}>
      <Card title="🎲 Select Seed Word" variant="highlight">
        <View style={styles.content}>
          <Text style={styles.description}>
            Choose a seed word to enhance random number generation. This word will be used 
            throughout the game to ensure truly unpredictable dice results.
          </Text>
          
          <View style={styles.seedWords}>
            {seedWords.map((word, index) => (
              <Button
                key={word}
                title={word.toUpperCase()}
                onPress={() => onSelectSeed(word)}
                variant="primary"
                size="large"
                style={styles.seedButton}
              />
            ))}
          </View>
          
          <Text style={styles.hint}>
            Each seed word creates a unique sequence of random numbers for this game session.
          </Text>
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
  description: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  seedWords: {
    width: '100%',
    marginBottom: 24,
  },
  seedButton: {
    marginBottom: 12,
  },
  hint: {
    fontSize: 14,
    color: '#a3a3a3',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});