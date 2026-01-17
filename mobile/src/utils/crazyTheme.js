// Crazy experimental theme with wild design tokens

export const neonColors = {
  // Cyberpunk neon palette
  neonPink: '#FF00FF',
  neonBlue: '#00FFFF',
  neonGreen: '#39FF14',
  neonOrange: '#FF6600',
  neonPurple: '#BF00FF',
  neonYellow: '#FFFF00',

  // Dark backgrounds for neon
  darkBg: '#0D0D0D',
  darkSurface: '#1A1A2E',
  darkCard: '#16213E',

  // Glowing text colors
  glowWhite: '#FFFFFF',
  glowPink: '#FF69B4',
};

export const gradients = {
  // Sunset vibes
  sunset: ['#FF6B35', '#FF8E53', '#FFC1A1', '#FFE5D9'],

  // Aurora borealis
  aurora: ['#00F5A0', '#00D9F5', '#8B5CF6', '#FF00FF'],

  // Cosmic purple
  cosmic: ['#1A1A2E', '#4A00E0', '#8E2DE2', '#FF00FF'],

  // Ocean depth
  ocean: ['#000046', '#1CB5E0', '#00F5A0'],

  // Fire & ice
  fireIce: ['#FF4500', '#FF6B35', '#00BFFF', '#1E90FF'],

  // Mango smoothie
  mango: ['#FFE259', '#FFA751', '#FF6B35'],

  // Midnight city
  midnight: ['#0F0C29', '#302B63', '#24243E'],

  // Berry blast
  berry: ['#8E2DE2', '#4A00E0', '#FF00FF'],
};

export const glassmorphism = {
  light: {
    background: 'rgba(255, 255, 255, 0.25)',
    border: 'rgba(255, 255, 255, 0.35)',
    blur: 10,
  },
  dark: {
    background: 'rgba(0, 0, 0, 0.25)',
    border: 'rgba(255, 255, 255, 0.1)',
    blur: 15,
  },
  colored: {
    background: 'rgba(255, 107, 53, 0.2)',
    border: 'rgba(255, 107, 53, 0.3)',
    blur: 12,
  },
};

export const neumorphism = {
  light: {
    background: '#E0E5EC',
    shadowLight: '#FFFFFF',
    shadowDark: '#A3B1C6',
    distance: 10,
    blur: 20,
  },
  dark: {
    background: '#1A1A2E',
    shadowLight: '#292B4A',
    shadowDark: '#0A0A14',
    distance: 10,
    blur: 20,
  },
};

export const crazyBorderRadius = {
  blob1: '30% 70% 70% 30% / 30% 30% 70% 70%',
  blob2: '60% 40% 30% 70% / 60% 30% 70% 40%',
  squircle: 24,
  pill: 999,
  organic: 40,
};

export const animations = {
  spring: {
    tension: 300,
    friction: 10,
  },
  bounce: {
    damping: 15,
    stiffness: 150,
  },
  smooth: {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

export const crazyTypography = {
  display: {
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: -2,
    lineHeight: 52,
  },
  hero: {
    fontSize: 64,
    fontWeight: '800',
    letterSpacing: -3,
    lineHeight: 68,
  },
  funky: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 4,
    textTransform: 'uppercase',
    lineHeight: 36,
  },
  script: {
    fontSize: 32,
    fontWeight: '400',
    fontStyle: 'italic',
    lineHeight: 40,
  },
};

export const crazyShadows = {
  neonGlow: (color) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  }),

  floating: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.35,
    shadowRadius: 30,
    elevation: 20,
  },

  layered: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },

  colored: (color) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  }),
};

export const foodEmojis = {
  categories: {
    italian: ['🍝', '🍕', '🧀', '🍷'],
    mexican: ['🌮', '🌯', '🫔', '🌶️'],
    asian: ['🍜', '🍣', '🥟', '🍱'],
    american: ['🍔', '🌭', '🍟', '🥓'],
    desserts: ['🍰', '🧁', '🍩', '🍦'],
    breakfast: ['🥞', '🍳', '🥐', '🥯'],
    drinks: ['🧋', '🍹', '☕', '🥤'],
    healthy: ['🥗', '🥑', '🥦', '🍎'],
  },
  decorative: ['✨', '🔥', '💫', '⭐', '🌟', '💖'],
};

export default {
  neonColors,
  gradients,
  glassmorphism,
  neumorphism,
  crazyBorderRadius,
  animations,
  crazyTypography,
  crazyShadows,
  foodEmojis,
};
