import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;
const CARD_HEIGHT = 280;

const GlassmorphicRecipeCard = ({ recipe, onPress }) => {
  const {
    title = 'Spicy Mango Glazed Salmon',
    image = 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800',
    cookTime = '25 min',
    difficulty = 'Medium',
    rating = 4.8,
    calories = 420,
    chef = 'Chef Maria',
  } = recipe || {};

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <View style={styles.cardContainer}>
        <ImageBackground
          source={{ uri: image }}
          style={styles.imageBackground}
          imageStyle={styles.backgroundImage}
        >
          {/* Gradient overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          />

          {/* Glass pill - Top right */}
          <View style={styles.ratingPill}>
            <Text style={styles.ratingText}>{'*'} {rating}</Text>
          </View>

          {/* Glass pill - Difficulty */}
          <View style={styles.difficultyPill}>
            <Text style={styles.difficultyText}>{difficulty}</Text>
          </View>

          {/* Glassmorphic info panel */}
          <View style={styles.glassPanel}>
            {/* Inner blur effect simulation */}
            <View style={styles.glassPanelInner}>
              <View style={styles.headerRow}>
                <Text style={styles.title} numberOfLines={2}>{title}</Text>
                <View style={styles.heartButton}>
                  <Text style={styles.heartEmoji}>{'<3'}</Text>
                </View>
              </View>

              <Text style={styles.chefName}>by {chef}</Text>

              {/* Stats row */}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>{'()'}</Text>
                  <Text style={styles.statValue}>{cookTime}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>{'~'}</Text>
                  <Text style={styles.statValue}>{calories} cal</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>{'!'}</Text>
                  <Text style={styles.statValue}>Save</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Floating action bubble */}
          <View style={styles.actionBubble}>
            <Text style={styles.actionText}>{'>'}</Text>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 28,
    overflow: 'hidden',
    // Outer shadow for depth
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 20,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backgroundImage: {
    borderRadius: 28,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
  },
  ratingPill: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    // Blur simulation with opacity
    backdropFilter: 'blur(10px)',
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  difficultyPill: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(255, 107, 53, 0.85)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  difficultyText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  glassPanel: {
    margin: 12,
    borderRadius: 20,
    overflow: 'hidden',
    // Glass effect
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  glassPanelInner: {
    padding: 16,
    // Secondary layer for frosted effect
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginRight: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heartButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  heartEmoji: {
    fontSize: 16,
    color: '#FF6B6B',
  },
  chefName: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIcon: {
    fontSize: 14,
    marginRight: 6,
    color: '#FFFFFF',
  },
  statValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionBubble: {
    position: 'absolute',
    right: 24,
    top: '50%',
    marginTop: -24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
});

export default GlassmorphicRecipeCard;
