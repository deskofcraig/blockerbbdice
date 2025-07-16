import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GameState } from '../types';

interface HeaderProps {
  gameState: GameState;
  onShowStatistics: () => void;
  onShowSkills: () => void;
  onReset: () => void;
  onGoBack: () => void;
}

export default function Header({ 
  gameState, 
  onShowStatistics, 
  onShowSkills, 
  onReset, 
  onGoBack 
}: HeaderProps) {
  const getPhaseTitle = (): string => {
    switch (gameState.phase) {
      case 'start': return 'Welcome';
      case 'seedSelection': return 'Select Seed';
      case 'actionSelection': return 'Choose Action';
      case 'diceSelection': return 'Select Dice';
      case 'diceRoll': return 'Roll Dice';
      case 'resultSelection': return 'Choose Result';
      case 'armourValue': return 'Set Armour';
      case 'armourRoll': return 'Armour Roll';
      case 'injuryRoll': return 'Injury Roll';
      case 'casualtyRoll': return 'Casualty Roll';
      case 'apothecary': return 'Apothecary';
      case 'complete': return 'Complete';
      default: return 'Blood Bowl';
    }
  };

  const canGoBack = gameState.phase !== 'start' && gameState.phase !== 'seedSelection';

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.leftSection}>
          {canGoBack && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={onGoBack}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.centerSection}>
          <Text style={styles.title}>Blocker BBDice</Text>
          <Text style={styles.phase}>{getPhaseTitle()}</Text>
        </View>
        
        <View style={styles.rightSection}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={onReset}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Reset game"
          >
            <Text style={styles.menuButtonText}>🔄</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.bottomRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onShowStatistics}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Show statistics"
        >
          <Text style={styles.actionButtonText}>📊 Stats</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onShowSkills}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Manage skills"
        >
          <Text style={styles.actionButtonText}>⚡ Skills</Text>
        </TouchableOpacity>
        
        <View style={styles.gameInfo}>
          {gameState.currentAction && (
            <Text style={styles.infoText}>
              {gameState.currentAction === 'block' ? '🛡️ Blocking' : '🦶 Fouling'}
            </Text>
          )}
          {gameState.seedWord && (
            <Text style={styles.seedText}>Seed: {gameState.seedWord}</Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a472a',
    borderBottomWidth: 2,
    borderBottomColor: '#2d5a3d',
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
    marginBottom: 8,
  },
  leftSection: {
    width: 80,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    width: 80,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  phase: {
    fontSize: 14,
    color: '#a3a3a3',
    textAlign: 'center',
    marginTop: 2,
  },
  backButton: {
    backgroundColor: '#2d5a3d',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#4a7c59',
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  menuButton: {
    backgroundColor: '#2d5a3d',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#4a7c59',
    minWidth: 36,
    alignItems: 'center',
  },
  menuButtonText: {
    fontSize: 16,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#2d5a3d',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#4a7c59',
    marginRight: 8,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  gameInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  infoText: {
    fontSize: 12,
    color: '#fbbf24',
    fontWeight: '600',
  },
  seedText: {
    fontSize: 10,
    color: '#a3a3a3',
    marginTop: 2,
    fontFamily: 'monospace',
  },
});