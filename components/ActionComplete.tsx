import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './ui/Card';
import Button from './ui/Button';
import { GameState } from '../types';

interface ActionCompleteProps {
  gameState: GameState;
  onNewAction: () => void;
  onShowStatistics: () => void;
}

export default function ActionComplete({ 
  gameState, 
  onNewAction, 
  onShowStatistics 
}: ActionCompleteProps) {
  return (
    <View style={styles.container}>
      <Card title="Action Complete">
        <View style={styles.content}>
          <Text style={styles.title}>
            ✅ {gameState.actionType?.toUpperCase()} Action Completed
          </Text>
          
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>📋 Action Summary</Text>
            <Text style={styles.summaryText}>
              • Action Type: {gameState.actionType?.toUpperCase()}{'\n'}
              • Seed Word: {gameState.seedWord}{'\n'}
              {gameState.diceCount && `• Dice Rolled: ${gameState.diceCount}\n`}
              {gameState.selectedResult && `• Result: ${gameState.selectedResult}\n`}
              {gameState.armourValue && `• Armour Value: ${gameState.armourValue}+\n`}
              {gameState.isStunty && `• Stunty: Yes\n`}
            </Text>
          </View>
          
          <View style={styles.actionLogSection}>
            <Text style={styles.logTitle}>📜 Recent Actions</Text>
            {gameState.actionLog.slice(0, 3).map((entry) => (
              <View key={entry.id} style={styles.logEntry}>
                <Text style={styles.logIcon}>{entry.icon}</Text>
                <Text style={styles.logDescription}>{entry.description}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.actions}>
            <Button
              title="🔄 Start New Action"
              onPress={onNewAction}
              variant="primary"
              size="large"
              style={styles.actionButton}
            />
            
            <Button
              title="📊 View Statistics"
              onPress={onShowStatistics}
              variant="secondary"
              size="medium"
              style={styles.actionButton}
            />
          </View>
          
          <Text style={styles.footer}>
            Ready for your next Blood Bowl action!
          </Text>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2E7D32',
  },
  summaryBox: {
    width: '100%',
    backgroundColor: '#E8F5E8',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
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
  actionLogSection: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  logTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  logEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  logDescription: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  actions: {
    width: '100%',
    marginBottom: 16,
  },
  actionButton: {
    marginBottom: 12,
  },
  footer: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
});