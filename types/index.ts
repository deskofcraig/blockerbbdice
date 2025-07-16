// Block Dice Results
export type BlockDiceResult = 'skull' | 'both-down' | 'pow' | 'stumble' | 'push';

// Block Dice Face Distribution
export const BLOCK_DICE_FACES: BlockDiceResult[] = [
  'skull',      // 1 face - Attacker Down
  'both-down',  // 1 face - Both Down
  'pow',        // 1 face - Defender Down
  'stumble',    // 1 face - Stumble
  'push',       // 2 faces - Push (appears twice)
  'push'
];

// Block Dice Emojis
export const BLOCK_DICE_EMOJIS: Record<BlockDiceResult, string> = {
  'skull': '💀',         // Skull - Attacker Down
  'both-down': '⚔️',     // Crossed Swords - Both Down
  'pow': '💥',           // Collision Symbol - Defender Down
  'stumble': '❗',       // Heavy Exclamation Mark - Stumble
  'push': '↗️'           // North East Arrow - Push
};

// Game Phases
export type GamePhase = 
  | 'game-start'
  | 'action-select'
  | 'dice-select'
  | 'dice-roll'
  | 'result-select'
  | 'armour-value'
  | 'armour-roll'
  | 'injury-roll'
  | 'casualty-roll'
  | 'apothecary'
  | 'complete';

// Action Types
export type ActionType = 'block' | 'foul';

// Skills
export type AttackerSkill = 'block' | 'wrestle' | 'dauntless' | 'juggernaut' | 'mighty-blow' | 'piling-on' | 'claws';
export type DefenderSkill = 'dodge' | 'side-step' | 'stand-firm' | 'fend' | 'thick-skull' | 'stunty';

export interface PlayerSkills {
  attacker: AttackerSkill[];
  defender: DefenderSkill[];
}

// Injury Results
export type InjuryResult = 'stunned' | 'ko' | 'casualty' | 'badly-hurt';

// Casualty Results
export type CasualtyResult = 'badly-hurt' | 'miss-next-game' | 'niggling-injury' | 'lasting-injury' | 'dead';

// Roll Statistics
export interface RollStatistics {
  blockDice: {
    total: number;
    results: Record<BlockDiceResult, number>;
  };
  regularDice: {
    d6: Record<number, number>; // 1-6
    d2d6: Record<number, number>; // 2-12
    total: number;
  };
  armourRolls: {
    total: number;
    breaks: number;
    holds: number;
  };
  injuryRolls: {
    total: number;
    results: Record<InjuryResult, number>;
  };
  casualtyRolls: {
    total: number;
    results: Record<CasualtyResult, number>;
  };
  outcomes: {
    totalActions: number;
    completedActions: number;
    injuries: number;
    casualties: number;
  };
}

// Action Log Entry
export interface ActionLogEntry {
  id: string;
  timestamp: Date;
  phase: GamePhase;
  action: ActionType;
  description: string;
  result?: any;
  icon: string;
}

// Game State
export interface GameState {
  phase: GamePhase;
  actionType?: ActionType;
  seedWord?: string;
  diceCount?: number;
  blockDiceResults?: BlockDiceResult[];
  selectedResult?: BlockDiceResult;
  appliedSkills: PlayerSkills;
  armourValue?: number;
  isStunty?: boolean;
  armourRoll?: { dice: [number, number]; total: number; broken: boolean };
  injuryRoll?: { dice: [number, number]; total: number; result: InjuryResult };
  casualtyRoll?: { dice: number; result: CasualtyResult };
  apothecaryUsed?: boolean;
  apothecaryResult?: any;
  actionLog: ActionLogEntry[];
  statistics: RollStatistics;
}

// Seed Word Generation
export const SEED_WORDS = [
  'brave', 'storm', 'flame', 'stone', 'swift', 'honor', 'might', 'glory',
  'fierce', 'noble', 'strong', 'valor', 'power', 'grace', 'force', 'pride',
  'steel', 'blade', 'shield', 'crown', 'heart', 'soul', 'wind', 'light',
  'shadow', 'frost', 'thunder', 'crystal', 'diamond', 'golden', 'silver',
  'crimson', 'azure', 'emerald', 'ivory', 'obsidian', 'amber', 'jade'
];

// Injury Tables
export const STANDARD_INJURY_TABLE = {
  2: 'stunned', 3: 'stunned', 4: 'stunned', 5: 'stunned', 6: 'stunned', 7: 'stunned',
  8: 'ko', 9: 'ko',
  10: 'casualty', 11: 'casualty', 12: 'casualty'
} as Record<number, InjuryResult>;

export const STUNTY_INJURY_TABLE = {
  2: 'stunned', 3: 'stunned', 4: 'stunned', 5: 'stunned', 6: 'stunned', 7: 'stunned',
  8: 'ko', 9: 'ko',
  10: 'badly-hurt', 11: 'casualty', 12: 'casualty'
} as Record<number, InjuryResult>;

// Casualty Table
export const CASUALTY_TABLE = {
  1: 'badly-hurt', 2: 'badly-hurt', 3: 'badly-hurt', 4: 'badly-hurt', 5: 'badly-hurt', 6: 'badly-hurt',
  7: 'miss-next-game', 8: 'miss-next-game', 9: 'miss-next-game',
  10: 'niggling-injury', 11: 'niggling-injury', 12: 'niggling-injury',
  13: 'lasting-injury', 14: 'lasting-injury',
  15: 'dead', 16: 'dead'
} as Record<number, CasualtyResult>;

// Lasting Injury Table
export const LASTING_INJURY_TABLE = {
  1: { type: 'head-injury', description: '-1 AV', stat: 'av' },
  2: { type: 'head-injury', description: '-1 AV', stat: 'av' },
  3: { type: 'smashed-knee', description: '-1 MA', stat: 'ma' },
  4: { type: 'broken-arm', description: '-1 PA', stat: 'pa' },
  5: { type: 'neck-injury', description: '-1 AG', stat: 'ag' },
  6: { type: 'dislocated-shoulder', description: '-1 ST', stat: 'st' }
};

// Argue the Call Table (for fouls)
export const ARGUE_THE_CALL_TABLE = {
  1: { 
    result: 'ejected', 
    description: '"You\'re Outta Here!" The referee is so enraged that the coach is ejected along with the player.' 
  },
  2: { 
    result: 'ignored', 
    description: '"I Don\'t Care!" The referee is not interested in your argument.' 
  },
  3: { 
    result: 'ignored', 
    description: '"I Don\'t Care!" The referee is not interested in your argument.' 
  },
  4: { 
    result: 'ignored', 
    description: '"I Don\'t Care!" The referee is not interested in your argument.' 
  },
  5: { 
    result: 'ignored', 
    description: '"I Don\'t Care!" The referee is not interested in your argument.' 
  },
  6: { 
    result: 'swayed', 
    description: '"Well, When You Put It Like That.." The referee is swayed by your argument.' 
  }
};