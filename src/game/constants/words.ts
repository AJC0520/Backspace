export const WORD_CATEGORIES = {
  // Level 1: short, common words (3-5 letters)
  easy: [
    "cat", "dog", "sun", "moon", "tree", "fish", "bird", "cake", "rain", "star",
    "book", "door", "hand", "milk", "road", "ship", "wind", "fire", "gold", "bear",
  ],
  // Level 2: everyday words (5-7 letters)
  medium: [
    "apple", "river", "shadow", "castle", "pixel", "garden", "window", "planet",
    "market", "forest", "bridge", "island", "silver", "dragon", "pirate", "rocket",
    "candle", "button", "winter", "jungle",
  ],
  // Level 3: longer or trickier spellings (7-9 letters)
  hard: [
    "keyboard", "monster", "thunder", "mountain", "elephant", "treasure", "lantern",
    "universe", "football", "dinosaur", "umbrella", "painting", "calendar", "squirrel",
    "midnight", "creature", "labyrinth", "triangle", "backpack", "notebook",
  ],
  // Level 4: long words (9-11 letters)
  expert: [
    "adventure", "chocolate", "electricity", "restaurant", "temperature", "wonderful",
    "photograph", "basketball", "mysterious", "playground", "earthquake", "fascinating",
    "microscope", "revolution", "skateboard", "javascript", "development", "imagination",
    "blacksmith", "strawberry",
  ],
  // Level 5: very long or awkward spellings (11+ letters)
  insane: [
    "extraordinary", "pronunciation", "responsibility", "uncomfortable", "acknowledgment",
    "infrastructure", "kaleidoscope", "onomatopoeia", "psychological", "idiosyncrasy",
    "miscellaneous", "claustrophobia", "entrepreneurial", "unquestionably", "bureaucracy",
    "synchronization", "constellation", "mischievousness", "quintessential", "thermodynamics",
  ],
} as const;

export type WordDifficulty = keyof typeof WORD_CATEGORIES;

export const DIFFICULTY_ORDER: readonly WordDifficulty[] = [
  "easy",
  "medium",
  "hard",
  "expert",
  "insane",
];

export const WORDS = Object.values(WORD_CATEGORIES).flat();
