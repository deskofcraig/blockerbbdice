import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BlockDiceResult, BlockDiceFace, Skills } from '../types';
import { applySkillsToResult } from '../utils/gameUtils';
import Card from './ui/Card';
import Button from './ui/Button';

interface ResultSelectorProps {
  results: BlockDiceResult[];
  skills: Skills;
  onSelectResult: (result: BlockDiceFace) => void;
}

export default function ResultSelector({ results, skills, onSelectResult }: ResultSelectorProps) {
  const [selectedResult, setSelectedResult] = useState<BlockDiceFace | null>(null);
  const [appliedSkills, setAppliedSkills] = useState<string[]>([]);

  const getResultDescription = (face: BlockDiceFace): string => {
    switch (face) {
      case 'skull':
        return 'Attacker Down - The blocker is knocked down!';
      case 'bothDown':
        return 'Both Down - Both players are knocked down';
      case 'pow':
        return 'POW! - Defender is pushed back and knocked down';
      case 'stumble':
        return 'Stumble - Defender stumbles (can use Dodge)';
      case 'push':
        return 'Push - Defender is pushed back';
      default:
        return '';
    }
  };

  const getSkillOptions = (face: BlockDiceFace): string[] => {
    const options: string[] = [];
    
    if (face === 'bothDown' && skills.attacker.includes('Block')) {
      options.push('Block - Attacker ignores Both Down');
    }
    
    if (face === 'push' && skills.attacker.includes('Wrestle')) {
      options.push('Wrestle - Push becomes Both Down');
    }
    
    if (face === 'stumble' && skills.defender.includes('Dodge')) {
      options.push('Dodge - Stumble becomes Push');
    }
    
    return options;
  };

  const applySkillsAndSelect = (originalResult: BlockDiceFace) => {
    const modifiedResult = applySkillsToResult(originalResult, skills);
    onSelectResult(modifiedResult);
  };

  const renderResult = (result: BlockDiceResult, index: number) => {
    const skillOptions = getSkillOptions(result.face);
    const isSelectable = results.length > 1; // Can only choose if multiple dice
    
    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.resultOption,
          selectedResult === result.face && styles.selectedResult,
          !isSelectable && styles.singleResult
        ]}
        onPress={() => isSelectable ? setSelectedResult(result.face) : applySkillsAndSelect(result.face)}
        disabled={isSelectable && selectedResult !== result.face && selectedResult !== null}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`${result.face} result`}
        accessibilityHint={getResultDescription(result.face)}
      >
        <View style={styles.resultHeader}>
          <Text style={styles.resultEmoji}>{result.emoji}</Text>
          <Text style={styles.resultName}>{result.face.toUpperCase()}</Text>
        </View>
        
        <Text style={styles.resultDescription}>
          {getResultDescription(result.face)}
        </Text>
        
        {skillOptions.length > 0 && (
          <View style={styles.skillOptions}>
            <Text style={styles.skillTitle}>Available Skills:</Text>
            {skillOptions.map((skill, skillIndex) => (
              <Text key={skillIndex} style={styles.skillText}>
                • {skill}
              </Text>
            ))}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Card title="⚔️ Select Result" variant="highlight">
        <View style={styles.content}>
          <Text style={styles.description}>
            {results.length > 1 
              ? "Choose which result to apply (stronger player chooses):"
              : "Apply the rolled result:"
            }
          </Text>
          
          <View style={styles.results}>
            {results.map((result, index) => renderResult(result, index))}
          </View>
          
          {results.length > 1 && selectedResult && (
            <View style={styles.actionSection}>
              <Button
                title="Apply Selected Result"
                onPress={() => applySkillsAndSelect(selectedResult)}
                variant="success"
                size="large"
                style={styles.applyButton}
              />
            </View>
          )}
          
          <View style={styles.rerollSection}>
            <Text style={styles.rerollText}>
              Need to use a re-roll? Use your team's re-roll before selecting a result.
            </Text>
            <Button
              title="Use Re-roll"
              onPress={() => {/* Re-roll functionality would be handled by parent */}}
              variant="secondary"
              size="medium"
              style={styles.rerollButton}
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
  results: {
    width: '100%',
    marginBottom: 24,
  },
  resultOption: {
    backgroundColor: '#2d5a3d',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4a7c59',
    padding: 16,
    marginBottom: 12,
  },
  selectedResult: {
    borderColor: '#22c55e',
    backgroundColor: '#166534',
  },
  singleResult: {
    borderColor: '#fbbf24',
    backgroundColor: '#d97706',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  resultName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  resultDescription: {
    fontSize: 14,
    color: '#d1d5db',
    marginBottom: 8,
    lineHeight: 18,
  },
  skillOptions: {
    backgroundColor: '#1a472a',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  skillTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 6,
  },
  skillText: {
    fontSize: 12,
    color: '#a3a3a3',
    marginBottom: 2,
  },
  actionSection: {
    width: '100%',
    marginBottom: 24,
  },
  applyButton: {
    width: '100%',
  },
  rerollSection: {
    width: '100%',
    alignItems: 'center',
  },
  rerollText: {
    fontSize: 14,
    color: '#a3a3a3',
    textAlign: 'center',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  rerollButton: {
    width: '60%',
  },
});