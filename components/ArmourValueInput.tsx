import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './ui/Card';
import Button from './ui/Button';

interface ArmourValueInputProps {
  onSetArmourValue: (av: number, isStunty: boolean) => void;
  onBack: () => void;
}

export default function ArmourValueInput({ onSetArmourValue, onBack }: ArmourValueInputProps) {
  const [selectedAV, setSelectedAV] = useState<number | null>(null);
  const [isStunty, setIsStunty] = useState(false);

  const armourValues = [7, 8, 9, 10, 11, 12];
  const commonAVs = [
    { av: 7, description: 'Light armour (Goblins, Skinks)' },
    { av: 8, description: 'Standard light (Elves, Halflings)' },
    { av: 9, description: 'Standard medium (Humans, Orcs)' },
    { av: 10, description: 'Heavy armour (Dwarfs, Chaos)' },
    { av: 11, description: 'Very heavy (Some Big Guys)' },
    { av: 12, description: 'Maximum armour' }
  ];

  const handleContinue = () => {
    if (selectedAV !== null) {
      onSetArmourValue(selectedAV, isStunty);
    }
  };

  return (
    <View style={styles.container}>
      <Card title="Set Defender's Armour Value">
        <View style={styles.content}>
          <Text style={styles.description}>
            What is the defender's Armour Value?
          </Text>
          
          <Text style={styles.subtitle}>
            (Include any modifiers like Thick Skull +1)
          </Text>
          
          <View style={styles.avContainer}>
            {commonAVs.map(({ av, description }) => (
              <View key={av} style={styles.avOption}>
                <Button
                  title={`AV ${av}+`}
                  onPress={() => setSelectedAV(av)}
                  variant={selectedAV === av ? 'primary' : 'secondary'}
                  size="medium"
                  style={styles.avButton}
                />
                <Text style={styles.avDescription}>{description}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.stuntySection}>
            <Text style={styles.stuntyTitle}>Special Traits:</Text>
            <Button
              title={`STUNTY ${isStunty ? '✅' : '⬜'}`}
              onPress={() => setIsStunty(!isStunty)}
              variant={isStunty ? 'success' : 'secondary'}
              size="medium"
              style={styles.stuntyButton}
            />
            <Text style={styles.stuntyDescription}>
              {isStunty 
                ? 'Using Stunty injury table (different outcomes)' 
                : 'Using standard injury table'
              }
            </Text>
          </View>
          
          {selectedAV !== null && (
            <View style={styles.summaryBox}>
              <Text style={styles.summaryTitle}>⚖️ Armour Summary</Text>
              <Text style={styles.summaryText}>
                • Armour Value: {selectedAV}+{'\n'}
                • Injury Table: {isStunty ? 'Stunty' : 'Standard'}{'\n'}
                • Break on: 2d6 ≥ {selectedAV}
              </Text>
            </View>
          )}
          
          <View style={styles.actions}>
            <Button
              title="Continue to Armour Roll"
              onPress={handleContinue}
              variant="primary"
              size="large"
              disabled={selectedAV === null}
              style={styles.continueButton}
            />
            
            <Button
              title="← Back"
              onPress={onBack}
              variant="secondary"
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
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  avContainer: {
    width: '100%',
    marginBottom: 24,
  },
  avOption: {
    marginBottom: 12,
  },
  avButton: {
    marginBottom: 4,
  },
  avDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  stuntySection: {
    width: '100%',
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FF9800',
  },
  stuntyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 12,
    textAlign: 'center',
  },
  stuntyButton: {
    marginBottom: 8,
  },
  stuntyDescription: {
    fontSize: 14,
    color: '#E65100',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  summaryBox: {
    width: '100%',
    backgroundColor: '#E8F5E8',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
    textAlign: 'center',
  },
  summaryText: {
    fontSize: 14,
    color: '#2E7D32',
    lineHeight: 20,
  },
  actions: {
    width: '100%',
  },
  continueButton: {
    marginBottom: 12,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
});