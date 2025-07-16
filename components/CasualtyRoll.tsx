import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Skills, DiceRoll } from '../types';
import { rollD16, calculateCasualtyResult } from '../utils/gameUtils';
import Card from './ui/Card';
import Button from './ui/Button';

interface CasualtyRollProps {
  skills: Skills;
  onRollComplete: (roll: DiceRoll, result: string) => void;
}

export default function CasualtyRoll({ skills, onRollComplete }: CasualtyRollProps) {
  const [roll, setRoll] = useState<DiceRoll | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState<string>('');

  const getCasualtyTable = () => [
    { range: '1-6', result: 'Badly Hurt', effect: 'MNG' },
    { range: '7-9', result: 'Seriously Hurt', effect: 'MNG' },
    { range: '10-12', result: 'Serious Injury', effect: 'NI and MNG' },
    { range: '13-14', result: 'Lasting Injury', effect: 'Characteristic Reduction and MNG' },
    { range: '15-16', result: 'DEAD', effect: 'This player is far too dead to play Blood Bowl!' }
  ];

  const calculateModifiers = (): { value: number; description: string[] } => {
    let modifier = 0;
    const descriptions: string[] = [];
    
    // Mighty Blow adds +1 to casualty rolls too
    if (skills.attacker.includes('Mighty Blow')) {
      modifier += 1;
      descriptions.push('Mighty Blow: +1 to casualty roll');
    }
    
    // Decay adds modifier for Nurgle teams
    if (skills.attacker.includes('Decay')) {
      modifier += 1;
      descriptions.push('Decay: +1 to casualty roll');
    }
    
    // Niggling Injuries would add +1 per existing injury
    // This would need to be passed as a prop in a real implementation
    
    return { value: modifier, description: descriptions };
  };

  const rollCasualty = () => {
    setIsRolling(true);
    
    setTimeout(() => {
      const d16Roll = rollD16();
      const modifiers = calculateModifiers();
      const finalTotal = d16Roll + modifiers.value;
      
      const casualtyResult = calculateCasualtyResult(finalTotal);
      
      const newRoll: DiceRoll = {
        id: Date.now().toString(),
        type: 'casualty',
        dice: [d16Roll], // D16 represented as single value
        result: finalTotal,
        timestamp: new Date(),
        modifiers: modifiers.description
      };
      
      setRoll(newRoll);
      setResult(casualtyResult);
      setIsRolling(false);
      
      onRollComplete(newRoll, casualtyResult);
    }, 1000);
  };

  const modifierInfo = calculateModifiers();
  const casualtyTable = getCasualtyTable();

  return (
    <View style={styles.container}>
      <Card title="💀 Casualty Roll" variant="warning">
        <View style={styles.content}>
          <Text style={styles.description}>
            Roll a D16 on the casualty table to determine the severity of the injury.
          </Text>
          
          <View style={styles.tableSection}>
            <Text style={styles.tableTitle}>Casualty Table:</Text>
            <View style={styles.table}>
              {casualtyTable.map((row, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.rangeText}>{row.range}</Text>
                  <View style={styles.resultColumn}>
                    <Text style={styles.resultText}>{row.result}</Text>
                    <Text style={styles.effectText}>{row.effect}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
          
          <View style={styles.legend}>
            <Text style={styles.legendTitle}>Legend:</Text>
            <Text style={styles.legendText}>• MNG: Miss Next Game</Text>
            <Text style={styles.legendText}>• NI: Niggling Injury (+1 to future casualty rolls)</Text>
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
              title={isRolling ? "Rolling..." : "Roll D16"}
              onPress={rollCasualty}
              variant="danger"
              size="large"
              disabled={isRolling}
              style={styles.rollButton}
            />
          )}
          
          {roll && (
            <View style={styles.resultSection}>
              <View style={styles.diceResult}>
                <Text style={styles.diceLabel}>D16 Roll:</Text>
                <Text style={styles.d16Value}>{roll.dice[0]}</Text>
              </View>
              
              <View style={styles.calculation}>
                <Text style={styles.calcText}>
                  {roll.dice[0]} 
                  {modifierInfo.value !== 0 && ` ${modifierInfo.value >= 0 ? '+' : ''}${modifierInfo.value}`} 
                  = {roll.result}
                </Text>
              </View>
              
              <View style={[
                styles.resultBanner,
                result === 'DEAD' ? styles.deadBanner : 
                result.includes('Lasting Injury') ? styles.lastingBanner :
                result.includes('Serious') ? styles.seriousBanner : styles.badlyHurtBanner
              ]}>
                <Text style={styles.finalResultText}>{result}</Text>
                <Text style={styles.resultSubtext}>
                  {result === 'DEAD' && 'Player is removed from the team permanently'}
                  {result === 'Badly Hurt' && 'Player misses the rest of this game only'}
                  {result === 'Miss Next Game' && 'Player misses this game and the next game'}
                  {result === 'Niggling Injury' && 'Player gets +1 to future casualty rolls and misses next game'}
                  {result === 'Lasting Injury' && 'Player suffers permanent stat reduction and misses next game'}
                </Text>
              </View>
              
              {result === 'Lasting Injury' && (
                <View style={styles.lastingInjuryNote}>
                  <Text style={styles.noteTitle}>Lasting Injury:</Text>
                  <Text style={styles.noteText}>
                    Roll on the Lasting Injury table to determine which characteristic is reduced.
                  </Text>
                </View>
              )}
            </View>
          )}
          
          {isRolling && (
            <View style={styles.rollingIndicator}>
              <Text style={styles.rollingText}>🎲 Rolling casualty... 🎲</Text>
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
    marginBottom: 16,
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
    borderColor: '#7c2d12',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#7c2d12',
  },
  rangeText: {
    fontSize: 14,
    color: '#fbbf24',
    fontWeight: 'bold',
    fontFamily: 'monospace',
    width: 50,
  },
  resultColumn: {
    flex: 1,
    paddingLeft: 12,
  },
  resultText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  effectText: {
    fontSize: 12,
    color: '#d1d5db',
    fontStyle: 'italic',
  },
  legend: {
    backgroundColor: '#1a472a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    width: '100%',
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fbbf24',
    marginBottom: 6,
    textAlign: 'center',
  },
  legendText: {
    fontSize: 12,
    color: '#a3a3a3',
    marginBottom: 2,
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
  d16Value: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#7f1d1d',
    width: 80,
    height: 80,
    textAlign: 'center',
    lineHeight: 80,
    borderRadius: 12,
    borderWidth: 3,
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
    marginBottom: 16,
  },
  badlyHurtBanner: {
    backgroundColor: '#374151',
    borderColor: '#6b7280',
  },
  seriousBanner: {
    backgroundColor: '#ea580c',
    borderColor: '#f97316',
  },
  lastingBanner: {
    backgroundColor: '#7f1d1d',
    borderColor: '#dc2626',
  },
  deadBanner: {
    backgroundColor: '#000000',
    borderColor: '#ef4444',
  },
  finalResultText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  resultSubtext: {
    fontSize: 14,
    color: '#d1d5db',
    textAlign: 'center',
    lineHeight: 20,
  },
  lastingInjuryNote: {
    backgroundColor: '#7c2d12',
    borderRadius: 8,
    padding: 12,
    width: '100%',
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fbbf24',
    marginBottom: 4,
  },
  noteText: {
    fontSize: 12,
    color: '#d1d5db',
    fontStyle: 'italic',
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