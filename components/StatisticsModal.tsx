import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { RollStatistics } from '../types';
import Button from './ui/Button';

interface StatisticsModalProps {
  visible: boolean;
  statistics: RollStatistics;
  onClose: () => void;
}

export default function StatisticsModal({ visible, statistics, onClose }: StatisticsModalProps) {
  const getBlockDicePercentages = () => {
    const total = Object.values(statistics.blockDice).reduce((sum, count) => sum + count, 0);
    if (total === 0) return null;
    
    return {
      skull: ((statistics.blockDice.skull / total) * 100).toFixed(1),
      bothDown: ((statistics.blockDice.bothDown / total) * 100).toFixed(1),
      pow: ((statistics.blockDice.pow / total) * 100).toFixed(1),
      stumble: ((statistics.blockDice.stumble / total) * 100).toFixed(1),
      push: ((statistics.blockDice.push / total) * 100).toFixed(1),
      total
    };
  };

  const getRegularDiceStats = () => {
    const singleTotal = statistics.regularDice.singleD6.reduce((sum, count) => sum + count, 0);
    const doubleTotal = statistics.regularDice.doubleD6.flat().reduce((sum, count) => sum + count, 0);
    
    return { singleTotal, doubleTotal };
  };

  const getOutcomeStats = () => {
    const armourTotal = statistics.outcomes.armourBreaks + statistics.outcomes.armourHolds;
    const injuryTotal = Object.values(statistics.outcomes.injuries).reduce((sum, count) => sum + count, 0);
    const casualtyTotal = Object.values(statistics.outcomes.casualties).reduce((sum, count) => sum + count, 0);
    
    return { armourTotal, injuryTotal, casualtyTotal };
  };

  const blockPercentages = getBlockDicePercentages();
  const { singleTotal, doubleTotal } = getRegularDiceStats();
  const { armourTotal, injuryTotal, casualtyTotal } = getOutcomeStats();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>📊 Game Statistics</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Close statistics"
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {/* Block Dice Statistics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎲 Block Dice Results</Text>
            {blockPercentages ? (
              <View style={styles.statsGrid}>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>💀 Skull (Attacker Down)</Text>
                  <Text style={styles.statValue}>
                    {statistics.blockDice.skull} ({blockPercentages.skull}%)
                  </Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>⚔️ Both Down</Text>
                  <Text style={styles.statValue}>
                    {statistics.blockDice.bothDown} ({blockPercentages.bothDown}%)
                  </Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>💥 POW! (Defender Down)</Text>
                  <Text style={styles.statValue}>
                    {statistics.blockDice.pow} ({blockPercentages.pow}%)
                  </Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>❗ Stumble</Text>
                  <Text style={styles.statValue}>
                    {statistics.blockDice.stumble} ({blockPercentages.stumble}%)
                  </Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>↗️ Push</Text>
                  <Text style={styles.statValue}>
                    {statistics.blockDice.push} ({blockPercentages.push}%)
                  </Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total Block Dice:</Text>
                  <Text style={styles.totalValue}>{blockPercentages.total}</Text>
                </View>
              </View>
            ) : (
              <Text style={styles.noDataText}>No block dice rolled yet</Text>
            )}
          </View>
          
          {/* Expected vs Actual */}
          {blockPercentages && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📈 Expected vs Actual</Text>
              <View style={styles.comparisonGrid}>
                <View style={styles.comparisonRow}>
                  <Text style={styles.comparisonLabel}>Face</Text>
                  <Text style={styles.comparisonLabel}>Expected</Text>
                  <Text style={styles.comparisonLabel}>Actual</Text>
                </View>
                <View style={styles.comparisonRow}>
                  <Text style={styles.comparisonFace}>💀 Skull</Text>
                  <Text style={styles.comparisonValue}>16.7%</Text>
                  <Text style={styles.comparisonValue}>{blockPercentages.skull}%</Text>
                </View>
                <View style={styles.comparisonRow}>
                  <Text style={styles.comparisonFace}>⚔️ Both Down</Text>
                  <Text style={styles.comparisonValue}>16.7%</Text>
                  <Text style={styles.comparisonValue}>{blockPercentages.bothDown}%</Text>
                </View>
                <View style={styles.comparisonRow}>
                  <Text style={styles.comparisonFace}>💥 POW!</Text>
                  <Text style={styles.comparisonValue}>16.7%</Text>
                  <Text style={styles.comparisonValue}>{blockPercentages.pow}%</Text>
                </View>
                <View style={styles.comparisonRow}>
                  <Text style={styles.comparisonFace}>❗ Stumble</Text>
                  <Text style={styles.comparisonValue}>16.7%</Text>
                  <Text style={styles.comparisonValue}>{blockPercentages.stumble}%</Text>
                </View>
                <View style={styles.comparisonRow}>
                  <Text style={styles.comparisonFace}>↗️ Push</Text>
                  <Text style={styles.comparisonValue}>33.3%</Text>
                  <Text style={styles.comparisonValue}>{blockPercentages.push}%</Text>
                </View>
              </View>
            </View>
          )}
          
          {/* Regular Dice Statistics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎯 Regular Dice</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Single d6 rolls</Text>
                <Text style={styles.statValue}>{singleTotal}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Double d6 rolls (2d6)</Text>
                <Text style={styles.statValue}>{doubleTotal}</Text>
              </View>
            </View>
          </View>
          
          {/* Outcome Statistics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏆 Outcomes</Text>
            
            {armourTotal > 0 && (
              <View style={styles.outcomeGroup}>
                <Text style={styles.outcomeTitle}>🛡️ Armour Rolls</Text>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Armour Broken</Text>
                  <Text style={styles.statValue}>
                    {statistics.outcomes.armourBreaks} ({((statistics.outcomes.armourBreaks / armourTotal) * 100).toFixed(1)}%)
                  </Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Armour Held</Text>
                  <Text style={styles.statValue}>
                    {statistics.outcomes.armourHolds} ({((statistics.outcomes.armourHolds / armourTotal) * 100).toFixed(1)}%)
                  </Text>
                </View>
              </View>
            )}
            
            {injuryTotal > 0 && (
              <View style={styles.outcomeGroup}>
                <Text style={styles.outcomeTitle}>🩸 Injury Results</Text>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Stunned</Text>
                  <Text style={styles.statValue}>{statistics.outcomes.injuries.stunned}</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>KO'd</Text>
                  <Text style={styles.statValue}>{statistics.outcomes.injuries.ko}</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Casualties</Text>
                  <Text style={styles.statValue}>{statistics.outcomes.injuries.casualty}</Text>
                </View>
              </View>
            )}
            
            {casualtyTotal > 0 && (
              <View style={styles.outcomeGroup}>
                <Text style={styles.outcomeTitle}>💀 Casualty Results</Text>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Badly Hurt</Text>
                  <Text style={styles.statValue}>{statistics.outcomes.casualties.badlyHurt}</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Miss Next Game</Text>
                  <Text style={styles.statValue}>{statistics.outcomes.casualties.missNextGame}</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Niggling Injury</Text>
                  <Text style={styles.statValue}>{statistics.outcomes.casualties.nigglingInjury}</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Lasting Injury</Text>
                  <Text style={styles.statValue}>{statistics.outcomes.casualties.lastingInjury}</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Dead</Text>
                  <Text style={styles.statValue}>{statistics.outcomes.casualties.dead}</Text>
                </View>
              </View>
            )}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 Summary</Text>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total Rolls</Text>
              <Text style={styles.statValue}>{statistics.totalRolls}</Text>
            </View>
          </View>
        </ScrollView>
        
        <View style={styles.footer}>
          <Button
            title="Close"
            onPress={onClose}
            variant="primary"
            size="large"
            style={styles.closeButtonFull}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f2419',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1a472a',
    borderBottomWidth: 2,
    borderBottomColor: '#2d5a3d',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    backgroundColor: '#7f1d1d',
    borderRadius: 6,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    backgroundColor: '#1a472a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2d5a3d',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  statsGrid: {
    gap: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#d1d5db',
    flex: 1,
  },
  statValue: {
    fontSize: 14,
    color: '#ffffff',
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#2d5a3d',
  },
  totalLabel: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 16,
    color: '#fbbf24',
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  noDataText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  comparisonGrid: {
    gap: 4,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  comparisonLabel: {
    fontSize: 12,
    color: '#fbbf24',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  comparisonFace: {
    fontSize: 12,
    color: '#d1d5db',
    flex: 1,
  },
  comparisonValue: {
    fontSize: 12,
    color: '#ffffff',
    fontFamily: 'monospace',
    flex: 1,
    textAlign: 'center',
  },
  outcomeGroup: {
    marginBottom: 16,
  },
  outcomeTitle: {
    fontSize: 14,
    color: '#fbbf24',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  footer: {
    padding: 16,
    backgroundColor: '#1a472a',
    borderTopWidth: 1,
    borderTopColor: '#2d5a3d',
  },
  closeButtonFull: {
    width: '100%',
  },
});