import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { BlockDiceResult } from '../types';
import { rollBlockDice } from '../utils/gameUtils';
import Card from './ui/Card';
import Button from './ui/Button';

interface BlockDiceRollProps {
  diceCount: number;
  onDiceRolled: (results: BlockDiceResult[]) => void;
}

export default function BlockDiceRoll({ diceCount, onDiceRolled }: BlockDiceRollProps) {
  const [isRolling, setIsRolling] = useState(false);
  const [results, setResults] = useState<BlockDiceResult[]>([]);
  const [animationValues] = useState(() => 
    Array(diceCount).fill(0).map(() => new Animated.Value(0))
  );

  const rollDice = () => {
    setIsRolling(true);
    setResults([]);

    // Start animation
    const animations = animationValues.map(animValue => {
      animValue.setValue(0);
      return Animated.timing(animValue, {
        toValue: 1,
        duration: 1200, // 1.2 seconds as specified
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      });
    });

    // Run animations in parallel
    Animated.parallel(animations).start(() => {
      // Animation complete, show final results
      const finalResults = rollBlockDice(diceCount);
      setResults(finalResults);
      setIsRolling(false);
    });

    // Show intermediate rolling animation with random faces
    const intervalId = setInterval(() => {
      if (!isRolling) {
        clearInterval(intervalId);
        return;
      }
      
      const tempResults = rollBlockDice(diceCount);
      setResults(tempResults);
    }, 100);

    // Clear interval after animation
    setTimeout(() => {
      clearInterval(intervalId);
    }, 1200);
  };

  const handleContinue = () => {
    onDiceRolled(results);
  };

  const renderDie = (result: BlockDiceResult, index: number) => {
    const animValue = animationValues[index];
    
    const rotation = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '720deg'],
    });

    const scale = animValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 1.2, 1],
    });

    return (
      <Animated.View
        key={index}
        style={[
          styles.die,
          {
            transform: [
              { rotate: rotation },
              { scale: scale }
            ]
          }
        ]}
      >
        <Text style={styles.dieEmoji}>{result.emoji}</Text>
        <Text style={styles.dieFace}>{result.face.toUpperCase()}</Text>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Card title="🎲 Rolling Block Dice" variant="highlight">
        <View style={styles.content}>
          <Text style={styles.description}>
            Rolling {diceCount} block dice...
          </Text>
          
          <View style={styles.diceContainer}>
            {results.length > 0 ? (
              results.map((result, index) => renderDie(result, index))
            ) : (
              Array(diceCount).fill(0).map((_, index) => (
                <View key={index} style={styles.die}>
                  <Text style={styles.dieEmoji}>🎲</Text>
                  <Text style={styles.dieFace}>ROLLING</Text>
                </View>
              ))
            )}
          </View>
          
          {!isRolling && results.length === 0 && (
            <Button
              title="Roll Dice"
              onPress={rollDice}
              variant="success"
              size="large"
              style={styles.rollButton}
            />
          )}
          
          {!isRolling && results.length > 0 && (
            <View style={styles.resultsSection}>
              <Text style={styles.resultsTitle}>Results:</Text>
              <View style={styles.resultsList}>
                {results.map((result, index) => (
                  <Text key={index} style={styles.resultText}>
                    {result.emoji} {result.face.toUpperCase()}
                  </Text>
                ))}
              </View>
              
              <Button
                title="Continue"
                onPress={handleContinue}
                variant="primary"
                size="large"
                style={styles.continueButton}
              />
            </View>
          )}
          
          {isRolling && (
            <Text style={styles.rollingText}>
              🎲 Dice are rolling... 🎲
            </Text>
          )}
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
    marginBottom: 24,
    lineHeight: 24,
  },
  diceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 24,
    minHeight: 120,
  },
  die: {
    width: 100,
    height: 100,
    backgroundColor: '#2d5a3d',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#4a7c59',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dieEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  dieFace: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  rollButton: {
    width: '100%',
    maxWidth: 300,
  },
  resultsSection: {
    width: '100%',
    alignItems: 'center',
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  resultsList: {
    marginBottom: 24,
  },
  resultText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 4,
  },
  continueButton: {
    width: '100%',
    maxWidth: 300,
  },
  rollingText: {
    fontSize: 16,
    color: '#a3a3a3',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 12,
  },
});