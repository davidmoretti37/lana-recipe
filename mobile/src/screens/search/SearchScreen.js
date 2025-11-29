import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { colors, spacing, typography, borderRadius, shadows } from '../../utils/theme';
import { fetchRecipes } from '../../store/slices/recipesSlice';
import { RecipeCard } from '../../components/RecipeCard';

export default function SearchScreen({ navigation }) {
  const dispatch = useDispatch();
  const { items: recipes, isLoading } = useSelector((state) => state.recipes);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const debounce = setTimeout(() => {
        dispatch(fetchRecipes({ search: searchQuery }));
      }, 300);
      return () => clearTimeout(debounce);
    }
  }, [searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query && !recentSearches.includes(query)) {
      setRecentSearches([query, ...recentSearches.slice(0, 4)]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const renderRecipe = ({ item }) => (
    <RecipeCard
      recipe={item}
      onPress={() => navigation.navigate('RecipeDetail', { id: item.id })}
      style={styles.recipeCard}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search recipes..."
          placeholderTextColor={colors.textLight}
          autoFocus
          returnKeyType="search"
          onSubmitEditing={() => handleSearch(searchQuery)}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {searchQuery.length < 2 ? (
        <View style={styles.suggestions}>
          <Text style={styles.suggestionsTitle}>Recent Searches</Text>
          {recentSearches.map((search, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionItem}
              onPress={() => setSearchQuery(search)}
            >
              <Text style={styles.suggestionIcon}>🕐</Text>
              <Text style={styles.suggestionText}>{search}</Text>
            </TouchableOpacity>
          ))}

          <Text style={[styles.suggestionsTitle, styles.popularTitle]}>
            Popular Categories
          </Text>
          {['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Vegetarian'].map((category) => (
            <TouchableOpacity
              key={category}
              style={styles.suggestionItem}
              onPress={() => setSearchQuery(category)}
            >
              <Text style={styles.suggestionIcon}>🏷️</Text>
              <Text style={styles.suggestionText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <FlatList
          data={recipes}
          renderItem={renderRecipe}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.results}
          ListEmptyComponent={
            !isLoading && (
              <View style={styles.empty}>
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text style={styles.emptyText}>No recipes found</Text>
              </View>
            )
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: spacing.md,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
  },
  searchInput: {
    flex: 1,
    height: 48,
    ...typography.body,
    color: colors.text,
  },
  clearButton: {
    padding: spacing.sm,
  },
  clearButtonText: {
    fontSize: 16,
    color: colors.textLight,
  },
  suggestions: {
    padding: spacing.md,
  },
  suggestionsTitle: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  popularTitle: {
    marginTop: spacing.xl,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  suggestionIcon: {
    fontSize: 16,
    marginRight: spacing.md,
  },
  suggestionText: {
    ...typography.body,
    color: colors.text,
  },
  results: {
    padding: spacing.md,
  },
  recipeCard: {
    marginBottom: spacing.md,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
