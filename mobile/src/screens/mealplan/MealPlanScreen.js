import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { format, addDays, startOfWeek, addWeeks, subWeeks } from 'date-fns';
import { colors, spacing, typography, borderRadius, shadows } from '../../utils/theme';
import { fetchMealPlan, setCurrentWeek, generateGroceriesFromMealPlan } from '../../store/slices/mealPlanSlice';
import { Button } from '../../components/Button';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function MealPlanScreen({ navigation }) {
  const dispatch = useDispatch();
  const { currentPlan, currentWeekStart, isLoading } = useSelector((state) => state.mealPlan);

  useEffect(() => {
    dispatch(fetchMealPlan(currentWeekStart));
  }, [currentWeekStart]);

  const weekStart = new Date(currentWeekStart);
  const weekEnd = addDays(weekStart, 6);

  const goToPreviousWeek = () => {
    const newWeek = format(subWeeks(weekStart, 1), 'yyyy-MM-dd');
    dispatch(setCurrentWeek(newWeek));
  };

  const goToNextWeek = () => {
    const newWeek = format(addWeeks(weekStart, 1), 'yyyy-MM-dd');
    dispatch(setCurrentWeek(newWeek));
  };

  const getMealsForDay = (dayIndex) => {
    if (!currentPlan?.items) return [];
    const targetDate = format(addDays(weekStart, dayIndex), 'yyyy-MM-dd');
    return currentPlan.items.filter((item) =>
      format(new Date(item.date), 'yyyy-MM-dd') === targetDate
    );
  };

  const handleGenerateGroceries = () => {
    Alert.alert(
      'Generate Grocery List',
      'Add all ingredients from this week\'s meal plan to your grocery list?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Generate',
          onPress: () => {
            dispatch(generateGroceriesFromMealPlan(currentWeekStart)).then((action) => {
              if (!action.error) {
                Alert.alert('Success', `${action.payload.itemsAdded} items added to grocery list!`);
              }
            });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goToPreviousWeek} style={styles.navButton}>
          <Text style={styles.navButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.weekInfo}>
          <Text style={styles.weekText}>
            {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
          </Text>
        </View>
        <TouchableOpacity onPress={goToNextWeek} style={styles.navButton}>
          <Text style={styles.navButtonText}>→</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.calendar}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => dispatch(fetchMealPlan(currentWeekStart))}
            tintColor={colors.primary}
          />
        }
      >
        {DAYS.map((day, index) => {
          const meals = getMealsForDay(index);
          const dayDate = addDays(weekStart, index);
          const isToday = format(new Date(), 'yyyy-MM-dd') === format(dayDate, 'yyyy-MM-dd');

          return (
            <View key={day} style={[styles.dayRow, isToday && styles.todayRow]}>
              <View style={styles.dayHeader}>
                <Text style={[styles.dayName, isToday && styles.todayText]}>{day}</Text>
                <Text style={[styles.dayDate, isToday && styles.todayText]}>
                  {format(dayDate, 'd')}
                </Text>
              </View>
              <View style={styles.meals}>
                {meals.length > 0 ? (
                  meals.map((meal) => (
                    <TouchableOpacity
                      key={meal.id}
                      style={styles.mealCard}
                      onPress={() => navigation.navigate('Cookbooks', {
                        screen: 'RecipeDetail',
                        params: { id: meal.recipe.id },
                      })}
                    >
                      <Text style={styles.mealType}>{meal.mealType}</Text>
                      <Text style={styles.mealTitle} numberOfLines={1}>
                        {meal.recipe.title}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <TouchableOpacity style={styles.emptyMeal}>
                    <Text style={styles.emptyMealText}>+ Add meal</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Generate Grocery List"
          onPress={handleGenerateGroceries}
          variant="secondary"
          style={styles.footerButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.white,
    ...shadows.sm,
  },
  navButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 24,
    color: colors.primary,
  },
  weekInfo: {
    alignItems: 'center',
  },
  weekText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  calendar: {
    flex: 1,
  },
  dayRow: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  todayRow: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  dayHeader: {
    width: 50,
    alignItems: 'center',
  },
  dayName: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },
  dayDate: {
    ...typography.h3,
    color: colors.textSecondary,
  },
  todayText: {
    color: colors.primary,
  },
  meals: {
    flex: 1,
    marginLeft: spacing.md,
  },
  mealCard: {
    backgroundColor: colors.primary + '10',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.xs,
  },
  mealType: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  mealTitle: {
    ...typography.bodySmall,
    color: colors.text,
  },
  emptyMeal: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  emptyMealText: {
    ...typography.bodySmall,
    color: colors.textLight,
  },
  footer: {
    padding: spacing.md,
    backgroundColor: colors.white,
    ...shadows.md,
  },
  footerButton: {
    marginBottom: spacing.sm,
  },
});
