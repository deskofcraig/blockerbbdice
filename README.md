# Blocker BBDice

A comprehensive Blood Bowl 2020 dice rolling and action resolution app built with React Native and Expo. This app helps players complete blocking and fouling actions during Blood Bowl games with accurate rule implementation and comprehensive statistics tracking.

## Features

### 🎲 Complete Block Dice System
- Accurate 6-sided block dice with exact face distribution
- Animated dice rolling with 1.2-second duration
- Unicode emoji visualization for each dice face:
  - 💀 Skull (Attacker Down)
  - ⚔️ Both Down
  - 💥 POW! (Defender Down)
  - ❗ Stumble
  - ↗️ Push (2 faces)

### 🏈 Complete Game Flow
- **Game Start**: Seed word selection for enhanced randomization
- **Action Selection**: Choose between Block or Foul actions
- **Block Flow**: Dice selection → Roll → Result selection → Armour → Injury → Casualty
- **Foul Flow**: Armour → Injury → Casualty → Sent-off check → Argue the call
- **Step-by-step progression** with confirmation at each stage

### ⚔️ Integrated Skills System
Skills applied directly during result selection:

**Block Phase Skills:**
- Block: Attacker not affected by Both Down
- Wrestle: Push becomes Both Down when attacking
- Dodge: Stumble becomes Push when defending
- Side Step: Choose push direction (defensive)
- Stand Firm: Cannot be pushed back (defensive)
- Fend: Opponent cannot follow up (defensive)
- Dauntless: Re-roll failed block dice vs higher ST
- Juggernaut: Opponent cannot use Dodge, Side Step, or Stand Firm

**Armour/Injury Phase Skills:**
- Thick Skull: +1 to armour value
- Mighty Blow: +1 to injury rolls and casualty rolls
- Piling On: +1 to armour or injury roll (choose one)

### 📊 Comprehensive Statistics System
- **Block Dice Tracking**: Theoretical vs actual percentages with deviation indicators
- **Regular Dice Statistics**: All d6 and 2d6 combinations with frequencies
- **Armour Roll Tracking**: Break vs hold percentages
- **Injury/Casualty Outcomes**: Complete breakdown of all results
- **Persistent Storage**: Auto-save to localStorage
- **Visual Indicators**: Deviation colors for statistical analysis

### 🔢 Advanced Randomization
- **Seed Word System**: User-selected words enhance randomization
- **Seeded Random Generator**: Linear congruential generator for consistent sequences
- **Binary Conversion**: Seed words converted to binary for entropy

## Technical Stack

- **Framework**: React Native with Expo SDK 53
- **Language**: TypeScript for type safety
- **Styling**: Custom components with Blood Bowl theming
- **State Management**: React hooks with persistent localStorage
- **Platform Support**: iOS, Android, and Web
- **Accessibility**: WCAG compliant with ARIA labels and semantic structure

## Project Structure

```
blockerbbdice/
├── components/
│   ├── ui/
│   │   ├── Button.tsx           # Reusable button component
│   │   └── Card.tsx             # Card layout component
│   ├── ActionComplete.tsx       # Action completion summary
│   ├── ActionSelect.tsx         # Block vs Foul selection
│   ├── ArmourValueInput.tsx     # Armour value setting
│   ├── BlockDiceRoll.tsx        # Animated dice rolling
│   ├── DiceSelector.tsx         # 1-3 dice selection
│   ├── GameStart.tsx            # Initial game setup
│   └── ResultSelector.tsx       # Result selection with skills
├── types/
│   └── index.ts                 # TypeScript type definitions
├── utils/
│   ├── dice.ts                  # Dice rolling and randomization
│   └── statistics.ts            # Statistics tracking and persistence
├── prompt/
│   └── prompt.txt               # Original prompt document
├── App.tsx                      # Main application component
└── README.md                    # This file
```

## Core Game Mechanics

