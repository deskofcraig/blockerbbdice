import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Skills, DiceRoll } from '../types';
import { rollDice, calculateInjuryResult } from '../utils/gameUtils';
import Card from './ui/Card';
import Button from './ui/Button';

interface InjuryRollProps {
  isStunty: boolean;
  skills: Skills;
  onRollComplete: (roll: DiceRoll, result: string) => void;
}

export default function InjuryRoll({ isStunty, skills, onRollComplete }: InjuryRollProps) {
  const [roll, setRoll] = useState<DiceRoll | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState<string>('');

  const getInjuryTable = () => {
    if (isStunty) {
      return [
        { range: '2-6', result: 'Stunned' },
        { range: '7-8', result: 'KO\'d' },
        { range: '9', result: 'Badly Hurt' },
        { range: '10+', result: 'Casualty!' }
      ];
    } else {
      return [
        { range: '2-7', result: 'Stunned' },
        { range: '8-9', result: 'KO\'d' },
        { range: '10+', result: 'Casualty!' }
      ];
    }
  };

  const calculateModifiers = (): { value: number; description: string[] } => {
    let modifier = 0;
    const descriptions: string[] = [];
    
    // Mighty Blow adds +1 to injury rolls
    if (skills.attacker.includes('Mighty Blow')) {
      modifier += 1;
      descriptions.push('Mighty Blow: +1 to injury roll');
    }
    
    // Piling On can add +1 to injury (if not used on armour)
    if (skills.attacker.includes('Piling On')) {
      descriptions.push('Piling On: +1 available (if not used on armour)');
    }
    
    return { value: modifier, description: descriptions };
  };

  const rollInjury = () => {
    setIsRolling(true);
    
    setTimeout(() => {
      const dice = rollDice(2);
      const total = dice.reduce((sum, die) => sum + die, 0);
      const modifiers = calculateModifiers();
      const finalTotal = total + modifiers.value;
      
      const injuryResult = calculateInjuryResult(finalTotal, isStunty);
      
      const newRoll: DiceRoll = {
        id: Date.now().toString(),
        type: 'injury',
        dice: dice,
        result: finalTotal,
        timestamp: new Date(),
        modifiers: modifiers.description
      };
      
      setRoll(newRoll);
      setResult(injuryResult);
      setIsRolling(false);
      
      onRollComplete(newRoll, injuryResult);
    }, 1000);
  };

  const modifierInfo = calculateModifiers();
  const injuryTable = getInjuryTable();

  return (
    <View style={styles.container}>
      <Card title="🩸 Injury Roll" variant="highlight">
        <View style={styles.content}>
          <Text style={styles.description}>
            Roll 2d6 on the {isStunty ? 'Stunty' : 'Standard'} injury table to determine the result.
          </Text>
          
          <View style={styles.tableSection}>
            <Text style={styles.tableTitle}>
              {isStunty ? 'Stunty' : 'Standard'} Injury Table:
            </Text>
            <View style={styles.table}>
              {injuryTable.map((row, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.rangeText}>{row.range}</Text>
                  <Text style={styles.resultText}>{row.result}</Text>
                </View>
              ))}
            </View>
          </View>
          
          {modifierInfo.description.length > 0 && (
            <View style={styles.modifierSection}>
              <Text style={styles.modifierTitle}>Active Modifiers:</Text>
              {modifierInfo.description.map((desc, index) => (
                <Text key={index} style={styles.modifierText}>• {desc}</Text>
              ))}
            </View>
          )}
          
          {!roll && (
            <Button
              title={isRolling ? "Rolling..." : "Roll 2d6"}
              onPress={rollInjury}
              variant="danger"
              size="large"
              disabled={isRolling}
              style={styles.rollButton}
            />
          )}
          
          {roll && (
            <View style={styles.resultSection}>
              <View style={styles.diceResult}>
                <Text style={styles.diceLabel}>Dice Roll:</Text>
                <View style={styles.diceDisplay}>
                  {roll.dice.map((die, index) => (
                    <Text key={index} style={styles.dieValue}>{die}</Text>
                  ))}
                </View>
              </View>
              
              <View style={styles.calculation}>
                <Text style={styles.calcText}>
                  {roll.dice.join(' + ')} 
                  {modifierInfo.value !== 0 && ` ${modifierInfo.value >= 0 ? '+' : ''}${modifierInfo.value}`} 
                  = {roll.result}
                </Text>
              </View>
              
              <View style={[
                styles.resultBanner,
                result === 'Casualty!' ? styles.casualtyBanner : 
                result === 'KO\'d' ? styles.koBanner : styles.stunnedBanner
              ]}>
                <Text style={styles.finalResultText}>{result}</Text>
                <Text style={styles.resultSubtext}>
                  {result === 'Casualty!' && 'Proceed to casualty table'}
                  {result === 'KO\'d' && 'Player is knocked out'}
                  {result === 'Stunned' && 'Player is stunned'}
                  {result === 'Badly Hurt' && 'Player is badly hurt (Stunty)'}
                </Text>
              </View>
            </View>
          )}
          
          {isRolling && (
            <View style={styles.rollingIndicator}>
              <Text style={styles.rollingText}>🎲 Rolling injury... 🎲</Text>
            </View>
          )}
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  tableSection: {
    width: '100%',
    marginBottom: 24,
  },
  tableTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  table: {
    backgroundColor: '#1a472a',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2d5a3d',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#2d5a3d',
  },
  rangeText: {
    fontSize: 14,
    color: '#fbbf24',
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  resultText: {
    fontSize: 14,
    color: '#ffffff',
  },
  modifierSection: {
    backgroundColor: '#1a472a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    width: '100%',
  },
  modifierTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 8,
    textAlign: 'center',
  },
  modifierText: {
    fontSize: 12,
    color: '#a3a3a3',
    marginBottom: 2,
    paddingLeft: 8,
  },
  rollButton: {
    width: '100%',
    maxWidth: 300,
  },
  resultSection: {
    width: '100%',
    alignItems: 'center',
  },
  diceResult: {
    alignItems: 'center',
    marginBottom: 16,
  },
  diceLabel: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 8,
  },
  diceDisplay: {
    flexDirection: 'row',
    gap: 12,
  },
  dieValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#7f1d1d',
    width: 60,
    height: 60,
    textAlign: 'center',
    lineHeight: 60,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#dc2626',
  },
  calculation: {
    marginBottom: 16,
  },
  calcText: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  resultBanner: {
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    borderWidth: 2,
  },
  stunnedBanner: {
    backgroundColor: '#374151',
    borderColor: '#6b7280',
  },
  koBanner: {
    backgroundColor: '#ea580c',
    borderColor: '#f97316',
  },
  casualtyBanner: {
    backgroundColor: '#7f1d1d',
    borderColor: '#dc2626',
  },
  finalResultText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
    textAlign: 'center',
  },
  resultSubtext: {
    fontSize: 14,
    color: '#d1d5db',
    textAlign: 'center',
  },
  rollingIndicator: {
    alignItems: 'center',
  },
  rollingText: {
    fontSize: 16,
    color: '#a3a3a3',
    fontWeight: 'bold',
  },
});