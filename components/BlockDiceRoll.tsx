import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Card from './ui/Card';
import Button from './ui/Button';
import { BlockDiceResult, BLOCK_DICE_EMOJIS } from '../types';
import { rollBlockDice } from '../utils/dice';

interface BlockDiceRollProps {
  diceCount: number;
  onRollComplete: (results: BlockDiceResult[]) => void;
  onBack: () => void;
}

export default function BlockDiceRoll({ diceCount, onRollComplete, onBack }: BlockDiceRollProps) {
  const [isRolling, setIsRolling] = useState(false);
  const [results, setResults] = useState<BlockDiceResult[]>([]);
  const [animatedValues] = useState(() => 
    Array.from({ length: diceCount }, () => new Animated.Value(0))
  );

  const rollDice = () => {
    setIsRolling(true);
    setResults([]);

    // Start rotation animation
    const animations = animatedValues.map(animatedValue => 
      Animated.loop(
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        { iterations: 12 } // 1.2 seconds total
      )
    );

    Animated.parallel(animations).start();

    // Complete the roll after animation
    setTimeout(() => {
      const rollResults = rollBlockDice(diceCount);
      setResults(rollResults);
      setIsRolling(false);
      
      // Reset animation values
      animatedValues.forEach(animatedValue => animatedValue.setValue(0));
    }, 1200);
  };

  const getDiceEmoji = (index: number): string => {
    if (isRolling) {
      return '🎲'; // Rolling dice emoji during animation
    }
    if (results[index]) {
      return BLOCK_DICE_EMOJIS[results[index]];
    }
    return '🎲';
  };

  const getResultName = (result: BlockDiceResult): string => {
    const names = {
      'skull': 'Attacker Down',
      'both-down': 'Both Down',
      'pow': 'Defender Down',
      'stumble': 'Stumble',
      'push': 'Push'
    };
    return names[result];
  };

  return (
    <View style={styles.container}>
      <Card title="Roll Block Dice">
        <View style={styles.content}>
          <Text style={styles.description}>
            Rolling {diceCount} block {diceCount === 1 ? 'die' : 'dice'}
          </Text>
          
          <View style={styles.diceContainer}>
            {Array.from({ length: diceCount }, (_, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.diceWrapper,
                  {
                    transform: [{
                      rotate: animatedValues[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      })
                    }]
                  }
                ]}
              >
                <Text style={styles.diceEmoji}>
                  {getDiceEmoji(index)}
                </Text>
              </Animated.View>
            ))}
          </View>
          
          {results.length > 0 && (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsTitle}>Results:</Text>
              {results.map((result, index) => (
                <View key={index} style={styles.resultItem}>
                  <Text style={styles.resultEmoji}>{BLOCK_DICE_EMOJIS[result]}</Text>
                  <Text style={styles.resultName}>{getResultName(result)}</Text>
                </View>
              ))}
            </View>
          )}
          
          <View style={styles.actions}>
            {!isRolling && results.length === 0 && (
              <Button
                title="🎲 ROLL DICE"
                onPress={rollDice}
                variant="primary"
                size="large"
                style={styles.rollButton}
              />
            )}
            
            {isRolling && (
              <Text style={styles.rollingText}>🎲 Rolling dice...</Text>
            )}
            
            {results.length > 0 && (
              <View style={styles.completeActions}>
                <Button
                  title="Continue with Results"
                  onPress={() => onRollComplete(results)}
                  variant="success"
                  size="large"
                  style={styles.continueButton}
                />
                <Button
                  title="🔄 Re-roll"
                  onPress={rollDice}
                  variant="secondary"
                  size="medium"
                  style={styles.rerollButton}
                />
              </View>
            )}
            
            <Button
              title="← Back"
              onPress={onBack}
              variant="primary"
              size="medium"
              style={styles.backButton}
            />
          </View>
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
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },
  diceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    minHeight: 80,
  },
  diceWrapper: {
    marginHorizontal: 8,
  },
  diceEmoji: {
    fontSize: 60,
    textAlign: 'center',
  },
  resultsContainer: {
    width: '100%',
    backgroundColor: '#E8F5E8',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 12,
    textAlign: 'center',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  resultEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  resultName: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '500',
  },
  actions: {
    width: '100%',
    alignItems: 'center',
  },
  rollButton: {
    marginBottom: 16,
  },
  rollingText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  completeActions: {
    width: '100%',
    marginBottom: 16,
  },
  continueButton: {
    marginBottom: 12,
  },
  rerollButton: {
    marginBottom: 12,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
});