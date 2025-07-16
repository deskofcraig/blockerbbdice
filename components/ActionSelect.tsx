import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './ui/Card';
import Button from './ui/Button';
import { ActionType } from '../types';

interface ActionSelectProps {
  onSelectAction: (action: ActionType) => void;
  seedWord: string;
}

export default function ActionSelect({ onSelectAction, seedWord }: ActionSelectProps) {
  return (
    <View style={styles.container}>
      <Card title="Select Action">
        <View style={styles.content}>
          <Text style={styles.seedInfo}>
            🎲 Seed Word: <Text style={styles.seedWord}>{seedWord.toUpperCase()}</Text>
          </Text>
          
          <Text style={styles.description}>
            What action are you performing?
          </Text>
          
          <Button
            title="🏈 BLOCK ACTION"
            onPress={() => onSelectAction('block')}
            variant="primary"
            size="large"
            style={styles.actionButton}
          />
          
          <Text style={styles.blockDescription}>
            Standard blocking action following the complete procedure from dice selection through injury resolution.
          </Text>
          
          <Button
            title="⚡ FOUL ACTION"
            onPress={() => onSelectAction('foul')}
            variant="danger"
            size="large"
            style={styles.actionButton}
          />
          
          <Text style={styles.foulDescription}>
            Fouling action with sent-off detection and arguing the call procedures.
          </Text>
          
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>ℹ️ Action Flow</Text>
            <Text style={styles.infoText}>
              • Block: Dice Selection → Roll → Result → Armour → Injury → Casualty{'\n'}
              • Foul: Armour → Injury → Casualty → Sent-off Check → Argue Call
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
    backgroundColor: '#2F2F2F', // dark-stone
  },
  content: {
    alignItems: 'center',
  },
  seedInfo: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  seedWord: {
    fontWeight: 'bold',
    color: '#8B0000', // blood-red
  },
  description: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },
  actionButton: {
    marginBottom: 8,
    width: '100%',
  },
  blockDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
    paddingHorizontal: 8,
    lineHeight: 18,
  },
  foulDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
    paddingHorizontal: 8,
    lineHeight: 18,
  },
  infoBox: {
    backgroundColor: '#E8F5E8',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#4CAF50',
    width: '100%',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#2E7D32',
    lineHeight: 18,
  },
});