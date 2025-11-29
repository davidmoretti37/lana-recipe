import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
  TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { colors, spacing, typography, borderRadius, shadows } from '../../utils/theme';
import { fetchCookbooks } from '../../store/slices/cookbooksSlice';

export default function CookbooksScreen({ navigation }) {
  const dispatch = useDispatch();
  const { items: cookbooks, isLoading } = useSelector((state) => state.cookbooks);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchCookbooks());
  }, []);

  const filteredCookbooks = cookbooks.filter((cb) =>
    cb.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCookbook = ({ item }) => (
    <TouchableOpacity
      style={styles.cookbookCard}
      onPress={() => navigation.navigate('CookbookDetail', { id: item.id, name: item.name })}
      activeOpacity={0.9}
    >
      <View style={styles.thumbnails}>
        {item.thumbnails?.length > 0 ? (
          <View style={styles.thumbnailGrid}>
            {item.thumbnails.slice(0, 4).map((url, index) => (
              <Image
                key={index}
                source={{ uri: url }}
                style={styles.thumbnail}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyThumbnail}>
            <Text style={styles.emptyIcon}>📖</Text>
          </View>
        )}
      </View>
      <View style={styles.cookbookInfo}>
        <Text style={styles.cookbookName}>{item.name}</Text>
        <Text style={styles.recipeCount}>
          {item.recipeCount} {item.recipeCount === 1 ? 'recipe' : 'recipes'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search cookbooks..."
          placeholderTextColor={colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Text style={styles.searchIcon}>🔍</Text>
      </View>

      <FlatList
        data={filteredCookbooks}
        renderItem={renderCookbook}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => dispatch(fetchCookbooks())}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyTitle}>No Cookbooks Yet</Text>
            <Text style={styles.emptyText}>
              Share a recipe from Instagram to get started!
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    margin: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  searchInput: {
    flex: 1,
    height: 44,
    ...typography.body,
    color: colors.text,
  },
  searchIcon: {
    fontSize: 18,
  },
  list: {
    padding: spacing.sm,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
  },
  cookbookCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...shadows.md,
  },
  thumbnails: {
    height: 140,
    backgroundColor: colors.backgroundSecondary,
  },
  thumbnailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: '100%',
  },
  thumbnail: {
    width: '50%',
    height: '50%',
  },
  emptyThumbnail: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
  },
  cookbookInfo: {
    padding: spacing.md,
  },
  cookbookName: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  recipeCount: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
