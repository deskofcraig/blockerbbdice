import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './ui/Card';
import Button from './ui/Button';

interface DiceSelectorProps {
  onSelectDice: (count: number) => void;
  onBack: () => void;
}

export default function DiceSelector({ onSelectDice, onBack }: DiceSelectorProps) {
  return (
    <View style={styles.container}>
      <Card title="Select Number of Block Dice">
        <View style={styles.content}>
          <Text style={styles.description}>
            How many block dice are you rolling?
          </Text>
          
          <Text style={styles.subtitle}>
            This is determined by comparing Strength characteristics (including assists)
          </Text>
          
          <View style={styles.diceOptions}>
            <Button
              title="🎲 1 DIE"
              onPress={() => onSelectDice(1)}
              variant="secondary"
              size="large"
              style={styles.diceButton}
            />
            <Text style={styles.diceDescription}>
              Equal Strength after modifiers
            </Text>
            
            <Button
              title="🎲🎲 2 DICE"
              onPress={() => onSelectDice(2)}
              variant="secondary"
              size="large"
              style={styles.diceButton}
            />
            <Text style={styles.diceDescription}>
              Higher Strength (choose best result)
            </Text>
            
            <Button
              title="🎲🎲🎲 3 DICE"
              onPress={() => onSelectDice(3)}
              variant="secondary"
              size="large"
              style={styles.diceButton}
            />
            <Text style={styles.diceDescription}>
              More than double Strength (choose best result)
            </Text>
          </View>
          
          <View style={styles.strengthGuide}>
            <Text style={styles.guideTitle}>📖 Strength Comparison Guide</Text>
            <Text style={styles.guideText}>
              • Count offensive assists (+1 ST each){'\n'}
              • Count defensive assists (+1 ST each){'\n'}
              • Compare final Strength values{'\n'}
              • The stronger player's coach chooses the result
            </Text>
          </View>
          
          <Button
            title="← Back"
            onPress={onBack}
            variant="primary"
            size="medium"
            style={styles.backButton}
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
    backgroundColor: '#2F2F2F', // dark-stone
  },
  content: {
    alignItems: 'center',
  },
  description: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
    lineHeight: 18,
  },
  diceOptions: {
    width: '100%',
    marginBottom: 24,
  },
  diceButton: {
    marginBottom: 8,
  },
  diceDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  strengthGuide: {
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FF9800',
    width: '100%',
    marginBottom: 16,
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 8,
  },
  guideText: {
    fontSize: 14,
    color: '#E65100',
    lineHeight: 18,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
});