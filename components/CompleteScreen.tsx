import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GameState } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';

interface CompleteScreenProps {
  gameState: GameState;
  onNewAction: () => void;
  onNewGame: () => void;
}

export default function CompleteScreen({ gameState, onNewAction, onNewGame }: CompleteScreenProps) {
  const getSummaryData = () => {
    const summary = {
      action: gameState.currentAction === 'block' ? 'Block' : 'Foul',
      blockResult: gameState.selectedResult,
      armourResult: gameState.lastArmourRoll ? 
        `${gameState.lastArmourRoll.result} ${gameState.lastArmourRoll.result >= gameState.armourValue ? '(Broken)' : '(Held)'}` : 
        'Not rolled',
      injuryResult: gameState.lastInjuryRoll ? 
        `${gameState.lastInjuryRoll.result}` : 
        'No injury roll',
      casualtyResult: gameState.lastCasualtyRoll ? 
        `${gameState.lastCasualtyRoll.result}` : 
        'No casualty roll',
      apothecaryUsed: gameState.apothecaryUsed
    };
    
    return summary;
  };

  const getOutcomeIcon = (): string => {
    if (gameState.lastCasualtyRoll) {
      const roll = gameState.lastCasualtyRoll.result;
      if (roll >= 15) return '💀'; // Dead
      if (roll >= 13) return '🩹'; // Lasting injury
      if (roll >= 10) return '🤕'; // Serious injury
      return '😵'; // Hurt
    }
    
    if (gameState.lastInjuryRoll) {
      const result = gameState.lastInjuryRoll.result;
      if (result >= 10) return '🩸'; // Casualty
      if (result >= 8) return '😴'; // KO
      return '😵‍💫'; // Stunned
    }
    
    if (gameState.lastArmourRoll) {
      return gameState.lastArmourRoll.result >= gameState.armourValue ? '💥' : '🛡️';
    }
    
    return '✅';
  };

  const getOutcomeDescription = (): string => {
    if (gameState.lastCasualtyRoll) {
      const roll = gameState.lastCasualtyRoll.result;
      if (roll >= 15) return 'Player is DEAD! Removed from team permanently.';
      if (roll >= 13) return 'Lasting Injury - permanent characteristic reduction.';
      if (roll >= 10) return 'Serious Injury with niggling injury.';
      if (roll >= 7) return 'Seriously hurt - misses next game.';
      return 'Badly hurt - misses rest of this game only.';
    }
    
    if (gameState.lastInjuryRoll) {
      const result = gameState.lastInjuryRoll.result;
      if (result >= 10) return 'Casualty suffered - serious injury sustained.';
      if (result >= 8) return 'Player knocked out - goes to KO box.';
      return 'Player stunned - remains on pitch face down.';
    }
    
    if (gameState.lastArmourRoll) {
      return gameState.lastArmourRoll.result >= gameState.armourValue ? 
        'Armour broken - injury risk!' : 
        'Armour held - no injury sustained.';
    }
    
    return `${gameState.currentAction === 'block' ? 'Block' : 'Foul'} action completed successfully.`;
  };

  const summary = getSummaryData();

  return (
    <View style={styles.container}>
      <Card title="✅ Action Complete" variant="success">
        <View style={styles.content}>
          <View style={styles.outcomeHeader}>
            <Text style={styles.outcomeIcon}>{getOutcomeIcon()}</Text>
            <Text style={styles.outcomeTitle}>
              {summary.action} Action Complete
            </Text>
          </View>
          
          <Text style={styles.outcomeDescription}>
            {getOutcomeDescription()}
          </Text>
          
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>📋 Action Summary</Text>
            
            <View style={styles.summaryGrid}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Action Type:</Text>
                <Text style={styles.summaryValue}>
                  {summary.action} {gameState.diceCount > 0 && `(${gameState.diceCount} dice)`}
                </Text>
              </View>
              
              {gameState.selectedResult && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Block Result:</Text>
                  <Text style={styles.summaryValue}>{gameState.selectedResult.toUpperCase()}</Text>
                </View>
              )}
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Armour Value:</Text>
                <Text style={styles.summaryValue}>
                  {gameState.armourValue}{gameState.isStunty ? ' (Stunty)' : ''}
                </Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Armour Roll:</Text>
                <Text style={styles.summaryValue}>{summary.armourResult}</Text>
              </View>
              
              {gameState.lastInjuryRoll && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Injury Roll:</Text>
                  <Text style={styles.summaryValue}>{summary.injuryResult}</Text>
                </View>
              )}
              
              {gameState.lastCasualtyRoll && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Casualty Roll:</Text>
                  <Text style={styles.summaryValue}>{summary.casualtyResult}</Text>
                </View>
              )}
              
              {summary.apothecaryUsed && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Apothecary:</Text>
                  <Text style={styles.summaryValue}>Used ⚕️</Text>
                </View>
              )}
              
              {(gameState.skills.attacker.length > 0 || gameState.skills.defender.length > 0) && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Skills Applied:</Text>
                  <Text style={styles.summaryValue}>
                    {[...gameState.skills.attacker, ...gameState.skills.defender].join(', ') || 'None'}
                  </Text>
                </View>
              )}
            </View>
          </View>
          
          <View style={styles.statisticsPreview}>
            <Text style={styles.statsTitle}>📊 Game Statistics</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{gameState.statistics.totalRolls}</Text>
                <Text style={styles.statLabel}>Total Rolls</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {Object.values(gameState.statistics.blockDice).reduce((sum, count) => sum + count, 0)}
                </Text>
                <Text style={styles.statLabel}>Block Dice</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {gameState.statistics.outcomes.armourBreaks + gameState.statistics.outcomes.armourHolds}
                </Text>
                <Text style={styles.statLabel}>Armour Rolls</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {Object.values(gameState.statistics.outcomes.casualties).reduce((sum, count) => sum + count, 0)}
                </Text>
                <Text style={styles.statLabel}>Casualties</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.actionButtons}>
            <Button
              title="Another Action"
              onPress={onNewAction}
              variant="primary"
              size="large"
              style={styles.actionButton}
            />
            
            <Button
              title="New Game"
              onPress={onNewGame}
              variant="secondary"
              size="large"
              style={styles.actionButton}
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
    padding: 16,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  outcomeHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  outcomeIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  outcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  outcomeDescription: {
    fontSize: 16,
    color: '#d1d5db',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  summarySection: {
    backgroundColor: '#1a472a',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: '#2d5a3d',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  summaryGrid: {
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#a3a3a3',
    flex: 1,
  },
  summaryValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  statisticsPreview: {
    backgroundColor: '#1a472a',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: '#2d5a3d',
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fbbf24',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#a3a3a3',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  actionButton: {
    flex: 1,
  },
});