import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Skills, DiceRoll } from '../types';
import { rollDice } from '../utils/gameUtils';
import Card from './ui/Card';
import Button from './ui/Button';

interface ArmourRollProps {
  armourValue: number;
  skills: Skills;
  onRollComplete: (roll: DiceRoll, success: boolean) => void;
}

export default function ArmourRoll({ armourValue, skills, onRollComplete }: ArmourRollProps) {
  const [roll, setRoll] = useState<DiceRoll | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const calculateModifiers = (): { value: number; description: string[] } => {
    let modifier = 0;
    const descriptions: string[] = [];
    
    // Thick Skull adds +1 to AV effectively
    if (skills.defender.includes('Thick Skull')) {
      modifier += 1;
      descriptions.push('Thick Skull: +1 to armour');
    }
    
    // Mighty Blow affects injury, not armour
    // Piling On affects either armour or injury (player chooses)
    if (skills.attacker.includes('Piling On')) {
      descriptions.push('Piling On: +1 available (choose armour or injury)');
    }
    
    return { value: modifier, description: descriptions };
  };

  const rollArmour = () => {
    setIsRolling(true);
    
    setTimeout(() => {
      const dice = rollDice(2);
      const total = dice.reduce((sum, die) => sum + die, 0);
      const modifiers = calculateModifiers();
      const finalTotal = total + modifiers.value;
      
      const newRoll: DiceRoll = {
        id: Date.now().toString(),
        type: 'armour',
        dice: dice,
        result: finalTotal,
        timestamp: new Date(),
        modifiers: modifiers.description
      };
      
      setRoll(newRoll);
      setIsRolling(false);
      
      const success = finalTotal >= armourValue;
      onRollComplete(newRoll, success);
    }, 1000);
  };

  const modifierInfo = calculateModifiers();

  return (
    <View style={styles.container}>
      <Card title="🛡️ Armour Roll" variant="highlight">
        <View style={styles.content}>
          <Text style={styles.description}>
            Roll 2d6 to break the defender's armour. Need {armourValue}+ to break.
          </Text>
          
          <View style={styles.targetSection}>
            <Text style={styles.targetLabel}>Target Number:</Text>
            <Text style={styles.targetValue}>{armourValue}+</Text>
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
              onPress={rollArmour}
              variant="success"
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
                roll.result >= armourValue ? styles.successBanner : styles.failBanner
              ]}>
                <Text style={styles.resultText}>
                  {roll.result >= armourValue ? 'ARMOUR BROKEN!' : 'ARMOUR HOLDS'}
                </Text>
                <Text style={styles.resultSubtext}>
                  {roll.result >= armourValue 
                    ? 'Proceed to injury roll' 
                    : 'No injury - action complete'
                  }
                </Text>
              </View>
            </View>
          )}
          
          {isRolling && (
            <View style={styles.rollingIndicator}>
              <Text style={styles.rollingText}>🎲 Rolling dice... 🎲</Text>
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
  targetSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  targetLabel: {
    fontSize: 18,
    color: '#ffffff',
    marginRight: 12,
  },
  targetValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fbbf24',
    backgroundColor: '#1a472a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fbbf24',
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
    backgroundColor: '#2d5a3d',
    width: 60,
    height: 60,
    textAlign: 'center',
    lineHeight: 60,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4a7c59',
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
  successBanner: {
    backgroundColor: '#166534',
    borderColor: '#22c55e',
  },
  failBanner: {
    backgroundColor: '#7f1d1d',
    borderColor: '#dc2626',
  },
  resultText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
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