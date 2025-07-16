import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { Skills } from '../types';
import Button from './ui/Button';

interface SkillsManagerProps {
  visible: boolean;
  skills: Skills;
  onUpdateSkills: (skills: Skills) => void;
  onClose: () => void;
}

export default function SkillsManager({ visible, skills, onUpdateSkills, onClose }: SkillsManagerProps) {
  const [currentSkills, setCurrentSkills] = useState<Skills>(skills);

  const availableSkills = {
    blocking: [
      { name: 'Block', description: 'Attacker ignores Both Down results' },
      { name: 'Wrestle', description: 'Push becomes Both Down when attacking' },
      { name: 'Dodge', description: 'Stumble becomes Push when defending' },
      { name: 'Side Step', description: 'Choose push direction (defensive)' },
      { name: 'Stand Firm', description: 'Cannot be pushed back (defensive)' },
      { name: 'Fend', description: 'Opponent cannot follow up (defensive)' },
      { name: 'Dauntless', description: 'Re-roll failed block dice vs higher ST' },
      { name: 'Juggernaut', description: 'Opponent cannot use Dodge, Side Step, or Stand Firm' }
    ],
    injury: [
      { name: 'Thick Skull', description: '+1 to armour value' },
      { name: 'Mighty Blow', description: '+1 to injury and casualty rolls' },
      { name: 'Piling On', description: '+1 to armour OR injury roll (choose one)' },
      { name: 'Claws', description: 'Modify armour rolls' },
      { name: 'Regeneration', description: 'Roll 4+ to ignore casualty' },
      { name: 'Decay', description: 'Nurgle rot effects on casualties' }
    ]
  };

  const toggleSkill = (skillName: string, player: 'attacker' | 'defender') => {
    setCurrentSkills(prev => {
      const newSkills = { ...prev };
      const skillList = newSkills[player];
      const index = skillList.indexOf(skillName);
      
      if (index > -1) {
        newSkills[player] = skillList.filter(skill => skill !== skillName);
      } else {
        newSkills[player] = [...skillList, skillName];
      }
      
      return newSkills;
    });
  };

  const handleSave = () => {
    onUpdateSkills(currentSkills);
    onClose();
  };

  const handleCancel = () => {
    setCurrentSkills(skills); // Reset to original
    onClose();
  };

  const clearAllSkills = () => {
    setCurrentSkills({ attacker: [], defender: [] });
  };

  const renderSkillButton = (skill: { name: string; description: string }, player: 'attacker' | 'defender') => {
    const isSelected = currentSkills[player].includes(skill.name);
    
    return (
      <TouchableOpacity
        key={skill.name}
        style={[styles.skillButton, isSelected && styles.skillButtonSelected]}
        onPress={() => toggleSkill(skill.name, player)}
        accessible={true}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isSelected }}
        accessibilityLabel={`${skill.name}: ${skill.description}`}
      >
        <View style={styles.skillHeader}>
          <Text style={[styles.skillName, isSelected && styles.skillNameSelected]}>
            {skill.name}
          </Text>
          <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
            {isSelected && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </View>
        <Text style={[styles.skillDescription, isSelected && styles.skillDescriptionSelected]}>
          {skill.description}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCancel}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>⚡ Skills Manager</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCancel}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Cancel skills editing"
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🗡️ Attacker Skills</Text>
            <Text style={styles.sectionSubtitle}>
              Skills that affect the attacking player
            </Text>
            
            <View style={styles.categorySection}>
              <Text style={styles.categoryTitle}>Block Phase Skills</Text>
              {availableSkills.blocking.map(skill => renderSkillButton(skill, 'attacker'))}
            </View>
            
            <View style={styles.categorySection}>
              <Text style={styles.categoryTitle}>Injury Phase Skills</Text>
              {availableSkills.injury.map(skill => renderSkillButton(skill, 'attacker'))}
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🛡️ Defender Skills</Text>
            <Text style={styles.sectionSubtitle}>
              Skills that affect the defending player
            </Text>
            
            <View style={styles.categorySection}>
              <Text style={styles.categoryTitle}>Block Phase Skills</Text>
              {availableSkills.blocking.map(skill => renderSkillButton(skill, 'defender'))}
            </View>
            
            <View style={styles.categorySection}>
              <Text style={styles.categoryTitle}>Injury Phase Skills</Text>
              {availableSkills.injury.map(skill => renderSkillButton(skill, 'defender'))}
            </View>
          </View>
          
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>📋 Current Selection</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Attacker:</Text>
              <Text style={styles.summaryValue}>
                {currentSkills.attacker.length > 0 
                  ? currentSkills.attacker.join(', ') 
                  : 'No skills selected'
                }
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Defender:</Text>
              <Text style={styles.summaryValue}>
                {currentSkills.defender.length > 0 
                  ? currentSkills.defender.join(', ') 
                  : 'No skills selected'
                }
              </Text>
            </View>
            
            <Button
              title="Clear All Skills"
              onPress={clearAllSkills}
              variant="secondary"
              size="medium"
              style={styles.clearButton}
            />
          </View>
        </ScrollView>
        
        <View style={styles.footer}>
          <View style={styles.footerButtons}>
            <Button
              title="Cancel"
              onPress={handleCancel}
              variant="secondary"
              size="large"
              style={styles.footerButton}
            />
            <Button
              title="Save Skills"
              onPress={handleSave}
              variant="success"
              size="large"
              style={styles.footerButton}
            />
          </View>
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
    marginBottom: 4,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#a3a3a3',
    marginBottom: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  categorySection: {
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fbbf24',
    marginBottom: 12,
  },
  skillButton: {
    backgroundColor: '#2d5a3d',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#4a7c59',
  },
  skillButtonSelected: {
    backgroundColor: '#166534',
    borderColor: '#22c55e',
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  skillName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  skillNameSelected: {
    color: '#ffffff',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#4a7c59',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2d5a3d',
  },
  checkboxSelected: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  skillDescription: {
    fontSize: 12,
    color: '#d1d5db',
    lineHeight: 16,
  },
  skillDescriptionSelected: {
    color: '#ffffff',
  },
  summarySection: {
    backgroundColor: '#1a472a',
    borderRadius: 12,
    padding: 16,
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
  summaryRow: {
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fbbf24',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 12,
    color: '#d1d5db',
    lineHeight: 16,
  },
  clearButton: {
    marginTop: 8,
    alignSelf: 'center',
    width: '60%',
  },
  footer: {
    padding: 16,
    backgroundColor: '#1a472a',
    borderTopWidth: 1,
    borderTopColor: '#2d5a3d',
  },
  footerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  footerButton: {
    flex: 1,
  },
});