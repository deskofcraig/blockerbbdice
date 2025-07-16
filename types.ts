// Blood Bowl App Types
export type BlockDiceFace = 'skull' | 'bothDown' | 'pow' | 'stumble' | 'push';
export type GamePhase = 'start' | 'seedSelection' | 'actionSelection' | 'diceSelection' | 'diceRoll' | 'resultSelection' | 'armourValue' | 'armourRoll' | 'injuryRoll' | 'casualtyRoll' | 'apothecary' | 'complete';
export type ActionType = 'block' | 'foul';
export type InjuryResult = 'stunned' | 'ko' | 'casualty' | 'badlyHurt';
export type CasualtyResult = 'badlyHurt' | 'missNextGame' | 'nigglingInjury' | 'lastingInjury' | 'dead';

export interface BlockDiceResult {
  face: BlockDiceFace;
  emoji: string;
}

export interface DiceRoll {
  id: string;
  type: 'block' | 'armour' | 'injury' | 'casualty' | 'sendOff' | 'argueCall';
  dice: number[];
  result: number;
  timestamp: Date;
  modifiers?: string[];
}

export interface ActionLogEntry {
  id: string;
  phase: GamePhase;
  action: string;
  timestamp: Date;
  dice?: DiceRoll;
  result?: string;
}

export interface Skills {
  attacker: string[];
  defender: string[];
}

export interface RollStatistics {
  blockDice: {
    [key in BlockDiceFace]: number;
  };
  regularDice: {
    singleD6: number[];
    doubleD6: number[][];
  };
  outcomes: {
    armourBreaks: number;
    armourHolds: number;
    injuries: {
      [key in InjuryResult]: number;
    };
    casualties: {
      [key in CasualtyResult]: number;
    };
  };
  totalRolls: number;
}

export interface GameState {
  phase: GamePhase;
  currentAction: ActionType | null;
  seedWord: string;
  diceCount: number;
  blockDiceResults: BlockDiceResult[];
  selectedResult: BlockDiceFace | null;
  armourValue: number;
  isStunty: boolean;
  skills: Skills;
  statistics: RollStatistics;
  actionLog: ActionLogEntry[];
  gameId: string;
  lastArmourRoll?: DiceRoll;
  lastInjuryRoll?: DiceRoll;
  lastCasualtyRoll?: DiceRoll;
  apothecaryUsed: boolean;
}