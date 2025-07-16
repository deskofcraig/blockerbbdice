# 🏈 Blocker BBDice

A comprehensive Blood Bowl 2020 blocking and fouling assistant app built with React Native and Expo.

## Features

### ✨ Core Functionality
- **Complete Block/Foul Flow**: Full 9-step procedure from dice selection to injury resolution
- **Accurate Block Dice**: Proper 6-sided distribution with correct Blood Bowl faces
- **Seeded Random Generation**: True randomness using seed words
- **Skills Integration**: Complete Blood Bowl 2020 skills and traits system
- **Comprehensive Statistics**: Track all rolls with theoretical vs actual comparisons
- **Action Logging**: Complete game history with timestamps
- **Mobile-First Design**: Optimized for touch interfaces with WCAG accessibility

### 🎲 Game Flow
1. **Start Game** - Welcome screen with app introduction
2. **Seed Selection** - Choose from 3 randomly generated seed words
3. **Action Selection** - Choose between Block or Foul actions
4. **Dice Selection** - Select 1-3 dice based on strength comparison (Block only)
5. **Dice Roll** - Animated 1.2-second dice rolling with proper physics
6. **Result Selection** - Choose result with integrated skills application
7. **Armour Value** - Set defender's AV with Stunty option
8. **Armour Roll** - 2d6 vs AV with skill modifiers
9. **Injury Roll** - Standard or Stunty injury tables
10. **Casualty Roll** - D16 casualty table with full effects
11. **Apothecary** - Option to use team apothecary
12. **Complete** - Action summary and statistics

### 📊 Statistics System
- **Block Dice Tracking**: Count and percentages for all faces
- **Regular Dice Stats**: Single d6 and 2d6 combinations
- **Outcome Analysis**: Armour breaks, injuries, casualties
- **Expected vs Actual**: Compare results to theoretical probabilities
- **Persistent Storage**: Auto-save using localStorage
- **Comprehensive Reports**: Detailed breakdowns and summaries

### ⚡ Skills & Traits
- **Block Phase**: Block, Wrestle, Dodge, Side Step, Stand Firm, Fend, Dauntless, Juggernaut
- **Injury Phase**: Thick Skull, Mighty Blow, Piling On, Claws, Regeneration, Decay
- **Real-time Application**: Skills affect results automatically
- **Visual Indicators**: Clear skill selection and application feedback

### 🎨 User Experience
- **Blood Bowl Theme**: Fantasy gridiron aesthetic with appropriate colors
- **Card-Based Layout**: Clean, organized information display
- **Animated Interactions**: Smooth dice rolling and transitions
- **Responsive Design**: Works on phones, tablets, and desktop
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Action Log**: Always-visible recent actions with phase icons

## Technical Stack

- **Frontend**: React Native with Expo
- **Language**: TypeScript for type safety
- **Styling**: React Native StyleSheet (mobile-optimized)
- **Storage**: localStorage for persistent statistics
- **Platform**: Cross-platform (iOS, Android, Web)
- **Accessibility**: WCAG 2.1 AA compliant

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BlockerBBDice
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   # For web
   npm run web
   
   # For iOS (requires macOS)
   npm run ios
   
   # For Android
   npm run android
   ```

## Project Structure

```
BlockerBBDice/
├── App.tsx                 # Main application component
├── types.ts               # TypeScript type definitions
├── utils/
│   └── gameUtils.ts       # Game logic and utilities
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   ├── StartScreen.tsx    # Welcome screen
│   ├── SeedSelection.tsx  # Seed word selection
│   ├── ActionSelection.tsx # Block/Foul choice
│   ├── DiceSelector.tsx   # Dice count selection
│   ├── BlockDiceRoll.tsx  # Animated dice rolling
│   ├── ResultSelector.tsx # Result selection with skills
│   ├── ArmourValueInput.tsx # AV setting
│   ├── ArmourRoll.tsx     # Armour rolling
│   ├── InjuryRoll.tsx     # Injury table resolution
│   ├── CasualtyRoll.tsx   # Casualty table resolution
│   ├── ApothecaryChoice.tsx # Apothecary decision
│   ├── CompleteScreen.tsx # Action summary
│   ├── Header.tsx         # Navigation header
│   ├── ActionLog.tsx      # Game history
│   ├── StatisticsModal.tsx # Statistics display
│   └── SkillsManager.tsx  # Skills configuration
└── prompt/
    └── prompt.txt         # Original specification
```

## Blood Bowl Rules Implementation

### Block Dice
- Exact 6-sided distribution: Skull (1), Both Down (1), POW! (1), Stumble (1), Push (2)
- Proper emoji representation: 💀 ⚔️ 💥 ❗ ↗️
- Seeded random generation for consistent results
- Statistics tracking with theoretical comparisons

### Injury System
- **Armour Rolls**: 2d6 vs AV (≥AV breaks armour)
- **Standard Injury Table**: 2-7 Stunned, 8-9 KO, 10+ Casualty
- **Stunty Injury Table**: 2-6 Stunned, 7-8 KO, 9 Badly Hurt, 10+ Casualty
- **Casualty Table**: D16 with full range of outcomes
- **Apothecary Rules**: Once per game, re-roll casualties

### Skills & Modifiers
- **Thick Skull**: +1 to armour value
- **Mighty Blow**: +1 to injury and casualty rolls
- **Block/Wrestle/Dodge**: Modify block results
- **Piling On**: +1 to armour OR injury (choose)
- All skills applied at correct phases with visual feedback

## Usage

1. **Start a New Game**: Begin with the welcome screen
2. **Select Seed Word**: Choose from 3 random words for RNG
3. **Choose Action**: Block or Foul
4. **Follow the Flow**: Complete each step of the procedure
5. **View Statistics**: Check comprehensive roll tracking
6. **Manage Skills**: Configure attacker/defender abilities
7. **Review History**: See action log with timestamps

## Accessibility Features

- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard support
- **Touch Targets**: Minimum 44px touch areas
- **High Contrast**: Clear visual hierarchy
- **Focus Management**: Logical focus progression
- **Semantic HTML**: Proper role attributes

## Contributing

This app implements the Blood Bowl 2020 rules as specified. For rule clarifications, refer to:
- [Blood Bowl Base Rules](https://bloodbowlbase.ru/)
- Official Blood Bowl 2020 rulebook

## License

Built according to the specifications in `prompt/prompt.txt`. This is a fan-made tool for Blood Bowl players and is not affiliated with Games Workshop.

---

**Blocker BBDice** - Your digital assistant for Blood Bowl blocking and fouling actions! 🏈⚔️