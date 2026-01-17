import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Neon color palette
const NEON = {
  pink: '#FF00FF',
  cyan: '#00FFFF',
  green: '#39FF14',
  orange: '#FF6600',
  purple: '#BF00FF',
  yellow: '#FFFF00',
  darkBg: '#0A0A0F',
  darkCard: '#12121A',
  darkSurface: '#1A1A25',
};

const NeonRecipeDetailScreen = ({ recipe, onBack }) => {
  const glowAnim = useRef(new Animated.Value(0)).current;
  const scanlineAnim = useRef(new Animated.Value(0)).current;

  // Demo recipe data
  const recipeData = recipe || {
    title: 'Cyberpunk Ramen',
    subtitle: 'Neon Night Special',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
    cookTime: '35 min',
    servings: 2,
    difficulty: 'HARD',
    calories: 680,
    rating: 4.9,
    chef: 'Neo Chef',
    ingredients: [
      { item: 'Ramen noodles', amount: '400g', category: 'noodles' },
      { item: 'Pork belly', amount: '200g', category: 'protein' },
      { item: 'Soft-boiled eggs', amount: '2', category: 'protein' },
      { item: 'Green onions', amount: '4', category: 'veg' },
      { item: 'Nori sheets', amount: '4', category: 'dry' },
      { item: 'Tonkotsu broth', amount: '1L', category: 'liquid' },
      { item: 'Soy sauce', amount: '3 tbsp', category: 'sauce' },
      { item: 'Mirin', amount: '2 tbsp', category: 'sauce' },
      { item: 'Garlic', amount: '4 cloves', category: 'veg' },
      { item: 'Ginger', amount: '2 inch', category: 'veg' },
    ],
    instructions: [
      'Prepare the tonkotsu broth by simmering pork bones for 8 hours until creamy white.',
      'Marinate pork belly in soy sauce, mirin, and sake overnight.',
      'Slow-roast the pork belly at 150C for 3 hours until tender.',
      'Soft-boil eggs for exactly 6.5 minutes, then ice bath immediately.',
      'Marinate eggs in soy and mirin mixture for at least 2 hours.',
      'Cook ramen noodles according to package, keep al dente.',
      'Assemble: broth, noodles, sliced pork, halved egg, nori, green onions.',
      'Serve immediately while piping hot. Slurp loudly.',
    ],
  };

  useEffect(() => {
    // Pulsing glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Scanline animation
    Animated.loop(
      Animated.timing(scanlineAnim, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const scanlineY = scanlineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, height],
  });

  const getCategoryColor = (category) => {
    const colors = {
      protein: NEON.pink,
      noodles: NEON.cyan,
      veg: NEON.green,
      sauce: NEON.orange,
      dry: NEON.purple,
      liquid: NEON.cyan,
    };
    return colors[category] || NEON.cyan;
  };

  return (
    <View style={styles.container}>
      {/* Scanline effect overlay */}
      <Animated.View
        style={[
          styles.scanline,
          { transform: [{ translateY: scanlineY }] },
        ]}
        pointerEvents="none"
      />

      {/* Background grid pattern */}
      <View style={styles.gridPattern}>
        {Array.from({ length: 20 }).map((_, i) => (
          <View key={`h-${i}`} style={[styles.gridLine, styles.gridHorizontal, { top: i * 40 }]} />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <View key={`v-${i}`} style={[styles.gridLine, styles.gridVertical, { left: i * 40 }]} />
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Image Section */}
        <View style={styles.heroSection}>
          <ImageBackground
            source={{ uri: recipeData.image }}
            style={styles.heroImage}
          >
            <LinearGradient
              colors={['transparent', 'rgba(10,10,15,0.8)', NEON.darkBg]}
              style={styles.heroGradient}
            />

            {/* Neon border frame */}
            <View style={styles.neonFrame}>
              <Animated.View style={[styles.frameLine, styles.frameTop, { opacity: glowOpacity }]} />
              <Animated.View style={[styles.frameLine, styles.frameBottom, { opacity: glowOpacity }]} />
              <Animated.View style={[styles.frameLine, styles.frameLeft, { opacity: glowOpacity }]} />
              <Animated.View style={[styles.frameLine, styles.frameRight, { opacity: glowOpacity }]} />
            </View>

            {/* Back button */}
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Text style={styles.backIcon}>{'<'}</Text>
            </TouchableOpacity>

            {/* Difficulty badge */}
            <View style={styles.difficultyBadge}>
              <Text style={styles.difficultyText}>{recipeData.difficulty}</Text>
            </View>

            {/* Hero text overlay */}
            <View style={styles.heroTextContainer}>
              <Text style={styles.heroSubtitle}>{recipeData.subtitle}</Text>
              <Text style={styles.heroTitle}>{recipeData.title}</Text>
              <Text style={styles.chefName}>// by {recipeData.chef}</Text>
            </View>
          </ImageBackground>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statIcon}>( )</Text>
            <Text style={styles.statValue}>{recipeData.cookTime}</Text>
            <Text style={styles.statLabel}>TIME</Text>
          </View>
          <View style={[styles.statBox, styles.statBoxCenter]}>
            <Text style={styles.statIcon}>*</Text>
            <Text style={styles.statValue}>{recipeData.rating}</Text>
            <Text style={styles.statLabel}>RATING</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statIcon}>~</Text>
            <Text style={styles.statValue}>{recipeData.calories}</Text>
            <Text style={styles.statLabel}>KCAL</Text>
          </View>
          <View style={[styles.statBox, styles.statBoxLast]}>
            <Text style={styles.statIcon}>#</Text>
            <Text style={styles.statValue}>{recipeData.servings}</Text>
            <Text style={styles.statLabel}>SERVINGS</Text>
          </View>
        </View>

        {/* Ingredients Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{'<'} INGREDIENTS {'/>'}</Text>
            <View style={styles.sectionLine} />
          </View>

          <View style={styles.ingredientsGrid}>
            {recipeData.ingredients.map((ing, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.ingredientCard,
                  { borderColor: getCategoryColor(ing.category) + '40' },
                ]}
              >
                <View style={[styles.ingredientGlow, { backgroundColor: getCategoryColor(ing.category) + '20' }]} />
                <View style={styles.ingredientContent}>
                  <Text style={[styles.ingredientAmount, { color: getCategoryColor(ing.category) }]}>
                    {ing.amount}
                  </Text>
                  <Text style={styles.ingredientItem}>{ing.item}</Text>
                </View>
                <View style={[styles.ingredientIndex, { backgroundColor: getCategoryColor(ing.category) }]}>
                  <Text style={styles.indexText}>{String(index + 1).padStart(2, '0')}</Text>
                </View>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Instructions Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{'<'} INSTRUCTIONS {'/>'}</Text>
            <View style={styles.sectionLine} />
          </View>

          <View style={styles.instructionsContainer}>
            {recipeData.instructions.map((step, index) => (
              <View key={index} style={styles.instructionStep}>
                <View style={styles.stepNumberContainer}>
                  <LinearGradient
                    colors={[NEON.pink, NEON.purple]}
                    style={styles.stepNumberGradient}
                  >
                    <Text style={styles.stepNumber}>{String(index + 1).padStart(2, '0')}</Text>
                  </LinearGradient>
                  {index < recipeData.instructions.length - 1 && (
                    <View style={styles.stepLine} />
                  )}
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Start Cooking Button */}
        <View style={styles.ctaSection}>
          <TouchableOpacity style={styles.ctaButton} activeOpacity={0.8}>
            <LinearGradient
              colors={[NEON.pink, NEON.purple]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaGradient}
            >
              <Text style={styles.ctaText}>{'>>>'} START COOKING {'<<<'}</Text>
            </LinearGradient>
            <Animated.View style={[styles.ctaGlow, { opacity: glowOpacity }]} />
          </TouchableOpacity>
        </View>

        {/* Terminal footer */}
        <View style={styles.terminalFooter}>
          <Text style={styles.terminalText}>
            {`> RECIPE_ID: #${Math.random().toString(36).substr(2, 8).toUpperCase()}`}
          </Text>
          <Text style={styles.terminalText}>
            {`> LOADED: ${new Date().toISOString()}`}
          </Text>
          <Text style={styles.terminalBlink}>{'_'}</Text>
        </View>
      </ScrollView>

      {/* Floating action buttons */}
      <View style={styles.floatingActions}>
        <TouchableOpacity style={[styles.fab, styles.fabSave]}>
          <Text style={styles.fabIcon}>{'<3'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.fab, styles.fabShare]}>
          <Text style={styles.fabIcon}>{'<>'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEON.darkBg,
  },
  scanline: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: NEON.cyan,
    opacity: 0.1,
    zIndex: 100,
  },
  gridPattern: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.03,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: NEON.cyan,
  },
  gridHorizontal: {
    left: 0,
    right: 0,
    height: 1,
  },
  gridVertical: {
    top: 0,
    bottom: 0,
    width: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  heroSection: {
    height: 380,
  },
  heroImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  neonFrame: {
    ...StyleSheet.absoluteFillObject,
    margin: 16,
  },
  frameLine: {
    position: 'absolute',
    backgroundColor: NEON.pink,
    shadowColor: NEON.pink,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  frameTop: {
    top: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  frameBottom: {
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  frameLeft: {
    top: 0,
    bottom: 0,
    left: 0,
    width: 2,
  },
  frameRight: {
    top: 0,
    bottom: 0,
    right: 0,
    width: 2,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: NEON.darkCard,
    borderWidth: 1,
    borderColor: NEON.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: NEON.cyan,
    fontWeight: '700',
  },
  difficultyBadge: {
    position: 'absolute',
    top: 60,
    right: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: NEON.pink + '30',
    borderWidth: 1,
    borderColor: NEON.pink,
    borderRadius: 4,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '800',
    color: NEON.pink,
    letterSpacing: 2,
  },
  heroTextContainer: {
    padding: 24,
    paddingBottom: 32,
  },
  heroSubtitle: {
    fontSize: 14,
    color: NEON.cyan,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 8,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: NEON.pink,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    letterSpacing: -1,
  },
  chefName: {
    fontSize: 14,
    color: NEON.green,
    marginTop: 12,
    fontFamily: 'monospace',
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: -20,
    backgroundColor: NEON.darkCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: NEON.cyan + '30',
    overflow: 'hidden',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    borderRightWidth: 1,
    borderRightColor: NEON.cyan + '20',
  },
  statBoxCenter: {},
  statBoxLast: {
    borderRightWidth: 0,
  },
  statIcon: {
    fontSize: 18,
    color: NEON.cyan,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: 'monospace',
  },
  statLabel: {
    fontSize: 10,
    color: NEON.cyan,
    letterSpacing: 1,
    marginTop: 4,
    fontWeight: '600',
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: NEON.pink,
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  sectionLine: {
    height: 2,
    backgroundColor: NEON.pink + '40',
    marginTop: 12,
    borderRadius: 1,
  },
  ingredientsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  ingredientCard: {
    width: (width - 44) / 2,
    marginHorizontal: 6,
    marginBottom: 12,
    backgroundColor: NEON.darkCard,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  ingredientGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  ingredientContent: {
    padding: 16,
    paddingRight: 40,
  },
  ingredientAmount: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  ingredientItem: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  ingredientIndex: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#000000',
    fontFamily: 'monospace',
  },
  instructionsContainer: {
    marginTop: 8,
  },
  instructionStep: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  stepNumberContainer: {
    alignItems: 'center',
    width: 50,
  },
  stepNumberGradient: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: 'monospace',
  },
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: NEON.purple + '40',
    marginTop: 8,
    minHeight: 40,
  },
  stepContent: {
    flex: 1,
    paddingLeft: 16,
    paddingTop: 8,
  },
  stepText: {
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 24,
    fontWeight: '400',
  },
  ctaSection: {
    marginTop: 40,
    marginHorizontal: 16,
  },
  ctaButton: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  ctaGradient: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
    fontFamily: 'monospace',
  },
  ctaGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: NEON.pink,
    shadowColor: NEON.pink,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
  },
  terminalFooter: {
    marginTop: 48,
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: NEON.darkCard,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: NEON.green + '30',
  },
  terminalText: {
    fontSize: 11,
    color: NEON.green,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  terminalBlink: {
    fontSize: 14,
    color: NEON.green,
    fontFamily: 'monospace',
    marginTop: 8,
  },
  floatingActions: {
    position: 'absolute',
    right: 20,
    bottom: 100,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
  },
  fabSave: {
    backgroundColor: NEON.pink + '20',
    borderColor: NEON.pink,
    shadowColor: NEON.pink,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  fabShare: {
    backgroundColor: NEON.cyan + '20',
    borderColor: NEON.cyan,
    shadowColor: NEON.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

export default NeonRecipeDetailScreen;
