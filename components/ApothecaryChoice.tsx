import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DiceRoll } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';

interface ApothecaryChoiceProps {
  lastRoll?: DiceRoll;
  onChoice: (useApothecary: boolean) => void;
}

export default function ApothecaryChoice({ lastRoll, onChoice }: ApothecaryChoiceProps) {
  return (
    <View style={styles.container}>
      <Card title="⚕️ Use Apothecary?" variant="highlight">
        <View style={styles.content}>
          <Text style={styles.description}>
            Your player has suffered a casualty. You may use your team's apothecary 
            (once per game) to attempt to reduce the severity of the injury.
          </Text>
          
          {lastRoll && (
            <View style={styles.rollResult}>
              <Text style={styles.rollLabel}>Current Result:</Text>
              <Text style={styles.rollValue}>
                Roll: {lastRoll.result} - Casualty
              </Text>
            </View>
          )}
          
          <View style={styles.apothecaryInfo}>
            <Text style={styles.infoTitle}>How Apothecary Works:</Text>
            
            <View style={styles.infoSection}>
              <Text style={styles.infoSubtitle}>For Knocked-out Players:</Text>
              <Text style={styles.infoText}>
                • If on the pitch: Player becomes Stunned instead
              </Text>
              <Text style={styles.infoText}>
                • If in crowd: Player goes to Reserves instead of KO box
              </Text>
            </View>
            
            <View style={styles.infoSection}>
              <Text style={styles.infoSubtitle}>For Casualties:</Text>
              <Text style={styles.infoText}>
                • Coach rolls again on the Casualty table
              </Text>
              <Text style={styles.infoText}>
                • You choose which result to apply
              </Text>
              <Text style={styles.infoText}>
                • If "Badly Hurt" is chosen, player goes to Reserves
              </Text>
            </View>
            
            <View style={styles.warningBox}>
              <Text style={styles.warningTitle}>⚠️ Important:</Text>
              <Text style={styles.warningText}>
                • Can only be used once per game
              </Text>
              <Text style={styles.warningText}>
                • Only works on permanently hired players
              </Text>
              <Text style={styles.warningText}>
                • Cannot be used on Journeymen or Star Players
              </Text>
            </View>
          </View>
          
          <View style={styles.choiceSection}>
            <Text style={styles.choiceTitle}>Do you want to use your apothecary?</Text>
            
            <View style={styles.buttons}>
              <Button
                title="Use Apothecary"
                onPress={() => onChoice(true)}
                variant="success"
                size="large"
                style={styles.choiceButton}
              />
              
              <Button
                title="Don't Use"
                onPress={() => onChoice(false)}
                variant="danger"
                size="large"
                style={styles.choiceButton}
              />
            </View>
          </View>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
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
  rollResult: {
    backgroundColor: '#7f1d1d',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dc2626',
  },
  rollLabel: {
    fontSize: 14,
    color: '#fbbf24',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  rollValue: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  apothecaryInfo: {
    backgroundColor: '#1a472a',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: '#2d5a3d',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 12,
    textAlign: 'center',
  },
  infoSection: {
    marginBottom: 12,
  },
  infoSubtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fbbf24',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 12,
    color: '#d1d5db',
    marginBottom: 2,
    lineHeight: 16,
  },
  warningBox: {
    backgroundColor: '#7c2d12',
    borderRadius: 6,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ea580c',
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fbbf24',
    marginBottom: 6,
  },
  warningText: {
    fontSize: 12,
    color: '#fed7aa',
    marginBottom: 2,
    lineHeight: 16,
  },
  choiceSection: {
    width: '100%',
    alignItems: 'center',
  },
  choiceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  choiceButton: {
    flex: 1,
  },
});