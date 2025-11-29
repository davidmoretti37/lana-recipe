import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { colors, spacing, typography, borderRadius, shadows } from '../../utils/theme';
import {
  fetchGroceries,
  addGroceryItem,
  toggleGroceryItem,
  deleteGroceryItem,
  clearCheckedItems,
  clearAllItems,
} from '../../store/slices/groceriesSlice';
import { Button } from '../../components/Button';

export default function GroceriesScreen() {
  const dispatch = useDispatch();
  const { items, stats, isLoading } = useSelector((state) => state.groceries);
  const [newItem, setNewItem] = useState('');
  const [showChecked, setShowChecked] = useState(true);

  useEffect(() => {
    dispatch(fetchGroceries());
  }, []);

  const handleAddItem = () => {
    if (!newItem.trim()) return;

    dispatch(addGroceryItem({ name: newItem.trim() }));
    setNewItem('');
  };

  const handleToggle = (id) => {
    dispatch(toggleGroceryItem(id));
  };

  const handleDelete = (id) => {
    dispatch(deleteGroceryItem(id));
  };

  const handleClearChecked = () => {
    if (stats.checked === 0) return;

    Alert.alert(
      'Clear Checked Items',
      `Remove ${stats.checked} checked items?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          onPress: () => dispatch(clearCheckedItems()),
        },
      ]
    );
  };

  const handleClearAll = () => {
    if (stats.total === 0) return;

    Alert.alert(
      'Clear All Items',
      'Remove all items from your grocery list?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => dispatch(clearAllItems()),
        },
      ]
    );
  };

  const filteredItems = showChecked
    ? items
    : items.filter((item) => !item.isChecked);

  const renderItem = ({ item }) => (
    <View style={styles.itemRow}>
      <TouchableOpacity
        style={[styles.checkbox, item.isChecked && styles.checkboxChecked]}
        onPress={() => handleToggle(item.id)}
      >
        {item.isChecked && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
      <View style={styles.itemContent}>
        <Text style={[styles.itemName, item.isChecked && styles.itemNameChecked]}>
          {item.quantity && `${item.quantity} `}
          {item.unit && `${item.unit} `}
          {item.name}
        </Text>
        {item.category && (
          <Text style={styles.itemCategory}>{item.category}</Text>
        )}
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}
      >
        <Text style={styles.deleteButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newItem}
          onChangeText={setNewItem}
          placeholder="Add item..."
          placeholderTextColor={colors.textLight}
          onSubmitEditing={handleAddItem}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsBar}>
        <Text style={styles.statsText}>
          {stats.unchecked} items remaining
        </Text>
        <View style={styles.statsActions}>
          <TouchableOpacity onPress={() => setShowChecked(!showChecked)}>
            <Text style={styles.toggleText}>
              {showChecked ? 'Hide' : 'Show'} checked
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => dispatch(fetchGroceries())}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyTitle}>Your List is Empty</Text>
            <Text style={styles.emptyText}>
              Add items manually or generate from a meal plan
            </Text>
          </View>
        }
      />

      {stats.total > 0 && (
        <View style={styles.footer}>
          <Button
            title="Clear Checked"
            onPress={handleClearChecked}
            variant="secondary"
            size="small"
            style={styles.footerButton}
          />
          <Button
            title="Clear All"
            onPress={handleClearAll}
            variant="ghost"
            size="small"
            style={styles.footerButton}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.white,
    ...shadows.sm,
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    ...typography.body,
    color: colors.text,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  addButtonText: {
    fontSize: 24,
    color: colors.white,
    fontWeight: '600',
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  statsText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  statsActions: {
    flexDirection: 'row',
  },
  toggleText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '500',
  },
  list: {
    padding: spacing.md,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    ...typography.body,
    color: colors.text,
  },
  itemNameChecked: {
    textDecorationLine: 'line-through',
    color: colors.textLight,
  },
  itemCategory: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  deleteButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    color: colors.textLight,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  emptyIcon: {
    fontSize: 48,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: spacing.md,
    backgroundColor: colors.white,
    ...shadows.md,
  },
  footerButton: {
    marginHorizontal: spacing.sm,
  },
});
