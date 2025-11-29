import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { colors, borderRadius, typography, spacing, shadows } from '../utils/theme';

export function RecipeCard({ recipe, onPress, style }) {
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        {recipe.imageUrl ? (
          <Image source={{ uri: recipe.imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>🍽️</Text>
          </View>
        )}
        {recipe.difficulty && (
          <View style={styles.difficultyBadge}>
            <Text style={styles.difficultyText}>{recipe.difficulty}</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {recipe.title}
        </Text>

        <View style={styles.meta}>
          {totalTime > 0 && (
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>⏱️</Text>
              <Text style={styles.metaText}>{totalTime} min</Text>
            </View>
          )}
          {recipe.servings && (
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>👥</Text>
              <Text style={styles.metaText}>{recipe.servings}</Text>
            </View>
          )}
        </View>

        {recipe.cuisine && (
          <Text style={styles.cuisine}>{recipe.cuisine}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

export function RecipeCardSmall({ recipe, onPress, style }) {
  return (
    <TouchableOpacity
      style={[styles.smallContainer, style]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {recipe.imageUrl ? (
        <Image source={{ uri: recipe.imageUrl }} style={styles.smallImage} />
      ) : (
        <View style={[styles.placeholder, styles.smallImage]}>
          <Text style={styles.placeholderText}>🍽️</Text>
        </View>
      )}
      <Text style={styles.smallTitle} numberOfLines={2}>
        {recipe.title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: colors.backgroundSecondary,
  },
  placeholder: {
    width: '100%',
    height: 180,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 48,
  },
  difficultyBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  difficultyText: {
    ...typography.caption,
    color: colors.white,
    textTransform: 'capitalize',
  },
  content: {
    padding: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  meta: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  metaIcon: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  metaText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  cuisine: {
    ...typography.caption,
    color: colors.primary,
    textTransform: 'uppercase',
    fontWeight: '600',
  },

  // Small variant
  smallContainer: {
    width: 140,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },
  smallImage: {
    width: 140,
    height: 100,
  },
  smallTitle: {
    ...typography.bodySmall,
    fontWeight: '500',
    color: colors.text,
    padding: spacing.sm,
  },
});

export default RecipeCard;
