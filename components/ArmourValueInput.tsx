import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { ActionType } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';

interface ArmourValueInputProps {
  onSetArmourValue: (av: number, stunty: boolean) => void;
  currentAction: ActionType | null;
}

export default function ArmourValueInput({ onSetArmourValue, currentAction }: ArmourValueInputProps) {
  const [armourValue, setArmourValue] = useState('9');
  const [isStunty, setIsStunty] = useState(false);

  const handleSubmit = () => {
    const av = parseInt(armourValue);
    if (av >= 1 && av <= 12) {
      onSetArmourValue(av, isStunty);
    }
  };

  const renderAVButton = (value: number) => (
    <TouchableOpacity
      key={value}
      style={[
        styles.avButton,
        armourValue === value.toString() && styles.selectedAV
      ]}
      onPress={() => setArmourValue(value.toString())}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Set armour value to ${value}`}
    >
      <Text style={[
        styles.avButtonText,
        armourValue === value.toString() && styles.selectedAVText
      ]}>
        {value}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Card title="🛡️ Set Armour Value" variant="highlight">
        <View style={styles.content}>
          <Text style={styles.description}>
            Set the defender's Armour Value (AV) for the {currentAction === 'block' ? 'block' : 'foul'} action.
            {currentAction === 'foul' && ' Remember to apply offensive and defensive assists as modifiers.'}
          </Text>
          
          <View style={styles.avSection}>
            <Text style={styles.avLabel}>Armour Value (1-12):</Text>
            
            <View style={styles.avGrid}>
              {[...Array(12)].map((_, i) => renderAVButton(i + 1))}
            </View>
            
            <View style={styles.customInput}>
              <Text style={styles.inputLabel}>Or enter custom value:</Text>
              <TextInput
                style={styles.textInput}
                value={armourValue}
                onChangeText={setArmourValue}
                keyboardType="numeric"
                maxLength={2}
                placeholder="AV"
                placeholderTextColor="#9ca3af"
                accessible={true}
                accessibilityLabel="Custom armour value input"
              />
            </View>
          </View>
          
          <View style={styles.stuntySection}>
            <TouchableOpacity
              style={[styles.stuntyButton, isStunty && styles.stuntySelected]}
              onPress={() => setIsStunty(!isStunty)}
              accessible={true}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isStunty }}
              accessibilityLabel="Stunty trait"
              accessibilityHint="Players with Stunty use a different injury table"
            >
              <View style={[styles.checkbox, isStunty && styles.checkboxSelected]}>
                {isStunty && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.stuntyLabel}>Stunty</Text>
            </TouchableOpacity>
            <Text style={styles.stuntyDescription}>
              Check if the defender has the Stunty trait (uses different injury table)
            </Text>
          </View>
          
          <View style={styles.modifierInfo}>
            <Text style={styles.modifierTitle}>Remember to apply modifiers:</Text>
            <Text style={styles.modifierText}>• Thick Skull: +1 to AV</Text>
            {currentAction === 'foul' && (
              <>
                <Text style={styles.modifierText}>• Offensive assists: +1 per assist</Text>
                <Text style={styles.modifierText}>• Defensive assists: -1 per assist</Text>
              </>
            )}
          </View>
          
          <Button
            title="Set Armour Value"
            onPress={handleSubmit}
            variant="success"
            size="large"
            disabled={!armourValue || parseInt(armourValue) < 1 || parseInt(armourValue) > 12}
            style={styles.submitButton}
          />
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
  avSection: {
    width: '100%',
    marginBottom: 24,
  },
  avLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  avGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avButton: {
    width: 40,
    height: 40,
    backgroundColor: '#2d5a3d',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4a7c59',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
  },
  selectedAV: {
    backgroundColor: '#166534',
    borderColor: '#22c55e',
  },
  avButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  selectedAVText: {
    color: '#ffffff',
  },
  customInput: {
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 14,
    color: '#a3a3a3',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#2d5a3d',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4a7c59',
    padding: 12,
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    width: 80,
  },
  stuntySection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  stuntyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  stuntySelected: {
    backgroundColor: '#166534',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#4a7c59',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#2d5a3d',
  },
  checkboxSelected: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  checkmark: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  stuntyLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  stuntyDescription: {
    fontSize: 14,
    color: '#a3a3a3',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  modifierInfo: {
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
  submitButton: {
    width: '100%',
    maxWidth: 300,
  },
});