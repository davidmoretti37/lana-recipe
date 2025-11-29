import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { colors } from '../utils/theme';

// Screens
import CookbooksScreen from '../screens/cookbooks/CookbooksScreen';
import CookbookDetailScreen from '../screens/cookbooks/CookbookDetailScreen';
import RecipeDetailScreen from '../screens/recipes/RecipeDetailScreen';
import AddRecipeScreen from '../screens/recipes/AddRecipeScreen';
import MealPlanScreen from '../screens/mealplan/MealPlanScreen';
import GroceriesScreen from '../screens/groceries/GroceriesScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SearchScreen from '../screens/search/SearchScreen';

// Icons (using simple text for now - would use proper icons in production)
import { TabIcon } from '../components/TabIcon';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Cookbook Stack
function CookbooksStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen
        name="CookbooksList"
        component={CookbooksScreen}
        options={{ title: 'Cookbooks' }}
      />
      <Stack.Screen
        name="CookbookDetail"
        component={CookbookDetailScreen}
        options={({ route }) => ({ title: route.params?.name || 'Cookbook' })}
      />
      <Stack.Screen
        name="RecipeDetail"
        component={RecipeDetailScreen}
        options={{ title: 'Recipe' }}
      />
    </Stack.Navigator>
  );
}

// Meal Plan Stack
function MealPlanStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen
        name="MealPlanMain"
        component={MealPlanScreen}
        options={{ title: 'Meal Plan' }}
      />
    </Stack.Navigator>
  );
}

// Groceries Stack
function GroceriesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen
        name="GroceriesMain"
        component={GroceriesScreen}
        options={{ title: 'Groceries' }}
      />
    </Stack.Navigator>
  );
}

// Profile Stack
function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Stack.Navigator>
  );
}

// Custom Add Button
function AddButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.addButton} onPress={onPress}>
      <View style={styles.addButtonInner}>
        <TabIcon name="add" size={32} color="#fff" />
      </View>
    </TouchableOpacity>
  );
}

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tab.Screen
        name="Cookbooks"
        component={CookbooksStack}
        options={{
          tabBarIcon: ({ color, size }) => <TabIcon name="book" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="MealPlan"
        component={MealPlanStack}
        options={{
          title: 'Meal Plan',
          tabBarIcon: ({ color, size }) => <TabIcon name="calendar" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddRecipeScreen}
        options={({ navigation }) => ({
          tabBarButton: (props) => (
            <AddButton onPress={() => navigation.navigate('Add')} />
          ),
        })}
      />
      <Tab.Screen
        name="Groceries"
        component={GroceriesStack}
        options={{
          tabBarIcon: ({ color, size }) => <TabIcon name="cart" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          title: 'More',
          tabBarIcon: ({ color, size }) => <TabIcon name="menu" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 85,
    paddingTop: 10,
    paddingBottom: 25,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  addButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});
