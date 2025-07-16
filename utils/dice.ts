import { BLOCK_DICE_FACES, BlockDiceResult, CASUALTY_TABLE, CasualtyResult } from '../types';

// Seeded random number generator using the seed word
class SeededRandom {
  private seed: number;

  constructor(seedWord: string) {
    // Convert seed word to numeric seed
    this.seed = this.stringToSeed(seedWord);
  }

  private stringToSeed(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  // Linear congruential generator
  next(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return this.seed / 2147483647;
  }

  // Roll a die with given sides
  rollDie(sides: number): number {
    return Math.floor(this.next() * sides) + 1;
  }

  // Roll multiple dice
  rollDice(count: number, sides: number): number[] {
    return Array.from({ length: count }, () => this.rollDie(sides));
  }
}

// Global random instance
let randomGenerator: SeededRandom | null = null;

export function initializeRandom(seedWord: string): void {
  randomGenerator = new SeededRandom(seedWord);
}

export function rollD6(): number {
  if (!randomGenerator) {
    throw new Error('Random generator not initialized. Call initializeRandom first.');
  }
  return randomGenerator.rollDie(6);
}

export function roll2D6(): [number, number] {
  const die1 = rollD6();
  const die2 = rollD6();
  return [die1, die2];
}

export function rollD16(): number {
  if (!randomGenerator) {
    throw new Error('Random generator not initialized. Call initializeRandom first.');
  }
  return randomGenerator.rollDie(16);
}

export function rollBlockDice(count: number): BlockDiceResult[] {
  if (!randomGenerator) {
    throw new Error('Random generator not initialized. Call initializeRandom first.');
  }
  
  const results: BlockDiceResult[] = [];
  for (let i = 0; i < count; i++) {
    const roll = randomGenerator.rollDie(6) - 1; // 0-5
    results.push(BLOCK_DICE_FACES[roll]);
  }
  return results;
}

export function rollArmour(armourValue: number, assists: number = 0): { dice: [number, number]; total: number; broken: boolean } {
  const dice = roll2D6();
  const total = dice[0] + dice[1] + assists;
  const broken = total >= armourValue;
  
  return { dice, total, broken };
}

export function rollInjury(isStunty: boolean = false): { dice: [number, number]; total: number; result: string } {
  const dice = roll2D6();
  const total = dice[0] + dice[1];
  
  let result: string;
  if (isStunty) {
    if (total <= 6) result = 'stunned';
    else if (total <= 8) result = 'ko';
    else if (total === 9) result = 'badly-hurt';
    else result = 'casualty';
  } else {
    if (total <= 7) result = 'stunned';
    else if (total <= 9) result = 'ko';
    else result = 'casualty';
  }
  
  return { dice, total, result };
}

export function rollCasualty(nigglingInjuries: number = 0): { dice: number; result: CasualtyResult } {
  const baseRoll = rollD16();
  const modifiedRoll = Math.min(16, baseRoll + nigglingInjuries);
  const result = CASUALTY_TABLE[modifiedRoll];
  
  return { dice: baseRoll, result };
}

export function rollLastingInjury(): { dice: number; injury: any } {
  const roll = rollD6();
  const injuries = {
    1: { type: 'head-injury', description: '-1 AV', stat: 'av' },
    2: { type: 'head-injury', description: '-1 AV', stat: 'av' },
    3: { type: 'smashed-knee', description: '-1 MA', stat: 'ma' },
    4: { type: 'broken-arm', description: '-1 PA', stat: 'pa' },
    5: { type: 'neck-injury', description: '-1 AG', stat: 'ag' },
    6: { type: 'dislocated-shoulder', description: '-1 ST', stat: 'st' }
  };
  
  return { dice: roll, injury: injuries[roll as keyof typeof injuries] };
}

export function rollArgueTheCall(): { dice: number; result: string; description: string } {
  const roll = rollD6();
  
  const results = {
    1: { 
      result: 'ejected', 
      description: '"You\'re Outta Here!" The referee is so enraged that the coach is ejected along with the player.' 
    },
    2: { result: 'ignored', description: '"I Don\'t Care!" The referee is not interested in your argument.' },
    3: { result: 'ignored', description: '"I Don\'t Care!" The referee is not interested in your argument.' },
    4: { result: 'ignored', description: '"I Don\'t Care!" The referee is not interested in your argument.' },
    5: { result: 'ignored', description: '"I Don\'t Care!" The referee is not interested in your argument.' },
    6: { 
      result: 'swayed', 
      description: '"Well, When You Put It Like That.." The referee is swayed by your argument.' 
    }
  };
  
  const outcome = results[roll as keyof typeof results];
  return { dice: roll, result: outcome.result, description: outcome.description };
}

// Check for natural doubles (for sent-off detection in fouls)
export function isNaturalDouble(dice: [number, number]): boolean {
  return dice[0] === dice[1];
}

// Generate random seed words
export function generateSeedWords(count: number = 3): string[] {
  const words = [
    'brave', 'storm', 'flame', 'stone', 'swift', 'honor', 'might', 'glory',
    'fierce', 'noble', 'strong', 'valor', 'power', 'grace', 'force', 'pride',
    'steel', 'blade', 'shield', 'crown', 'heart', 'soul', 'wind', 'light',
    'shadow', 'frost', 'thunder', 'crystal', 'diamond', 'golden', 'silver',
    'crimson', 'azure', 'emerald', 'ivory', 'obsidian', 'amber', 'jade'
  ];
  
  const selected: string[] = [];
  const usedIndices = new Set<number>();
  
  while (selected.length < count && selected.length < words.length) {
    const index = Math.floor(Math.random() * words.length);
    if (!usedIndices.has(index)) {
      usedIndices.add(index);
      selected.push(words[index]);
    }
  }
  
  return selected;
}