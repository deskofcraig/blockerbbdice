import { BlockDiceFace, BlockDiceResult, GameState, RollStatistics, ActionLogEntry, DiceRoll } from '../types';

// Block dice configuration with exact Blood Bowl distribution
const BLOCK_DICE_FACES: { face: BlockDiceFace; emoji: string; weight: number }[] = [
  { face: 'skull', emoji: '💀', weight: 1 },
  { face: 'bothDown', emoji: '⚔️', weight: 1 },
  { face: 'pow', emoji: '💥', weight: 1 },
  { face: 'stumble', emoji: '❗', weight: 1 },
  { face: 'push', emoji: '↗️', weight: 2 }
];

// Seeded random number generator using seed word
class SeededRandom {
  private seed: number;

  constructor(seedWord: string) {
    this.seed = this.hashCode(seedWord);
  }

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
}

let globalRng: SeededRandom;

export const initializeRng = (seedWord: string): void => {
  globalRng = new SeededRandom(seedWord);
};

// Generate random seed words
export const generateSeedWords = (): string[] => {
  const words = [
    'dragon', 'warrior', 'shield', 'hammer', 'castle', 'storm', 'blade', 'frost',
    'flame', 'crystal', 'shadow', 'thunder', 'mystic', 'golden', 'silver', 'crimson',
    'emerald', 'sapphire', 'granite', 'obsidian', 'phoenix', 'griffon', 'daemon',
    'temple', 'fortress', 'kingdom', 'empire', 'legend', 'ancient', 'sacred'
  ];
  
  const shuffled = [...words].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
};

// Roll block dice
export const rollBlockDice = (count: number): BlockDiceResult[] => {
  const results: BlockDiceResult[] = [];
  
  for (let i = 0; i < count; i++) {
    const roll = globalRng ? globalRng.nextInt(1, 6) : Math.floor(Math.random() * 6) + 1;
    
    // Map 1-6 to block dice faces based on distribution
    let face: BlockDiceFace;
    let emoji: string;
    
    switch (roll) {
      case 1:
        face = 'skull';
        emoji = '💀';
        break;
      case 2:
        face = 'bothDown';
        emoji = '⚔️';
        break;
      case 3:
        face = 'pow';
        emoji = '💥';
        break;
      case 4:
        face = 'stumble';
        emoji = '❗';
        break;
      case 5:
      case 6:
        face = 'push';
        emoji = '↗️';
        break;
      default:
        face = 'push';
        emoji = '↗️';
    }
    
    results.push({ face, emoji });
  }
  
  return results;
};

// Roll regular dice
export const rollDice = (count: number): number[] => {
  const results: number[] = [];
  for (let i = 0; i < count; i++) {
    const roll = globalRng ? globalRng.nextInt(1, 6) : Math.floor(Math.random() * 6) + 1;
    results.push(roll);
  }
  return results;
};

// Roll D16 for casualty table
export const rollD16 = (): number => {
  const d1 = globalRng ? globalRng.nextInt(1, 6) : Math.floor(Math.random() * 6) + 1;
  const d2 = globalRng ? globalRng.nextInt(1, 6) : Math.floor(Math.random() * 6) + 1;
  const d3 = globalRng ? globalRng.nextInt(1, 6) : Math.floor(Math.random() * 6) + 1;
  
  // Convert 3d6 to d16 (1-16)
  const total = d1 + d2 + d3;
  return Math.min(16, Math.max(1, Math.floor((total - 3) / 15 * 15) + 1));
};

// Apply skills to block result
export const applySkillsToResult = (
  result: BlockDiceFace,
  skills: { attacker: string[]; defender: string[] }
): BlockDiceFace => {
  let modifiedResult = result;
  
  // Block skill - attacker not affected by Both Down
  if (result === 'bothDown' && skills.attacker.includes('Block')) {
    modifiedResult = 'push';
  }
  
  // Wrestle skill - Push becomes Both Down when attacking
  if (result === 'push' && skills.attacker.includes('Wrestle')) {
    modifiedResult = 'bothDown';
  }
  
  // Dodge skill - Stumble becomes Push when defending
  if (result === 'stumble' && skills.defender.includes('Dodge')) {
    modifiedResult = 'push';
  }
  
  return modifiedResult;
};

