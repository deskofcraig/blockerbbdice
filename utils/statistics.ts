import AsyncStorage from '@react-native-async-storage/async-storage';
import { RollStatistics, BlockDiceResult, InjuryResult, CasualtyResult } from '../types';

const STORAGE_KEY = 'blocker_bb_dice_statistics';

// Initialize empty statistics
export function createEmptyStatistics(): RollStatistics {
  return {
    blockDice: {
      total: 0,
      results: {
        'skull': 0,
        'both-down': 0,
        'pow': 0,
        'stumble': 0,
        'push': 0
      }
    },
    regularDice: {
      d6: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
      d2d6: { 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0 },
      total: 0
    },
    armourRolls: {
      total: 0,
      breaks: 0,
      holds: 0
    },
    injuryRolls: {
      total: 0,
      results: {
        'stunned': 0,
        'ko': 0,
        'casualty': 0,
        'badly-hurt': 0
      }
    },
    casualtyRolls: {
      total: 0,
      results: {
        'badly-hurt': 0,
        'miss-next-game': 0,
        'niggling-injury': 0,
        'lasting-injury': 0,
        'dead': 0
      }
    },
    outcomes: {
      totalActions: 0,
      completedActions: 0,
      injuries: 0,
      casualties: 0
    }
  };
}

// Update block dice statistics
export function updateBlockDiceStats(stats: RollStatistics, results: BlockDiceResult[]): RollStatistics {
  const newStats = { ...stats };
  
  results.forEach(result => {
    newStats.blockDice.results[result]++;
    newStats.blockDice.total++;
  });
  
  return newStats;
}

// Update regular dice statistics
export function updateRegularDiceStats(stats: RollStatistics, dice: number[]): RollStatistics {
  const newStats = { ...stats };
  
  dice.forEach(die => {
    if (die >= 1 && die <= 6) {
      newStats.regularDice.d6[die as keyof typeof newStats.regularDice.d6]++;
      newStats.regularDice.total++;
    }
  });
  
  // If it's a 2d6 roll, also track the sum
  if (dice.length === 2) {
    const sum = dice[0] + dice[1];
    if (sum >= 2 && sum <= 12) {
      newStats.regularDice.d2d6[sum as keyof typeof newStats.regularDice.d2d6]++;
    }
  }
  
  return newStats;
}

// Update armour roll statistics
export function updateArmourStats(stats: RollStatistics, broken: boolean): RollStatistics {
  const newStats = { ...stats };
  
  newStats.armourRolls.total++;
  if (broken) {
    newStats.armourRolls.breaks++;
  } else {
    newStats.armourRolls.holds++;
  }
  
  return newStats;
}

// Update injury roll statistics
export function updateInjuryStats(stats: RollStatistics, result: InjuryResult): RollStatistics {
  const newStats = { ...stats };
  
  newStats.injuryRolls.total++;
  newStats.injuryRolls.results[result]++;
  newStats.outcomes.injuries++;
  
  return newStats;
}

// Update casualty roll statistics
export function updateCasualtyStats(stats: RollStatistics, result: CasualtyResult): RollStatistics {
  const newStats = { ...stats };
  
  newStats.casualtyRolls.total++;
  newStats.casualtyRolls.results[result]++;
  newStats.outcomes.casualties++;
  
  return newStats;
}

// Update outcome statistics
export function updateOutcomeStats(stats: RollStatistics, completed: boolean = false): RollStatistics {
  const newStats = { ...stats };
  
  newStats.outcomes.totalActions++;
  if (completed) {
    newStats.outcomes.completedActions++;
  }
  
  return newStats;
}

// Calculate theoretical vs actual percentages for block dice
export function calculateBlockDicePercentages(stats: RollStatistics) {
  const theoretical = {
    'skull': 16.67,      // 1/6
    'both-down': 16.67,  // 1/6
    'pow': 16.67,        // 1/6
    'stumble': 16.67,    // 1/6
    'push': 33.33        // 2/6
  };
  
  const actual: Record<BlockDiceResult, number> = {} as Record<BlockDiceResult, number>;
  const total = stats.blockDice.total;
  
  if (total > 0) {
    Object.keys(stats.blockDice.results).forEach(key => {
      const result = key as BlockDiceResult;
      actual[result] = (stats.blockDice.results[result] / total) * 100;
    });
  } else {
    Object.keys(theoretical).forEach(key => {
      actual[key as BlockDiceResult] = 0;
    });
  }
  
  return { theoretical, actual };
}

// Calculate success rates
export function calculateSuccessRates(stats: RollStatistics) {
  const armourBreakRate = stats.armourRolls.total > 0 
    ? (stats.armourRolls.breaks / stats.armourRolls.total) * 100 
    : 0;
  
  const injuryRate = stats.outcomes.totalActions > 0 
    ? (stats.outcomes.injuries / stats.outcomes.totalActions) * 100 
    : 0;
  
  const casualtyRate = stats.outcomes.totalActions > 0 
    ? (stats.outcomes.casualties / stats.outcomes.totalActions) * 100 
    : 0;
  
  const completionRate = stats.outcomes.totalActions > 0 
    ? (stats.outcomes.completedActions / stats.outcomes.totalActions) * 100 
    : 0;
  
  return {
    armourBreakRate,
    injuryRate,
    casualtyRate,
    completionRate
  };
}

// Save statistics to localStorage
export async function saveStatistics(stats: RollStatistics): Promise<void> {
  try {
    const jsonValue = JSON.stringify(stats);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving statistics:', error);
  }
}

// Load statistics from localStorage
export async function loadStatistics(): Promise<RollStatistics> {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (jsonValue != null) {
      return JSON.parse(jsonValue);
    }
  } catch (error) {
    console.error('Error loading statistics:', error);
  }
  return createEmptyStatistics();
}

// Clear all statistics
export async function clearStatistics(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing statistics:', error);
  }
}

// Get deviation indicators for visual display
export function getDeviationIndicator(theoretical: number, actual: number): 'high' | 'normal' | 'low' {
  const deviation = Math.abs(theoretical - actual);
  
  if (deviation > 10) {
    return actual > theoretical ? 'high' : 'low';
  }
  return 'normal';
}

// Format percentage for display
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

// Format roll count for display
export function formatCount(value: number): string {
  return value.toString();
}

// Get most common roll for d6 and 2d6
export function getMostCommonRolls(stats: RollStatistics) {
  let mostCommonD6 = 1;
  let mostCommon2D6 = 7;
  
  // Find most common d6 roll
  let maxD6Count = 0;
  Object.entries(stats.regularDice.d6).forEach(([roll, count]) => {
    if (count > maxD6Count) {
      maxD6Count = count;
      mostCommonD6 = parseInt(roll);
    }
  });
  
  // Find most common 2d6 roll
  let max2D6Count = 0;
  Object.entries(stats.regularDice.d2d6).forEach(([roll, count]) => {
    if (count > max2D6Count) {
      max2D6Count = count;
      mostCommon2D6 = parseInt(roll);
    }
  });
  
  return {
    d6: { roll: mostCommonD6, count: maxD6Count },
    d2d6: { roll: mostCommon2D6, count: max2D6Count }
  };
}