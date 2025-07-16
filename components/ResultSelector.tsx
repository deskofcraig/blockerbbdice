import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Card from './ui/Card';
import Button from './ui/Button';
import { BlockDiceResult, BLOCK_DICE_EMOJIS, PlayerSkills, AttackerSkill, DefenderSkill } from '../types';

interface ResultSelectorProps {
  results: BlockDiceResult[];
  appliedSkills: PlayerSkills;
  onSelectResult: (result: BlockDiceResult, skills: PlayerSkills) => void;
  onBack: () => void;
}

export default function ResultSelector({ 
  results, 
  appliedSkills, 
  onSelectResult, 
  onBack 
}: ResultSelectorProps) {
  const [selectedResult, setSelectedResult] = useState<BlockDiceResult | null>(null);
  const [currentSkills, setCurrentSkills] = useState<PlayerSkills>(appliedSkills);

  const getResultName = (result: BlockDiceResult): string => {
    const names = {
      'skull': 'Attacker Down',
      'both-down': 'Both Down',
      'pow': 'Defender Down',
      'stumble': 'Stumble',
      'push': 'Push'
    };
    return names[result];
  };

  const getResultDescription = (result: BlockDiceResult): string => {
    const descriptions = {
      'skull': 'The attacker is knocked down',
      'both-down': 'Both players are knocked down',
      'pow': 'The defender is knocked down',
      'stumble': 'The defender stumbles (can be modified by Dodge)',
      'push': 'The defender is pushed back'
    };
    return descriptions[result];
  };

  const applySkillModifications = (result: BlockDiceResult, skills: PlayerSkills): BlockDiceResult => {
    let modifiedResult = result;

    // Apply attacker skills
    if (skills.attacker.includes('block') && result === 'both-down') {
      modifiedResult = 'push'; // Block skill: ignore both down for attacker
    }
    if (skills.attacker.includes('wrestle') && result === 'push') {
      modifiedResult = 'both-down'; // Wrestle: push becomes both down
    }

    // Apply defender skills
    if (skills.defender.includes('dodge') && result === 'stumble') {
      modifiedResult = 'push'; // Dodge: stumble becomes push
    }

    return modifiedResult;
  };

  const getModifiedResult = (result: BlockDiceResult): BlockDiceResult => {
    return applySkillModifications(result, currentSkills);
  };

  const toggleAttackerSkill = (skill: AttackerSkill) => {
    setCurrentSkills(prev => ({
      ...prev,
      attacker: prev.attacker.includes(skill)
        ? prev.attacker.filter(s => s !== skill)
        : [...prev.attacker, skill]
    }));
  };

  const toggleDefenderSkill = (skill: DefenderSkill) => {
    setCurrentSkills(prev => ({
      ...prev,
      defender: prev.defender.includes(skill)
        ? prev.defender.filter(s => s !== skill)
        : [...prev.defender, skill]
    }));
  };

  const handleContinue = () => {
    if (selectedResult) {
      onSelectResult(getModifiedResult(selectedResult), currentSkills);
    }
  };

  const isSkillApplicable = (skill: AttackerSkill | DefenderSkill, result: BlockDiceResult): boolean => {
    switch (skill) {
      case 'block':
        return result === 'both-down';
      case 'wrestle':
        return result === 'push';
      case 'dodge':
        return result === 'stumble';
      default:
        return true;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card title="Select Result & Apply Skills">
        <View style={styles.content}>
          <Text style={styles.description}>
            Choose your result and apply any relevant skills:
          </Text>
          
          <View style={styles.resultsContainer}>
            {results.map((result, index) => {
              const modifiedResult = getModifiedResult(result);
              const isModified = result !== modifiedResult;
              
              return (
                <View key={index} style={styles.resultOption}>
                  <Button
                    title={`${BLOCK_DICE_EMOJIS[result]} ${getResultName(result)}`}
                    onPress={() => setSelectedResult(result)}
                    variant={selectedResult === result ? 'primary' : 'secondary'}
                    size="medium"
                    style={styles.resultButton}
                  />
                  
                  {isModified && (
                    <View style={styles.modificationNote}>
                      <Text style={styles.modificationText}>
                        Modified to: {BLOCK_DICE_EMOJIS[modifiedResult]} {getResultName(modifiedResult)}
                      </Text>
                    </View>
                  )}
                  
                  <Text style={styles.resultDescription}>
                    {getResultDescription(isModified ? modifiedResult : result)}
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={styles.skillsSection}>
            <Text style={styles.skillsTitle}>🛡️ Attacker Skills:</Text>
            <View style={styles.skillsGrid}>
              {(['block', 'wrestle', 'dauntless', 'juggernaut'] as AttackerSkill[]).map(skill => (
                <Button
                  key={skill}
                  title={skill.toUpperCase()}
                  onPress={() => toggleAttackerSkill(skill)}
                  variant={currentSkills.attacker.includes(skill) ? 'success' : 'secondary'}
                  size="small"
                  style={styles.skillButton}
                />
              ))}
            </View>

            <Text style={styles.skillsTitle}>⚔️ Defender Skills:</Text>
            <View style={styles.skillsGrid}>
              {(['dodge', 'side-step', 'stand-firm', 'fend'] as DefenderSkill[]).map(skill => (
                <Button
                  key={skill}
                  title={skill.toUpperCase()}
                  onPress={() => toggleDefenderSkill(skill)}
                  variant={currentSkills.defender.includes(skill) ? 'success' : 'secondary'}
                  size="small"
                  style={styles.skillButton}
                />
              ))}
            </View>
          </View>

          <View style={styles.actions}>
            <Button
              title="Continue with Selected Result"
              onPress={handleContinue}
              variant="primary"
              size="large"
              disabled={!selectedResult}
              style={styles.continueButton}
            />
            
            <Button
              title="← Back to Dice Roll"
              onPress={onBack}
              variant="secondary"
              size="medium"
              style={styles.backButton}
            />
          </View>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2F2F2F', // dark-stone
  },
  content: {
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  resultsContainer: {
    width: '100%',
    marginBottom: 24,
  },
  resultOption: {
    marginBottom: 16,
  },
  resultButton: {
    marginBottom: 4,
  },
  modificationNote: {
    backgroundColor: '#E3F2FD',
    borderRadius: 4,
    padding: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  modificationText: {
    fontSize: 14,
    color: '#1976D2',
    textAlign: 'center',
    fontWeight: '500',
  },
  resultDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  skillsSection: {
    width: '100%',
    marginBottom: 24,
  },
  skillsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  skillButton: {
    width: '48%',
    marginBottom: 8,
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