// Calculate injury roll result
export const calculateInjuryResult = (roll: number, isStunty: boolean): string => {
  if (isStunty) {
    if (roll <= 6) return 'Stunned';
    if (roll <= 8) return 'KO\'d';
    if (roll === 9) return 'Badly Hurt';
    return 'Casualty!';
  } else {
    if (roll <= 7) return 'Stunned';
    if (roll <= 9) return 'KO\'d';
    return 'Casualty!';
  }
};

// Calculate casualty result
export const calculateCasualtyResult = (roll: number, nigglingInjuries: number = 0): string => {
  const modifiedRoll = roll + nigglingInjuries;
  
  if (modifiedRoll <= 6) return 'Badly Hurt';
  if (modifiedRoll <= 9) return 'Miss Next Game';
  if (modifiedRoll <= 12) return 'Niggling Injury';
  if (modifiedRoll <= 14) return 'Lasting Injury';
  return 'DEAD';
};

// Initialize empty statistics
export const initializeStatistics = (): RollStatistics => ({
  blockDice: {
    skull: 0,
    bothDown: 0,
    pow: 0,
    stumble: 0,
    push: 0
  },
  regularDice: {
    singleD6: [0, 0, 0, 0, 0, 0], // indices 0-5 for rolls 1-6
    doubleD6: Array(6).fill(null).map(() => Array(6).fill(0)) // 6x6 grid for 2d6 combinations
  },
  outcomes: {
    armourBreaks: 0,
    armourHolds: 0,
    injuries: {
      stunned: 0,
      ko: 0,
      casualty: 0,
      badlyHurt: 0
    },
    casualties: {
      badlyHurt: 0,
      missNextGame: 0,
      nigglingInjury: 0,
      lastingInjury: 0,
      dead: 0
    }
  },
  totalRolls: 0
});

// Update statistics with new roll
export const updateStatistics = (
  stats: RollStatistics,
  roll: DiceRoll,
  outcome?: string
): RollStatistics => {
  const newStats = { ...stats };
  newStats.totalRolls++;
  
  if (roll.type === 'block') {
    // Block dice results are handled separately in the component
  } else if (roll.dice.length === 1) {
    // Single d6
    const value = roll.dice[0];
    newStats.regularDice.singleD6[value - 1]++;
  } else if (roll.dice.length === 2) {
    // 2d6
    const [d1, d2] = roll.dice;
    newStats.regularDice.doubleD6[d1 - 1][d2 - 1]++;
  }
  
  // Update outcomes based on roll type and result
  if (roll.type === 'armour' && outcome) {
    if (outcome.includes('breaks')) {
      newStats.outcomes.armourBreaks++;
    } else {
      newStats.outcomes.armourHolds++;
    }
  }
  
  return newStats;
};

// Generate action log entry
export const createActionLogEntry = (
  phase: GameState['phase'],
  action: string,
  dice?: DiceRoll,
  result?: string
): ActionLogEntry => ({
  id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
  phase,
  action,
  timestamp: new Date(),
  dice,
  result
});

// Save game state to localStorage
export const saveGameState = (gameState: GameState): void => {
  try {
    localStorage.setItem('bloodBowlGameState', JSON.stringify(gameState));
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
};

// Load game state from localStorage
export const loadGameState = (): GameState | null => {
  try {
    const saved = localStorage.getItem('bloodBowlGameState');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Convert date strings back to Date objects
      parsed.actionLog = parsed.actionLog.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      }));
      return parsed;
    }
  } catch (error) {
    console.error('Failed to load game state:', error);
  }
  return null;
};

// Clear saved game state
export const clearGameState = (): void => {
  try {
    localStorage.removeItem('bloodBowlGameState');
  } catch (error) {
    console.error('Failed to clear game state:', error);
  }
};