### Block Dice Distribution
Each block die has 6 faces with the following exact distribution:
- **Skull** (1/6): Attacker Down
- **Both Down** (1/6): Both players knocked down
- **POW!** (1/6): Defender Down
- **Stumble** (1/6): Defender stumbles
- **Push** (2/6): Defender pushed back

### Strength Comparison
- **Equal Strength**: 1 die (no choice)
- **Higher Strength**: 2 dice (choose best result)
- **More than Double**: 3 dice (choose best result)

### Injury Resolution
- **Armour Roll**: 2d6 vs AV (≥AV breaks armour)
- **Standard Injury Table**: 2-7 Stunned, 8-9 KO, 10+ Casualty
- **Stunty Injury Table**: 2-7 Stunned, 8-9 KO, 10 Badly Hurt, 11+ Casualty

### Casualty System
- **D16 Casualty Table**: 1-6 Badly Hurt, 7-9 Miss Next Game, 10-12 Niggling Injury, 13-14 Lasting Injury, 15-16 Dead
- **Lasting Injury Table**: Random characteristic reduction (MA, ST, AG, PA, AV)

## Usage Instructions

### Starting a Game
1. **Launch the app** - Welcome screen appears
2. **Select seed word** - Choose from 3 randomly generated options or generate new ones
3. **Choose action type** - Block or Foul action

### Block Action Flow
1. **Select dice count** - Based on strength comparison (1-3 dice)
2. **Roll dice** - Animated rolling with results display
3. **Select result** - Choose from available results and apply skills
4. **Set armour value** - Input defender's AV and Stunty trait
5. **Complete action** - View summary and start new action

### Foul Action Flow
1. **Set armour value** - Skip to armour phase
2. **Roll for injury** - If armour breaks
3. **Check for sent-off** - Natural doubles detection
4. **Argue the call** - If sent off occurs

## Installation & Development

### Prerequisites
- Node.js 18+
- Expo CLI
- iOS Simulator (for iOS) or Android Emulator (for Android)

### Setup
```bash
# Clone the repository
cd blockerbbdice

# Install dependencies
npm install

# Start development server
npm run start

# Run on specific platforms
npm run web     # Web browser
npm run ios     # iOS simulator
npm run android # Android emulator
```

### Building for Production
```bash
# Build for web
npx expo export --platform web

# Build for mobile (requires Expo account)
eas build --platform all
```

## Blood Bowl Rules Implementation

This app implements Blood Bowl 2020 rules as specified in the official rulebook and verified against [bloodbowlbase.ru](https://bloodbowlbase.ru/). All dice mechanics, skill interactions, and injury tables follow the official specifications.

### Reference Documentation
- **Core Rules**: Block dice mechanics and procedures
- **Skills & Traits**: Complete skill implementation with proper timing
- **Injury System**: Full armour, injury, and casualty resolution
- **Fouling Rules**: Sent-off detection and arguing the call procedures

## Statistics & Analytics

The app tracks comprehensive statistics including:
- **Roll Frequencies**: Actual vs theoretical percentages
- **Outcome Tracking**: Success rates and injury distributions
- **Session History**: Complete action logging with timestamps
- **Deviation Analysis**: Visual indicators for statistical anomalies

## Accessibility Features

- **ARIA Labels**: Screen reader support for all interactive elements
- **Keyboard Navigation**: Full keyboard control support
- **High Contrast**: Visual accessibility compliance
- **Touch Targets**: 44px+ minimum target sizes for mobile
- **Semantic HTML**: Proper heading hierarchy and structure

## Contributing

This app follows the complete specification from the prompt document located in `prompt/prompt.txt`. All components implement the exact requirements including:
- Blood Bowl 2020 rule accuracy
- Mobile-first responsive design
- Comprehensive statistics tracking
- Accessibility compliance
- Complete game flow implementation

## License

Built for Blood Bowl gaming community. Follows official Games Workshop Blood Bowl 2020 rules.

---

**Ready to roll some block dice and crush your opponents!** 🏈⚔️🎲
