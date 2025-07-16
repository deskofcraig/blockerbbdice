import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ActionLogEntry, GamePhase } from '../types';

interface ActionLogProps {
  entries: ActionLogEntry[];
  currentPhase: GamePhase;
}

export default function ActionLog({ entries, currentPhase }: ActionLogProps) {
  const getPhaseIcon = (phase: GamePhase): string => {
    switch (phase) {
      case 'start': return '🏁';
      case 'seedSelection': return '🎲';
      case 'actionSelection': return '⚔️';
      case 'diceSelection': return '🎯';
      case 'diceRoll': return '🎲';
      case 'resultSelection': return '👆';
      case 'armourValue': return '🛡️';
      case 'armourRoll': return '🎲';
      case 'injuryRoll': return '🩸';
      case 'casualtyRoll': return '💀';
      case 'apothecary': return '⚕️';
      case 'complete': return '✅';
      default: return '📝';
    }
  };

  const formatTime = (timestamp: Date): string => {
    return timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' });
  };

  // Show last 5 entries with most recent at top
  const recentEntries = entries.slice(-5).reverse();

  if (entries.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📝 Action Log</Text>
        <Text style={styles.count}>({entries.length} actions)</Text>
      </View>
      
      <ScrollView 
        style={styles.logContainer}
        contentContainerStyle={styles.logContent}
        showsVerticalScrollIndicator={false}
      >
        {recentEntries.map((entry) => (
          <View key={entry.id} style={styles.logEntry}>
            <View style={styles.entryHeader}>
              <Text style={styles.phaseIcon}>{getPhaseIcon(entry.phase)}</Text>
              <Text style={styles.timestamp}>{formatTime(entry.timestamp)}</Text>
            </View>
            
            <Text style={styles.action}>{entry.action}</Text>
            
            {entry.dice && (
              <View style={styles.diceInfo}>
                <Text style={styles.diceText}>
                  🎲 {entry.dice.dice.join(', ')} = {entry.dice.result}
                </Text>
              </View>
            )}
            
            {entry.result && (
              <Text style={styles.result}>→ {entry.result}</Text>
            )}
          </View>
        ))}
        
        {entries.length > 5 && (
          <Text style={styles.moreText}>
            ... and {entries.length - 5} more actions
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a472a',
    borderTopWidth: 2,
    borderTopColor: '#2d5a3d',
    maxHeight: 200,
    minHeight: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2d5a3d',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  count: {
    fontSize: 12,
    color: '#a3a3a3',
  },
  logContainer: {
    flex: 1,
  },
  logContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  logEntry: {
    backgroundColor: '#0f2419',
    borderRadius: 6,
    padding: 8,
    marginBottom: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#4a7c59',
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  phaseIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  timestamp: {
    fontSize: 10,
    color: '#6b7280',
    fontFamily: 'monospace',
  },
  action: {
    fontSize: 12,
    color: '#ffffff',
    lineHeight: 16,
  },
  diceInfo: {
    marginTop: 4,
    backgroundColor: '#2d5a3d',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  diceText: {
    fontSize: 10,
    color: '#fbbf24',
    fontFamily: 'monospace',
  },
  result: {
    fontSize: 11,
    color: '#22c55e',
    marginTop: 2,
    fontStyle: 'italic',
  },
  moreText: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
  },
});