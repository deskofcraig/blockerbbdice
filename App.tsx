import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { GameState, GamePhase, ActionType, BlockDiceResult, PlayerSkills, ActionLogEntry, RollStatistics } from './types';
import { initializeRandom } from './utils/dice';
import { createEmptyStatistics, loadStatistics, saveStatistics } from './utils/statistics';

// Components
import GameStart from './components/GameStart';
import ActionSelect from './components/ActionSelect';
import DiceSelector from './components/DiceSelector';
import BlockDiceRoll from './components/BlockDiceRoll';
import ResultSelector from './components/ResultSelector';
import ArmourValueInput from './components/ArmourValueInput';
import ActionComplete from './components/ActionComplete';

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'game-start',
    appliedSkills: {
      attacker: [],
      defender: []
    },
    actionLog: [],
    statistics: createEmptyStatistics()
  });

  // Load statistics on app start
  useEffect(() => {
    loadStatistics().then(stats => {
      setGameState(prevState => ({
        ...prevState,
        statistics: stats
      }));
    });
  }, []);

  // Save statistics whenever they change
  useEffect(() => {
    saveStatistics(gameState.statistics);
  }, [gameState.statistics]);

  const addToActionLog = (entry: Omit<ActionLogEntry, 'id' | 'timestamp'>) => {
    const newEntry: ActionLogEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date()
    };

    setGameState(prevState => ({
      ...prevState,
      actionLog: [newEntry, ...prevState.actionLog]
    }));
  };

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState(prevState => ({
      ...prevState,
      ...updates
    }));
  };

  const goToPhase = (phase: GamePhase) => {
    updateGameState({ phase });
  };

  const handleGameStart = (seedWord: string) => {
    initializeRandom(seedWord);
    updateGameState({
      phase: 'action-select',
      seedWord
    });
    
    addToActionLog({
      phase: 'game-start',
      action: 'block', // Default, will be updated
      description: `Game started with seed word: ${seedWord}`,
      icon: '🎮'
    });
  };

  const handleActionSelect = (action: ActionType) => {
    if (action === 'block') {
      updateGameState({
        phase: 'dice-select',
        actionType: action
      });
    } else {
      // For fouls, skip directly to armour value
      updateGameState({
        phase: 'armour-value',
        actionType: action
      });
    }
    
    addToActionLog({
      phase: 'action-select',
      action,
      description: `Selected ${action.toUpperCase()} action`,
      icon: action === 'block' ? '🏈' : '⚡'
    });
  };

  const handleDiceSelect = (count: number) => {
    updateGameState({
      phase: 'dice-roll',
      diceCount: count
    });
    
    addToActionLog({
      phase: 'dice-select',
      action: gameState.actionType!,
      description: `Selected ${count} block ${count === 1 ? 'die' : 'dice'}`,
      icon: '🎲'
    });
  };

  const handleDiceRoll = (results: BlockDiceResult[]) => {
    updateGameState({
      phase: 'result-select',
      blockDiceResults: results
    });
    
    addToActionLog({
      phase: 'dice-roll',
      action: gameState.actionType!,
      description: `Rolled: ${results.join(', ')}`,
      result: results,
      icon: '🎲'
    });
    
    // Update statistics for block dice
    // This would be implemented with the statistics utility functions
  };

  const handleResultSelect = (result: BlockDiceResult, skills: PlayerSkills) => {
    updateGameState({
      phase: 'armour-value',
      selectedResult: result,
      appliedSkills: skills
    });
    
    addToActionLog({
      phase: 'result-select',
      action: gameState.actionType!,
      description: `Selected result: ${result}`,
      result: { result, skills },
      icon: '✅'
    });
  };

  const handleArmourValueSet = (armourValue: number, isStunty: boolean) => {
    updateGameState({
      phase: 'complete',
      armourValue,
      isStunty
    });
    
    addToActionLog({
      phase: 'armour-value',
      action: gameState.actionType!,
      description: `Set AV ${armourValue}+ ${isStunty ? '(Stunty)' : ''}`,
      result: { armourValue, isStunty },
      icon: '🛡️'
    });
  };

  const handleNewAction = () => {
    updateGameState({
      phase: 'action-select',
      // Reset action-specific state but keep seed word and statistics
      diceCount: undefined,
      blockDiceResults: undefined,
      selectedResult: undefined,
      armourValue: undefined,
      isStunty: undefined,
      appliedSkills: {
        attacker: [],
        defender: []
      }
    });
  };

  const handleShowStatistics = () => {
    // TODO: Implement statistics modal
    console.log('Statistics:', gameState.statistics);
  };

  const resetGame = () => {
    setGameState({
      phase: 'action-select',
      actionType: gameState.actionType,
      seedWord: gameState.seedWord,
      appliedSkills: {
        attacker: [],
        defender: []
      },
      actionLog: gameState.actionLog,
      statistics: gameState.statistics
    });
    
    addToActionLog({
      phase: 'complete',
      action: gameState.actionType!,
      description: 'Action completed - ready for next action',
      icon: '✅'
    });
  };

  const goBack = () => {
    switch (gameState.phase) {
      case 'action-select':
        goToPhase('game-start');
        break;
      case 'dice-select':
        goToPhase('action-select');
        break;
      case 'dice-roll':
        goToPhase('dice-select');
        break;
      case 'result-select':
        goToPhase('dice-roll');
        break;
      case 'armour-value':
        if (gameState.actionType === 'block') {
          goToPhase('result-select');
        } else {
          goToPhase('action-select');
        }
        break;
      case 'complete':
        goToPhase('armour-value');
        break;
      default:
        // For other phases, implement specific back navigation
        break;
    }
  };

  const renderCurrentPhase = () => {
    switch (gameState.phase) {
      case 'game-start':
        return <GameStart onStart={handleGameStart} />;
      
      case 'action-select':
        return (
          <ActionSelect 
            onSelectAction={handleActionSelect} 
            seedWord={gameState.seedWord!}
          />
        );
      
      case 'dice-select':
        return (
          <DiceSelector 
            onSelectDice={handleDiceSelect}
            onBack={goBack}
          />
        );
      
      case 'dice-roll':
        return (
          <BlockDiceRoll 
            diceCount={gameState.diceCount!}
            onRollComplete={handleDiceRoll}
            onBack={goBack}
          />
        );
      
      case 'result-select':
        return (
          <ResultSelector
            results={gameState.blockDiceResults!}
            appliedSkills={gameState.appliedSkills}
            onSelectResult={handleResultSelect}
            onBack={goBack}
          />
        );
      
      case 'armour-value':
        return (
          <ArmourValueInput
            onSetArmourValue={handleArmourValueSet}
            onBack={goBack}
          />
        );
      
      case 'complete':
        return (
          <ActionComplete
            gameState={gameState}
            onNewAction={handleNewAction}
            onShowStatistics={handleShowStatistics}
          />
        );
      
      default:
        return (
          <View style={styles.placeholder}>
            {/* Placeholder for phases not yet implemented */}
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      {renderCurrentPhase()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2F2F2F', // dark-stone
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2F2F2F',
  },
});