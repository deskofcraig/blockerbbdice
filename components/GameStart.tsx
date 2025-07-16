import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './ui/Card';
import Button from './ui/Button';
import { generateSeedWords } from '../utils/dice';

interface GameStartProps {
  onStart: (seedWord: string) => void;
}

export default function GameStart({ onStart }: GameStartProps) {
  const [seedWords, setSeedWords] = useState<string[]>([]);

  useEffect(() => {
    setSeedWords(generateSeedWords(3));
  }, []);

  const regenerateWords = () => {
    setSeedWords(generateSeedWords(3));
  };

  return (
    <View style={styles.container}>
      <Card title="Welcome to Blocker BBDice">
        <View style={styles.content}>
          <Text style={styles.description}>
            This app helps you complete blocking and fouling actions in Blood Bowl 2020.
            Select a seed word to enhance randomization for your game session.
          </Text>
          
          <Text style={styles.seedTitle}>Choose a Seed Word:</Text>
          
          <View style={styles.seedWordsContainer}>
            {seedWords.map((word, index) => (
              <Button
                key={index}
                title={word.toUpperCase()}
                onPress={() => onStart(word)}
                variant="secondary"
                size="large"
                style={styles.seedButton}
              />
            ))}
          </View>
          
          <Button
            title="Generate New Words"
            onPress={regenerateWords}
            variant="primary"
            size="medium"
            style={styles.regenerateButton}
          />
          
          <Text style={styles.info}>
            💡 Seed words improve randomization by providing additional entropy to the dice rolling system.
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
    backgroundColor: '#2F2F2F', // dark-stone
  },
  content: {
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
    color: '#333',
  },
  seedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#8B0000', // blood-red
  },
  seedWordsContainer: {
    width: '100%',
    marginBottom: 24,
  },
  seedButton: {
    marginBottom: 12,
  },
  regenerateButton: {
    marginBottom: 16,
  },
  info: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#666',
    lineHeight: 18,
  },
});