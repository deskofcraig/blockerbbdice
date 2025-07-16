import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { GameState, ActionType, BlockDiceFace, Skills } from './types';
import { 
  initializeStatistics, 
  generateSeedWords, 
  initializeRng, 
  saveGameState, 
  loadGameState,
  createActionLogEntry
} from './utils/gameUtils';

// Import components
import StartScreen from './components/StartScreen';
import SeedSelection from './components/SeedSelection';
import ActionSelection from './components/ActionSelection';
import DiceSelector from './components/DiceSelector';
import BlockDiceRoll from './components/BlockDiceRoll';
import ResultSelector from './components/ResultSelector';
import ArmourValueInput from './components/ArmourValueInput';
import ArmourRoll from './components/ArmourRoll';
import InjuryRoll from './components/InjuryRoll';
import CasualtyRoll from './components/CasualtyRoll';
import ApothecaryChoice from './components/ApothecaryChoice';
import CompleteScreen from './components/CompleteScreen';
import ActionLog from './components/ActionLog';
import StatisticsModal from './components/StatisticsModal';
import SkillsManager from './components/SkillsManager';
import Header from './components/Header';

const initialGameState: GameState = {
  phase: 'start',
  currentAction: null,
  seedWord: '',
  diceCount: 1,
  blockDiceResults: [],
  selectedResult: null,
  armourValue: 9,
  isStunty: false,
  skills: {
    attacker: [],
    defender: []
  },
  statistics: initializeStatistics(),
  actionLog: [],
  gameId: '',
  apothecaryUsed: false
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showSkills, setShowSkills] = useState(false);
  const [seedWords, setSeedWords] = useState<string[]>([]);

  // Load saved game state on app start
  useEffect(() => {
    const savedState = loadGameState();
    if (savedState) {
      setGameState(savedState);
      if (savedState.seedWord) {
        initializeRng(savedState.seedWord);
      }
    }
  }, []);

  // Auto-save game state when it changes
  useEffect(() => {
    if (gameState.gameId) {
      saveGameState(gameState);
    }
  }, [gameState]);

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...updates }));
  };

  const addActionLogEntry = (action: string, result?: string) => {
    const entry = createActionLogEntry(gameState.phase, action, undefined, result);
    updateGameState({
      actionLog: [...gameState.actionLog, entry]
    });
  };

  const startNewGame = () => {
    const newGameId = Date.now().toString();
    const words = generateSeedWords();
    setSeedWords(words);
    
    updateGameState({
      ...initialGameState,
      gameId: newGameId,
      phase: 'seedSelection',
      statistics: gameState.statistics // Preserve statistics across games
    });
    
    addActionLogEntry('New game started');
  };

  const selectSeedWord = (seedWord: string) => {
    initializeRng(seedWord);
    updateGameState({
      seedWord,
      phase: 'actionSelection'
    });
    addActionLogEntry(`Seed word selected: ${seedWord}`);
  };

  const selectAction = (action: ActionType) => {
    updateGameState({
      currentAction: action,
      phase: action === 'block' ? 'diceSelection' : 'armourValue'
    });
    addActionLogEntry(`${action === 'block' ? 'Block' : 'Foul'} action selected`);
  };

  const selectDiceCount = (count: number) => {
    updateGameState({
      diceCount: count,
      phase: 'diceRoll'
    });
    addActionLogEntry(`${count} dice selected for block`);
  };

  const handleDiceRolled = (results: any[]) => {
    updateGameState({
      blockDiceResults: results,
      phase: 'resultSelection'
    });
    
    // Update block dice statistics
    const newStats = { ...gameState.statistics };
    results.forEach(result => {
      newStats.blockDice[result.face]++;
    });
    newStats.totalRolls++;
    
    updateGameState({
      statistics: newStats
    });
    
    const resultText = results.map(r => `${r.emoji} ${r.face}`).join(', ');
    addActionLogEntry(`Block dice rolled: ${resultText}`);
  };

  const selectResult = (result: BlockDiceFace) => {
    updateGameState({
      selectedResult: result,
      phase: 'armourValue'
    });
    addActionLogEntry(`Block result selected: ${result}`);
  };

  const setArmourValue = (av: number, stunty: boolean) => {
    updateGameState({
      armourValue: av,
      isStunty: stunty,
      phase: 'armourRoll'
    });
    addActionLogEntry(`Armour Value set: ${av}${stunty ? ' (Stunty)' : ''}`);
  };

  const handleArmourRoll = (roll: any, success: boolean) => {
    updateGameState({
      lastArmourRoll: roll,
      phase: success ? 'injuryRoll' : 'complete'
    });
    
    // Update statistics
    const newStats = { ...gameState.statistics };
    if (success) {
      newStats.outcomes.armourBreaks++;
    } else {
      newStats.outcomes.armourHolds++;
    }
    
    updateGameState({ statistics: newStats });
    addActionLogEntry(`Armour roll: ${roll.result} (${success ? 'Broken' : 'Held'})`);
  };

  const handleInjuryRoll = (roll: any, result: string) => {
    updateGameState({
      lastInjuryRoll: roll,
      phase: result === 'Casualty!' ? 'casualtyRoll' : 'complete'
    });
    
    // Update injury statistics
    const newStats = { ...gameState.statistics };
    if (result === 'Stunned') newStats.outcomes.injuries.stunned++;
    else if (result === 'KO\'d') newStats.outcomes.injuries.ko++;
    else if (result === 'Casualty!' || result === 'Badly Hurt') newStats.outcomes.injuries.casualty++;
    
    updateGameState({ statistics: newStats });
    addActionLogEntry(`Injury roll: ${roll.result} (${result})`);
  };

  const handleCasualtyRoll = (roll: any, result: string) => {
    updateGameState({
      lastCasualtyRoll: roll,
      phase: 'apothecary'
    });
    
    // Update casualty statistics
    const newStats = { ...gameState.statistics };
    if (result === 'Badly Hurt') newStats.outcomes.casualties.badlyHurt++;
    else if (result === 'Miss Next Game') newStats.outcomes.casualties.missNextGame++;
    else if (result === 'Niggling Injury') newStats.outcomes.casualties.nigglingInjury++;
    else if (result === 'Lasting Injury') newStats.outcomes.casualties.lastingInjury++;
    else if (result === 'DEAD') newStats.outcomes.casualties.dead++;
    
    updateGameState({ statistics: newStats });
    addActionLogEntry(`Casualty roll: ${roll.result} (${result})`);
  };

  const handleApothecaryChoice = (useApothecary: boolean) => {
    updateGameState({
      apothecaryUsed: useApothecary,
      phase: 'complete'
    });
    
    if (useApothecary) {
      addActionLogEntry('Apothecary used');
    } else {
      addActionLogEntry('Apothecary not used');
    }
  };

  const completeAction = () => {
    updateGameState({
      phase: 'actionSelection',
      currentAction: null,
      blockDiceResults: [],
      selectedResult: null,
      lastArmourRoll: undefined,
      lastInjuryRoll: undefined,
      lastCasualtyRoll: undefined,
      apothecaryUsed: false
    });
    addActionLogEntry('Action completed - ready for next action');
  };

  const resetGame = () => {
    setGameState(initialGameState);
    addActionLogEntry('Game reset');
  };

  const goBack = () => {
    const phaseOrder: GameState['phase'][] = [
      'start', 'seedSelection', 'actionSelection', 'diceSelection', 
      'diceRoll', 'resultSelection', 'armourValue', 'armourRoll', 
      'injuryRoll', 'casualtyRoll', 'apothecary', 'complete'
    ];
    
    const currentIndex = phaseOrder.indexOf(gameState.phase);
    if (currentIndex > 0) {
      const previousPhase = phaseOrder[currentIndex - 1];
      updateGameState({ phase: previousPhase });
    }
  };

  const updateSkills = (skills: Skills) => {
    updateGameState({ skills });
    addActionLogEntry('Skills updated');
  };

  const renderCurrentPhase = () => {
    switch (gameState.phase) {
      case 'start':
        return <StartScreen onStartGame={startNewGame} />;
      
      case 'seedSelection':
        return (
          <SeedSelection 
            seedWords={seedWords}
            onSelectSeed={selectSeedWord}
          />
        );
      
      case 'actionSelection':
        return (
          <ActionSelection 
            onSelectAction={selectAction}
          />
        );
      
      case 'diceSelection':
        return (
          <DiceSelector 
            onSelectDice={selectDiceCount}
          />
        );
      
      case 'diceRoll':
        return (
          <BlockDiceRoll 
            diceCount={gameState.diceCount}
            onDiceRolled={handleDiceRolled}
          />
        );
      
      case 'resultSelection':
        return (
          <ResultSelector 
            results={gameState.blockDiceResults}
            skills={gameState.skills}
            onSelectResult={selectResult}
          />
        );
      
      case 'armourValue':
        return (
          <ArmourValueInput 
            onSetArmourValue={setArmourValue}
            currentAction={gameState.currentAction}
          />
        );
      
      case 'armourRoll':
        return (
          <ArmourRoll 
            armourValue={gameState.armourValue}
            skills={gameState.skills}
            onRollComplete={handleArmourRoll}
          />
        );
      
      case 'injuryRoll':
        return (
          <InjuryRoll 
            isStunty={gameState.isStunty}
            skills={gameState.skills}
            onRollComplete={handleInjuryRoll}
          />
        );
      
      case 'casualtyRoll':
        return (
          <CasualtyRoll 
            skills={gameState.skills}
            onRollComplete={handleCasualtyRoll}
          />
        );
      
      case 'apothecary':
        return (
          <ApothecaryChoice 
            lastRoll={gameState.lastCasualtyRoll}
            onChoice={handleApothecaryChoice}
          />
        );
      
      case 'complete':
        return (
          <CompleteScreen 
            gameState={gameState}
            onNewAction={completeAction}
            onNewGame={startNewGame}
          />
        );
      
      default:
        return <StartScreen onStartGame={startNewGame} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a472a" />
      
      <Header 
        gameState={gameState}
        onShowStatistics={() => setShowStatistics(true)}
        onShowSkills={() => setShowSkills(true)}
        onReset={resetGame}
        onGoBack={goBack}
      />
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {renderCurrentPhase()}
      </ScrollView>
      
      <ActionLog 
        entries={gameState.actionLog}
        currentPhase={gameState.phase}
      />
      
      <StatisticsModal 
        visible={showStatistics}
        statistics={gameState.statistics}
        onClose={() => setShowStatistics(false)}
      />
      
      <SkillsManager 
        visible={showSkills}
        skills={gameState.skills}
        onUpdateSkills={updateSkills}
        onClose={() => setShowSkills(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f2419',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    padding: 16,
  },
});