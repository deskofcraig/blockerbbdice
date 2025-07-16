import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Card from './ui/Card';
import Button from './ui/Button';

interface DiceSelectorProps {
  onSelectDice: (count: number) => void;
}

export default function DiceSelector({ onSelectDice }: DiceSelectorProps) {
  const renderDiceOption = (count: number, title: string, description: string) => (
    <TouchableOpacity
      key={count}
      style={styles.diceOption}
      onPress={() => onSelectDice(count)}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Select ${count} dice: ${title}`}
      accessibilityHint={description}
    >
      <View style={styles.diceCount}>
        <Text style={styles.diceNumber}>{count}</Text>
        <Text style={styles.diceLabel}>DICE</Text>
      </View>
      <View style={styles.diceInfo}>
        <Text style={styles.diceTitle}>{title}</Text>
        <Text style={styles.diceDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Card title="🎲 Select Block Dice" variant="highlight">
        <View style={styles.content}>
          <Text style={styles.description}>
            Choose the number of block dice to roll based on strength comparison and assists:
          </Text>
          
          <View style={styles.diceOptions}>
            {renderDiceOption(
              1,
              "Equal Strength",
              "Both players have the same strength after modifiers"
            )}
            
            {renderDiceOption(
              2,
              "Strength Advantage",
              "Attacker has higher strength (you choose result)"
            )}
            
            {renderDiceOption(
              3,
              "Overwhelming Strength",
              "Attacker has more than double strength (you choose result)"
            )}
          </View>
          
          <View style={styles.reminder}>
            <Text style={styles.reminderText}>
              Remember: With 2 or 3 dice, the stronger player chooses which result to apply.
            </Text>
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
  diceOptions: {
    width: '100%',
    marginBottom: 24,
  },
  diceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d5a3d',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4a7c59',
    padding: 16,
    marginBottom: 12,
    minHeight: 80,
  },
  diceCount: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    marginRight: 16,
  },
  diceNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  diceLabel: {
    fontSize: 12,
    color: '#a3a3a3',
    fontWeight: '600',
  },
  diceInfo: {
    flex: 1,
  },
  diceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  diceDescription: {
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 18,
  },
  reminder: {
    backgroundColor: '#1a472a',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2d5a3d',
  },
  reminderText: {
    fontSize: 14,
    color: '#a3a3a3',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});