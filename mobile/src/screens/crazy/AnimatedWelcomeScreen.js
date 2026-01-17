import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const AnimatedWelcomeScreen = ({ onGetStarted }) => {
  // Animation values
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(50)).current;
  const scaleIn = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Floating food animations
  const float1 = useRef(new Animated.Value(0)).current;
  const float2 = useRef(new Animated.Value(0)).current;
  const float3 = useRef(new Animated.Value(0)).current;
  const float4 = useRef(new Animated.Value(0)).current;
  const float5 = useRef(new Animated.Value(0)).current;

  const [currentGradient, setCurrentGradient] = useState(0);

  const gradients = [
    ['#FF6B35', '#FF8E53', '#FFA726'],
    ['#FF6B35', '#E91E63', '#9C27B0'],
    ['#FF6B35', '#F44336', '#FF5722'],
    ['#FF8E53', '#FF6B35', '#E55A28'],
  ];

  useEffect(() => {
    // Main content animations
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.2)),
      }),
      Animated.timing(scaleIn, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5)),
      }),
    ]).start();

    // Continuous rotation for decorative element
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();

    // Pulse animation for CTA button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();

    // Floating animations for food items
    const createFloatAnimation = (animValue, duration, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.sine),
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.sine),
          }),
        ])
      );
    };

    createFloatAnimation(float1, 3000, 0).start();
    createFloatAnimation(float2, 3500, 500).start();
    createFloatAnimation(float3, 2800, 200).start();
    createFloatAnimation(float4, 3200, 800).start();
    createFloatAnimation(float5, 2600, 400).start();

    // Gradient color cycling
    const gradientInterval = setInterval(() => {
      setCurrentGradient((prev) => (prev + 1) % gradients.length);
    }, 4000);

    return () => clearInterval(gradientInterval);
  }, []);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const floatY1 = float1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  const floatY2 = float2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -25],
  });

  const floatY3 = float3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -35],
  });

  const floatY4 = float4.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const floatY5 = float5.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -28],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradients[currentGradient]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Floating decorative circles */}
        <View style={styles.decorativeCircles}>
          <Animated.View
            style={[
              styles.circle,
              styles.circle1,
              { transform: [{ rotate: rotation }] },
            ]}
          />
          <Animated.View
            style={[
              styles.circle,
              styles.circle2,
              { transform: [{ rotate: rotation }] },
            ]}
          />
          <Animated.View
            style={[
              styles.circle,
              styles.circle3,
            ]}
          />
        </View>

        {/* Floating food items */}
        <Animated.View
          style={[
            styles.floatingItem,
            styles.food1,
            { transform: [{ translateY: floatY1 }] },
          ]}
        >
          <Text style={styles.foodEmoji}>~</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.floatingItem,
            styles.food2,
            { transform: [{ translateY: floatY2 }, { rotate: '15deg' }] },
          ]}
        >
          <Text style={styles.foodEmoji}>*</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.floatingItem,
            styles.food3,
            { transform: [{ translateY: floatY3 }, { rotate: '-10deg' }] },
          ]}
        >
          <Text style={styles.foodEmoji}>#</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.floatingItem,
            styles.food4,
            { transform: [{ translateY: floatY4 }] },
          ]}
        >
          <Text style={styles.foodEmoji}>@</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.floatingItem,
            styles.food5,
            { transform: [{ translateY: floatY5 }, { rotate: '20deg' }] },
          ]}
        >
          <Text style={styles.foodEmoji}>+</Text>
        </Animated.View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Logo / Icon Area */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: fadeIn,
                transform: [{ scale: scaleIn }],
              },
            ]}
          >
            <View style={styles.logoOuter}>
              <View style={styles.logoMiddle}>
                <View style={styles.logoInner}>
                  <Text style={styles.logoText}>L</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Title */}
          <Animated.View
            style={{
              opacity: fadeIn,
              transform: [{ translateY: slideUp }],
            }}
          >
            <Text style={styles.title}>Lana Recipe</Text>
            <Text style={styles.subtitle}>
              Your AI-powered recipe companion
            </Text>
          </Animated.View>

          {/* Features */}
          <Animated.View
            style={[
              styles.featuresContainer,
              {
                opacity: fadeIn,
                transform: [{ translateY: slideUp }],
              },
            ]}
          >
            <View style={styles.featureRow}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>
                Extract recipes from Instagram instantly
              </Text>
            </View>
            <View style={styles.featureRow}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>
                AI analyzes videos & captions for you
              </Text>
            </View>
            <View style={styles.featureRow}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>
                Organize your digital cookbook
              </Text>
            </View>
          </Animated.View>
        </View>

        {/* Bottom CTA */}
        <Animated.View
          style={[
            styles.ctaContainer,
            {
              opacity: fadeIn,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={onGetStarted}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
              style={styles.ctaGradient}
            >
              <Text style={styles.ctaText}>Get Started</Text>
              <View style={styles.ctaArrow}>
                <Text style={styles.arrowText}>{'>'}</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.loginText}>
            Already have an account?{' '}
            <Text style={styles.loginLink}>Sign In</Text>
          </Text>
        </Animated.View>

        {/* Bottom wave decoration */}
        <View style={styles.waveContainer}>
          <View style={styles.wave1} />
          <View style={styles.wave2} />
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    position: 'relative',
  },
  decorativeCircles: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 999,
  },
  circle1: {
    width: 400,
    height: 400,
    top: -100,
    left: -100,
  },
  circle2: {
    width: 300,
    height: 300,
    top: 50,
    right: -80,
  },
  circle3: {
    width: 200,
    height: 200,
    bottom: 200,
    left: -50,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  floatingItem: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  food1: {
    top: 80,
    left: 30,
  },
  food2: {
    top: 120,
    right: 40,
  },
  food3: {
    top: height * 0.35,
    right: 20,
  },
  food4: {
    bottom: height * 0.35,
    left: 20,
  },
  food5: {
    bottom: 180,
    right: 50,
  },
  foodEmoji: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoMiddle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  logoText: {
    fontSize: 44,
    fontWeight: '900',
    color: '#FF6B35',
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '500',
  },
  featuresContainer: {
    marginTop: 48,
    alignSelf: 'stretch',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    marginRight: 16,
  },
  featureText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '500',
    flex: 1,
  },
  ctaContainer: {
    paddingHorizontal: 40,
    paddingBottom: 60,
    alignItems: 'center',
  },
  ctaButton: {
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  ctaArrow: {
    marginLeft: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  loginText: {
    marginTop: 24,
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  loginLink: {
    fontWeight: '700',
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
  waveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    overflow: 'hidden',
  },
  wave1: {
    position: 'absolute',
    bottom: -40,
    left: -50,
    right: -50,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    transform: [{ scaleX: 1.5 }],
  },
  wave2: {
    position: 'absolute',
    bottom: -50,
    left: -30,
    right: -30,
    height: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    transform: [{ scaleX: 1.3 }],
  },
});

export default AnimatedWelcomeScreen;
