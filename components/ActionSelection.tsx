import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ActionType } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';

interface ActionSelectionProps {
  onSelectAction: (action: ActionType) => void;
}

export default function ActionSelection({ onSelectAction }: ActionSelectionProps) {
  return (
    <View style={styles.container}>
      <Card title="⚔️ Select Action" variant="highlight">
        <View style={styles.content}>
          <Text style={styles.description}>
            Choose the type of action you want to perform:
          </Text>
          
          <View style={styles.actions}>
            <Card variant="default" style={styles.actionCard}>
              <Text style={styles.actionTitle}>🛡️ BLOCK ACTION</Text>
              <Text style={styles.actionDescription}>
                A standard blocking action using block dice to knock down an opponent. 
                Follows the complete 9-step blocking procedure including dice selection, 
                result application, and injury resolution.
              </Text>
              <Button
                title="Perform Block"
                onPress={() => onSelectAction('block')}
                variant="primary"
                size="large"
                style={styles.actionButton}
              />
            </Card>
            
            <Card variant="default" style={styles.actionCard}>
              <Text style={styles.actionTitle}>🦶 FOUL ACTION</Text>
              <Text style={styles.actionDescription}>
                A fouling action to kick an opponent while they're down. 
                Skips dice selection and goes directly to armour rolling with 
                send-off risk on natural doubles.
              </Text>
              <Button
                title="Commit Foul"
                onPress={() => onSelectAction('foul')}
                variant="danger"
                size="large"
                style={styles.actionButton}
              />
            </Card>
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
  actions: {
    width: '100%',
  },
  actionCard: {
    marginBottom: 16,
  },
  actionTitle: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  actionDescription: {
    fontSize: 14,
    color: '#d1d5db',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  actionButton: {
    width: '100%',
  },
});