import React from 'react';
import { Text, StyleSheet } from 'react-native';

// Simple text-based icons for MVP
// In production, use @expo/vector-icons or custom SVGs
const icons = {
  book: '📖',
  calendar: '📅',
  add: '+',
  cart: '🛒',
  menu: '☰',
  search: '🔍',
  heart: '❤️',
  share: '📤',
  edit: '✏️',
  delete: '🗑️',
  check: '✓',
  close: '✕',
  back: '←',
  forward: '→',
  home: '🏠',
  settings: '⚙️',
  user: '👤',
  time: '⏱️',
  fire: '🔥',
  star: '⭐',
};

export function TabIcon({ name, size = 24, color = '#000' }) {
  const icon = icons[name] || '•';

  return (
    <Text style={[styles.icon, { fontSize: size, color }]}>
      {icon}
    </Text>
  );
}

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
  },
});

export default TabIcon;
