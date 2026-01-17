import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Neumorphic design constants
const NEU_BG = '#E4EBF5';
const NEU_LIGHT = '#FFFFFF';
const NEU_DARK = '#C8D0E7';
const ACCENT = '#FF6B35';

const NeumorphicCookbooksScreen = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = ['all', 'dinner', 'lunch', 'desserts', 'drinks'];

  const cookbooks = [
    { id: 1, name: 'Italian Classics', count: 24, emoji: 'pasta', color: '#E74C3C' },
    { id: 2, name: 'Quick & Easy', count: 18, emoji: 'clock', color: '#3498DB' },
    { id: 3, name: 'Healthy Bowls', count: 12, emoji: 'salad', color: '#27AE60' },
    { id: 4, name: 'Sweet Treats', count: 31, emoji: 'cake', color: '#9B59B6' },
    { id: 5, name: 'Asian Fusion', count: 15, emoji: 'noodles', color: '#F39C12' },
    { id: 6, name: 'Comfort Food', count: 22, emoji: 'heart', color: '#E91E63' },
  ];

  const getEmojiDisplay = (emoji) => {
    const map = {
      pasta: '~',
      clock: '()',
      salad: '*',
      cake: '+',
      noodles: '#',
      heart: '<3',
    };
    return map[emoji] || '?';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.userName}>Chef Lana</Text>
        </View>

        {/* Neumorphic Profile Button */}
        <TouchableOpacity style={styles.neuProfileButton}>
          <View style={styles.neuProfileInner}>
            <Text style={styles.profileEmoji}>:)</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Search Bar - Neumorphic Inset */}
      <View style={styles.searchContainer}>
        <View style={styles.neuSearchInset}>
          <Text style={styles.searchIcon}>?</Text>
          <Text style={styles.searchPlaceholder}>Search your cookbooks...</Text>
        </View>
      </View>

      {/* Category Pills - Horizontal Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setActiveCategory(category)}
            style={[
              styles.neuCategoryPill,
              activeCategory === category && styles.neuCategoryPillActive,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                activeCategory === category && styles.categoryTextActive,
              ]}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Section Title */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Cookbooks</Text>
        <TouchableOpacity style={styles.neuSmallButton}>
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Cookbooks Grid */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.gridContainer}
      >
        <View style={styles.grid}>
          {cookbooks.map((cookbook, index) => (
            <TouchableOpacity
              key={cookbook.id}
              style={styles.neuCardOuter}
              activeOpacity={0.8}
            >
              <View style={styles.neuCard}>
                {/* Icon Circle with color accent */}
                <View style={[styles.iconCircle, { backgroundColor: cookbook.color + '15' }]}>
                  <View style={[styles.iconInner, { backgroundColor: cookbook.color + '25' }]}>
                    <Text style={[styles.cookbookEmoji, { color: cookbook.color }]}>
                      {getEmojiDisplay(cookbook.emoji)}
                    </Text>
                  </View>
                </View>

                {/* Cookbook Info */}
                <Text style={styles.cookbookName} numberOfLines={2}>
                  {cookbook.name}
                </Text>
                <Text style={styles.recipeCount}>
                  {cookbook.count} recipes
                </Text>

                {/* Progress Bar */}
                <View style={styles.progressBarBg}>
                  <LinearGradient
                    colors={[cookbook.color, cookbook.color + 'AA']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[
                      styles.progressBarFill,
                      { width: `${Math.min(cookbook.count * 3, 100)}%` },
                    ]}
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Featured Recipe - Large Neumorphic Card */}
        <View style={styles.featuredSection}>
          <Text style={styles.featuredTitle}>Featured Recipe</Text>
          <View style={styles.neuFeaturedCard}>
            <View style={styles.featuredContent}>
              <View style={styles.featuredImagePlaceholder}>
                <LinearGradient
                  colors={['#FF6B35', '#FF8F66', '#FFB899']}
                  style={styles.featuredGradient}
                >
                  <Text style={styles.featuredEmoji}>@</Text>
                </LinearGradient>
              </View>
              <View style={styles.featuredInfo}>
                <Text style={styles.featuredRecipeName}>
                  Truffle Mushroom Risotto
                </Text>
                <Text style={styles.featuredMeta}>
                  45 min {'*'} Medium {'*'} Italian
                </Text>
                <View style={styles.featuredTags}>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>Vegetarian</Text>
                  </View>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>Gluten-Free</Text>
                  </View>
                </View>
              </View>
            </View>
            {/* Arrow button */}
            <View style={styles.neuArrowButton}>
              <Text style={styles.arrowText}>{'>'}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Nav - Neumorphic Style */}
      <View style={styles.bottomNav}>
        <View style={styles.neuNavBar}>
          <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
            <Text style={[styles.navIcon, styles.navIconActive]}>[=]</Text>
            <Text style={[styles.navLabel, styles.navLabelActive]}>Cookbooks</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navIcon}>||</Text>
            <Text style={styles.navLabel}>Meal Plan</Text>
          </TouchableOpacity>
          {/* Center FAB */}
          <TouchableOpacity style={styles.neuFab}>
            <LinearGradient
              colors={['#FF6B35', '#FF8F66']}
              style={styles.fabGradient}
            >
              <Text style={styles.fabIcon}>+</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navIcon}>O</Text>
            <Text style={styles.navLabel}>Groceries</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navIcon}>...</Text>
            <Text style={styles.navLabel}>More</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEU_BG,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 14,
    color: '#7F8C9A',
    fontWeight: '500',
  },
  userName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#2D3748',
    marginTop: 2,
  },
  neuProfileButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: NEU_BG,
    shadowColor: NEU_DARK,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 8,
  },
  neuProfileInner: {
    flex: 1,
    borderRadius: 26,
    backgroundColor: NEU_BG,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: NEU_LIGHT,
    shadowOffset: { width: -6, height: -6 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  profileEmoji: {
    fontSize: 24,
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  neuSearchInset: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NEU_BG,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    // Inset shadow effect
    shadowColor: NEU_DARK,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: NEU_LIGHT,
  },
  searchIcon: {
    fontSize: 18,
    color: '#9CA3AF',
    marginRight: 12,
  },
  searchPlaceholder: {
    fontSize: 15,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  categoryContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  neuCategoryPill: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginHorizontal: 4,
    backgroundColor: NEU_BG,
    shadowColor: NEU_DARK,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },
  neuCategoryPillActive: {
    backgroundColor: ACCENT,
    shadowColor: ACCENT,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
  },
  neuSmallButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: NEU_BG,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: NEU_DARK,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  addIcon: {
    fontSize: 20,
    color: ACCENT,
    fontWeight: '700',
  },
  gridContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  neuCardOuter: {
    width: (width - 56) / 2,
    marginBottom: 16,
  },
  neuCard: {
    backgroundColor: NEU_BG,
    borderRadius: 24,
    padding: 20,
    shadowColor: NEU_DARK,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 8,
    // Light shadow for top-left
    borderWidth: 1,
    borderColor: NEU_LIGHT,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cookbookEmoji: {
    fontSize: 24,
    fontWeight: '700',
  },
  cookbookName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 4,
  },
  recipeCount: {
    fontSize: 13,
    color: '#7F8C9A',
    marginBottom: 12,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#D1D5DB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  featuredSection: {
    marginTop: 8,
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  neuFeaturedCard: {
    backgroundColor: NEU_BG,
    borderRadius: 28,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: NEU_DARK,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 8,
    borderWidth: 1,
    borderColor: NEU_LIGHT,
  },
  featuredContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 16,
  },
  featuredGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredEmoji: {
    fontSize: 36,
    color: '#FFFFFF',
  },
  featuredInfo: {
    flex: 1,
  },
  featuredRecipeName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 6,
  },
  featuredMeta: {
    fontSize: 13,
    color: '#7F8C9A',
    marginBottom: 10,
  },
  featuredTags: {
    flexDirection: 'row',
  },
  tag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  tagText: {
    fontSize: 11,
    color: '#27AE60',
    fontWeight: '600',
  },
  neuArrowButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: NEU_BG,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: NEU_DARK,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  arrowText: {
    fontSize: 18,
    color: ACCENT,
    fontWeight: '700',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 12,
    backgroundColor: NEU_BG,
  },
  neuNavBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: NEU_BG,
    borderRadius: 28,
    paddingVertical: 12,
    paddingHorizontal: 8,
    shadowColor: NEU_DARK,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: NEU_LIGHT,
  },
  navItem: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  navItemActive: {},
  navIcon: {
    fontSize: 20,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  navIconActive: {
    color: ACCENT,
  },
  navLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  navLabelActive: {
    color: ACCENT,
    fontWeight: '600',
  },
  neuFab: {
    marginTop: -40,
    width: 64,
    height: 64,
    borderRadius: 20,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  fabGradient: {
    flex: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabIcon: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '300',
  },
});

export default NeumorphicCookbooksScreen;
