import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { colors, spacing, typography, borderRadius } from '../../utils/theme';
import { fetchRecipe, deleteRecipe, addRecipeToGroceries } from '../../store/slices/recipesSlice';
import { Button } from '../../components/Button';

export default function RecipeDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const dispatch = useDispatch();
  const { currentRecipe: recipe, isLoading } = useSelector((state) => state.recipes);

  useEffect(() => {
    dispatch(fetchRecipe(id));
  }, [id]);

  const handleAddToGroceries = () => {
    dispatch(addRecipeToGroceries(id)).then((action) => {
      if (!action.error) {
        Alert.alert('Success', 'Ingredients added to grocery list!');
      }
    });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Recipe',
      'Are you sure you want to delete this recipe?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteRecipe(id)).then(() => {
              navigation.goBack();
            });
          },
        },
      ]
    );
  };

  if (!recipe) {
    return (
      <View style={styles.loading}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  return (
    <ScrollView style={styles.container}>
      {recipe.imageUrl ? (
        <Image source={{ uri: recipe.imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderIcon}>🍽️</Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{recipe.title}</Text>

        {recipe.description && (
          <Text style={styles.description}>{recipe.description}</Text>
        )}

        <View style={styles.meta}>
          {totalTime > 0 && (
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>⏱️</Text>
              <Text style={styles.metaValue}>{totalTime} min</Text>
              <Text style={styles.metaLabel}>Total Time</Text>
            </View>
          )}
          {recipe.servings && (
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>👥</Text>
              <Text style={styles.metaValue}>{recipe.servings}</Text>
              <Text style={styles.metaLabel}>Servings</Text>
            </View>
          )}
          {recipe.difficulty && (
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>📊</Text>
              <Text style={styles.metaValue}>{recipe.difficulty}</Text>
              <Text style={styles.metaLabel}>Difficulty</Text>
            </View>
          )}
        </View>

        {recipe.tags?.length > 0 && (
          <View style={styles.tags}>
            {recipe.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {recipe.ingredients?.map((ingredient, index) => (
            <View key={index} style={styles.ingredient}>
              <View style={styles.bullet} />
              <Text style={styles.ingredientText}>
                {ingredient.quantity && `${ingredient.quantity} `}
                {ingredient.unit && `${ingredient.unit} `}
                {ingredient.name}
                {ingredient.notes && ` (${ingredient.notes})`}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          {recipe.instructions?.map((instruction, index) => (
            <View key={index} style={styles.instruction}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{instruction.stepNumber}</Text>
              </View>
              <Text style={styles.instructionText}>{instruction.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <Button
            title="Add to Grocery List"
            onPress={handleAddToGroceries}
            style={styles.actionButton}
          />
          <Button
            title="Delete Recipe"
            onPress={handleDelete}
            variant="outline"
            style={styles.actionButton}
          />
        </View>

        {recipe.sourceUrl && (
          <Text style={styles.source}>
            Source: {recipe.sourcePlatform || 'Web'}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 250,
    backgroundColor: colors.backgroundSecondary,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 64,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  metaItem: {
    alignItems: 'center',
  },
  metaIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  metaValue: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  metaLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
  },
  tag: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  tagText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '500',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.md,
  },
  ingredient: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 8,
    marginRight: spacing.md,
  },
  ingredientText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  instruction: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  stepNumberText: {
    ...typography.bodySmall,
    color: colors.white,
    fontWeight: '600',
  },
  instructionText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
    lineHeight: 24,
  },
  actions: {
    marginTop: spacing.lg,
  },
  actionButton: {
    marginBottom: spacing.md,
  },
  source: {
    ...typography.caption,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
