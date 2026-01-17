import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const MENU_ITEMS = [
  { id: 'cookbooks', label: 'Cookbooks', icon: '[=]', color: '#FF6B35', angle: 0 },
  { id: 'mealplan', label: 'Meal Plan', icon: '||', color: '#2EC4B6', angle: 45 },
  { id: 'groceries', label: 'Groceries', icon: 'O', color: '#9B59B6', angle: 90 },
  { id: 'favorites', label: 'Favorites', icon: '<3', color: '#E91E63', angle: 135 },
  { id: 'search', label: 'Search', icon: '?', color: '#3498DB', angle: 180 },
  { id: 'profile', label: 'Profile', icon: ':)', color: '#27AE60', angle: 225 },
  { id: 'settings', label: 'Settings', icon: '@', color: '#7F8C8D', angle: 270 },
  { id: 'share', label: 'Share', icon: '<>', color: '#F39C12', angle: 315 },
];

const RadialNavigationMenu = ({ onSelect, activeItem = 'cookbooks' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(activeItem);

  // Animation values
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const menuItemsAnim = useRef(MENU_ITEMS.map(() => new Animated.Value(0))).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const backgroundAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Continuous pulse for center button when closed
    if (!isOpen) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isOpen]);

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;

    // Animate background
    Animated.timing(backgroundAnim, {
      toValue,
      duration: 400,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();

    // Animate center button rotation
    Animated.spring(rotationAnim, {
      toValue,
      useNativeDriver: true,
      tension: 200,
      friction: 20,
    }).start();

    // Animate ring scale
    Animated.spring(scaleAnim, {
      toValue,
      useNativeDriver: true,
      tension: 100,
      friction: 10,
    }).start();

    // Stagger animate menu items
    const animations = menuItemsAnim.map((anim, index) =>
      Animated.spring(anim, {
        toValue,
        useNativeDriver: true,
        tension: 200,
        friction: 15,
        delay: index * 30,
      })
    );

    Animated.stagger(40, animations).start();

    setIsOpen(!isOpen);
  };

  const handleItemPress = (item) => {
    setSelectedItem(item.id);
    toggleMenu();
    onSelect && onSelect(item);
  };

  const rotation = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '135deg'],
  });

  const ringScale = scaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const RADIUS = 130; // Distance from center

  return (
    <View style={styles.container}>
      {/* Backdrop */}
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity: backgroundAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
          },
        ]}
        pointerEvents={isOpen ? 'auto' : 'none'}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={toggleMenu}
        />
      </Animated.View>

      {/* Menu container */}
      <View style={styles.menuContainer}>
        {/* Decorative rings */}
        <Animated.View
          style={[
            styles.decorativeRing,
            styles.ring1,
            {
              transform: [{ scale: ringScale }],
              opacity: scaleAnim,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.decorativeRing,
            styles.ring2,
            {
              transform: [{ scale: ringScale }],
              opacity: scaleAnim,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.decorativeRing,
            styles.ring3,
            {
              transform: [{ scale: ringScale }],
              opacity: scaleAnim,
            },
          ]}
        />

        {/* Menu items */}
        {MENU_ITEMS.map((item, index) => {
          const angle = (item.angle * Math.PI) / 180;
          const x = Math.cos(angle) * RADIUS;
          const y = Math.sin(angle) * RADIUS;

          const itemScale = menuItemsAnim[index];
          const isSelected = selectedItem === item.id;

          return (
            <Animated.View
              key={item.id}
              style={[
                styles.menuItemContainer,
                {
                  transform: [
                    {
                      translateX: itemScale.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, x],
                      }),
                    },
                    {
                      translateY: itemScale.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, y],
                      }),
                    },
                    { scale: itemScale },
                  ],
                  opacity: itemScale,
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.menuItem,
                  isSelected && styles.menuItemSelected,
                  { borderColor: item.color },
                ]}
                onPress={() => handleItemPress(item)}
                activeOpacity={0.8}
              >
                {isSelected ? (
                  <LinearGradient
                    colors={[item.color, item.color + 'CC']}
                    style={styles.menuItemGradient}
                  >
                    <Text style={[styles.menuIcon, styles.menuIconSelected]}>
                      {item.icon}
                    </Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.menuItemInner}>
                    <Text style={[styles.menuIcon, { color: item.color }]}>
                      {item.icon}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
              <Animated.Text
                style={[
                  styles.menuLabel,
                  {
                    opacity: itemScale.interpolate({
                      inputRange: [0.5, 1],
                      outputRange: [0, 1],
                    }),
                  },
                  isSelected && { color: item.color, fontWeight: '700' },
                ]}
              >
                {item.label}
              </Animated.Text>
            </Animated.View>
          );
        })}

        {/* Center button */}
        <Animated.View
          style={[
            styles.centerButtonContainer,
            {
              transform: [{ scale: isOpen ? 1 : pulseAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.centerButton}
            onPress={toggleMenu}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#FF6B35', '#FF8E53', '#FFA726']}
              style={styles.centerButtonGradient}
            >
              <Animated.Text
                style={[
                  styles.centerButtonIcon,
                  { transform: [{ rotate: rotation }] },
                ]}
              >
                +
              </Animated.Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Glowing ring effect */}
          <View style={styles.glowRing} />
        </Animated.View>

        {/* Current selection indicator */}
        {!isOpen && selectedItem && (
          <View style={styles.currentIndicator}>
            <Text style={styles.currentLabel}>
              {MENU_ITEMS.find(i => i.id === selectedItem)?.label}
            </Text>
          </View>
        )}
      </View>

      {/* Instructions text */}
      <Animated.View
        style={[
          styles.instructions,
          {
            opacity: backgroundAnim.interpolate({
              inputRange: [0, 0.5],
              outputRange: [1, 0],
            }),
          },
        ]}
      >
        <Text style={styles.instructionsText}>Tap to navigate</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F0F1A',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  menuContainer: {
    width: 340,
    height: 340,
    justifyContent: 'center',
    alignItems: 'center',
  },
  decorativeRing: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
  },
  ring1: {
    width: 320,
    height: 320,
    borderColor: 'rgba(255, 107, 53, 0.1)',
  },
  ring2: {
    width: 260,
    height: 260,
    borderColor: 'rgba(255, 107, 53, 0.15)',
    borderStyle: 'dashed',
  },
  ring3: {
    width: 200,
    height: 200,
    borderColor: 'rgba(255, 107, 53, 0.2)',
  },
  menuItemContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  menuItem: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1A1A2E',
    borderWidth: 2,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItemSelected: {
    borderWidth: 0,
  },
  menuItemInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    fontSize: 22,
    fontWeight: '700',
  },
  menuIconSelected: {
    color: '#FFFFFF',
  },
  menuLabel: {
    marginTop: 8,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
    textAlign: 'center',
  },
  centerButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  centerButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButtonIcon: {
    fontSize: 40,
    color: '#FFFFFF',
    fontWeight: '300',
  },
  glowRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'rgba(255, 107, 53, 0.3)',
    zIndex: -1,
  },
  currentIndicator: {
    position: 'absolute',
    bottom: -50,
    backgroundColor: 'rgba(255, 107, 53, 0.15)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.3)',
  },
  currentLabel: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
  },
  instructions: {
    position: 'absolute',
    bottom: 100,
  },
  instructionsText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.4)',
    fontWeight: '500',
  },
});

export default RadialNavigationMenu;
