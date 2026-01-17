import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  Easing,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const FloatingIslandAddRecipeScreen = ({ onExtract, onClose }) => {
  const [inputUrl, setInputUrl] = useState('');
  const [inputMethod, setInputMethod] = useState('url'); // 'url' or 'photo'
  const [isExtracting, setIsExtracting] = useState(false);

  // Animations
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;
  const islandFloat = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const extractProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Floating blobs
    const createFloat = (anim, duration) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.sine),
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.sine),
          }),
        ])
      );
    };

    createFloat(floatAnim1, 3000).start();
    createFloat(floatAnim2, 4000).start();
    createFloat(floatAnim3, 3500).start();
    createFloat(islandFloat, 5000).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Slow rotation for decorative element
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 30000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
  }, []);

  const handleExtract = () => {
    if (!inputUrl.trim()) return;

    setIsExtracting(true);

    Animated.timing(extractProgress, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
      easing: Easing.out(Easing.cubic),
    }).start(() => {
      setIsExtracting(false);
      onExtract && onExtract(inputUrl);
    });
  };

  const floatY1 = floatAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const floatY2 = floatAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  const floatY3 = floatAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const islandY = islandFloat.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressWidth = extractProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* Background gradient */}
      <LinearGradient
        colors={['#1A1A2E', '#16213E', '#0F0F23']}
        style={StyleSheet.absoluteFill}
      />

      {/* Rotating decorative ring */}
      <Animated.View
        style={[
          styles.decorativeRing,
          { transform: [{ rotate: rotation }] },
        ]}
      />

      {/* Floating blob elements */}
      <Animated.View
        style={[
          styles.floatingBlob,
          styles.blob1,
          { transform: [{ translateY: floatY1 }] },
        ]}
      >
        <LinearGradient
          colors={['#FF6B35', '#FF8E53']}
          style={styles.blobGradient}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.floatingBlob,
          styles.blob2,
          { transform: [{ translateY: floatY2 }] },
        ]}
      >
        <LinearGradient
          colors={['#2EC4B6', '#00F5A0']}
          style={styles.blobGradient}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.floatingBlob,
          styles.blob3,
          { transform: [{ translateY: floatY3 }] },
        ]}
      >
        <LinearGradient
          colors={['#9B59B6', '#8E2DE2']}
          style={styles.blobGradient}
        />
      </Animated.View>

      {/* Floating small particles */}
      <View style={[styles.particle, styles.particle1]} />
      <View style={[styles.particle, styles.particle2]} />
      <View style={[styles.particle, styles.particle3]} />
      <View style={[styles.particle, styles.particle4]} />
      <View style={[styles.particle, styles.particle5]} />

      {/* Close button */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeIcon}>x</Text>
      </TouchableOpacity>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <Animated.View
            style={[
              styles.headerContainer,
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
            <View style={styles.iconOrb}>
              <LinearGradient
                colors={['#FF6B35', '#FF8E53', '#FFA726']}
                style={styles.orbGradient}
              >
                <Text style={styles.orbIcon}>+</Text>
              </LinearGradient>
            </View>
            <Text style={styles.title}>Add Recipe</Text>
            <Text style={styles.subtitle}>
              Extract from Instagram or upload a photo
            </Text>
          </Animated.View>

          {/* Main floating island card */}
          <Animated.View
            style={[
              styles.islandCard,
              { transform: [{ translateY: islandY }] },
            ]}
          >
            {/* Island inner glow */}
            <View style={styles.islandGlow} />

            {/* Method selector */}
            <View style={styles.methodSelector}>
              <TouchableOpacity
                style={[
                  styles.methodButton,
                  inputMethod === 'url' && styles.methodButtonActive,
                ]}
                onPress={() => setInputMethod('url')}
              >
                <Text style={[
                  styles.methodIcon,
                  inputMethod === 'url' && styles.methodIconActive,
                ]}>
                  @
                </Text>
                <Text style={[
                  styles.methodLabel,
                  inputMethod === 'url' && styles.methodLabelActive,
                ]}>
                  Instagram URL
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.methodButton,
                  inputMethod === 'photo' && styles.methodButtonActive,
                ]}
                onPress={() => setInputMethod('photo')}
              >
                <Text style={[
                  styles.methodIcon,
                  inputMethod === 'photo' && styles.methodIconActive,
                ]}>
                  []
                </Text>
                <Text style={[
                  styles.methodLabel,
                  inputMethod === 'photo' && styles.methodLabelActive,
                ]}>
                  Photo/Video
                </Text>
              </TouchableOpacity>
            </View>

            {/* Input area */}
            {inputMethod === 'url' ? (
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>#</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Paste Instagram URL here..."
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    value={inputUrl}
                    onChangeText={setInputUrl}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="url"
                  />
                </View>
                <Text style={styles.inputHint}>
                  Supports reels, posts, and stories
                </Text>
              </View>
            ) : (
              <TouchableOpacity style={styles.uploadArea}>
                <View style={styles.uploadIconContainer}>
                  <Text style={styles.uploadIcon}>^</Text>
                </View>
                <Text style={styles.uploadTitle}>
                  Tap to upload
                </Text>
                <Text style={styles.uploadSubtitle}>
                  JPG, PNG, or video files
                </Text>
              </TouchableOpacity>
            )}

            {/* Extract button */}
            <TouchableOpacity
              style={[
                styles.extractButton,
                !inputUrl.trim() && inputMethod === 'url' && styles.extractButtonDisabled,
              ]}
              onPress={handleExtract}
              disabled={!inputUrl.trim() && inputMethod === 'url'}
            >
              <LinearGradient
                colors={isExtracting
                  ? ['#2EC4B6', '#00F5A0']
                  : ['#FF6B35', '#FF8E53']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.extractButtonGradient}
              >
                {isExtracting ? (
                  <View style={styles.extractingContainer}>
                    <Text style={styles.extractingText}>AI is analyzing...</Text>
                    <View style={styles.progressBar}>
                      <Animated.View
                        style={[
                          styles.progressFill,
                          { width: progressWidth },
                        ]}
                      />
                    </View>
                  </View>
                ) : (
                  <>
                    <Text style={styles.extractIcon}>{'*'}</Text>
                    <Text style={styles.extractText}>Extract Recipe</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Features list */}
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <View style={[styles.featureDot, { backgroundColor: '#FF6B35' }]} />
                <Text style={styles.featureText}>AI watches the video</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={[styles.featureDot, { backgroundColor: '#2EC4B6' }]} />
                <Text style={styles.featureText}>Reads captions & comments</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={[styles.featureDot, { backgroundColor: '#9B59B6' }]} />
                <Text style={styles.featureText}>Generates complete recipe</Text>
              </View>
            </View>
          </Animated.View>

          {/* Recent extractions */}
          <View style={styles.recentSection}>
            <Text style={styles.recentTitle}>Recent</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recentList}
            >
              {[1, 2, 3, 4].map((item) => (
                <TouchableOpacity key={item} style={styles.recentCard}>
                  <View style={styles.recentImage}>
                    <LinearGradient
                      colors={['#FF6B35', '#FF8E53']}
                      style={styles.recentImageGradient}
                    >
                      <Text style={styles.recentEmoji}>~</Text>
                    </LinearGradient>
                  </View>
                  <Text style={styles.recentName} numberOfLines={1}>
                    Recipe {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom decoration */}
      <View style={styles.bottomWave}>
        <View style={styles.wave1} />
        <View style={styles.wave2} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  decorativeRing: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.1)',
    borderStyle: 'dashed',
  },
  floatingBlob: {
    position: 'absolute',
    borderRadius: 100,
    overflow: 'hidden',
  },
  blob1: {
    top: 80,
    left: -40,
    width: 120,
    height: 120,
    opacity: 0.3,
  },
  blob2: {
    top: 200,
    right: -30,
    width: 80,
    height: 80,
    opacity: 0.25,
  },
  blob3: {
    bottom: 200,
    left: 30,
    width: 60,
    height: 60,
    opacity: 0.2,
  },
  blobGradient: {
    flex: 1,
    borderRadius: 100,
  },
  particle: {
    position: 'absolute',
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  particle1: {
    top: 150,
    left: 50,
    width: 4,
    height: 4,
  },
  particle2: {
    top: 250,
    right: 80,
    width: 6,
    height: 6,
    backgroundColor: 'rgba(255, 107, 53, 0.5)',
  },
  particle3: {
    top: 350,
    left: 100,
    width: 3,
    height: 3,
  },
  particle4: {
    bottom: 300,
    right: 50,
    width: 5,
    height: 5,
    backgroundColor: 'rgba(46, 196, 182, 0.5)',
  },
  particle5: {
    bottom: 250,
    left: 80,
    width: 4,
    height: 4,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  closeIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '300',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 100,
    paddingBottom: 100,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconOrb: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 20,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  orbGradient: {
    flex: 1,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbIcon: {
    fontSize: 36,
    color: '#FFFFFF',
    fontWeight: '300',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  islandCard: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    // Floating shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
  },
  islandGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 107, 53, 0.03)',
  },
  methodSelector: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 16,
    padding: 4,
  },
  methodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  methodButtonActive: {
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
  },
  methodIcon: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.5)',
    marginRight: 8,
  },
  methodIconActive: {
    color: '#FF6B35',
  },
  methodLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  methodLabelActive: {
    color: '#FFFFFF',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputIcon: {
    fontSize: 18,
    color: '#FF6B35',
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    paddingVertical: 18,
    fontSize: 15,
    color: '#FFFFFF',
  },
  inputHint: {
    marginTop: 8,
    marginLeft: 16,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  uploadArea: {
    alignItems: 'center',
    paddingVertical: 40,
    marginBottom: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderStyle: 'dashed',
  },
  uploadIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  uploadIcon: {
    fontSize: 28,
    color: '#FF6B35',
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  extractButton: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
  },
  extractButtonDisabled: {
    opacity: 0.5,
  },
  extractButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  extractIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    marginRight: 10,
  },
  extractText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  extractingContainer: {
    alignItems: 'center',
    width: '80%',
  },
  extractingText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  featuresList: {
    paddingTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  recentSection: {
    marginTop: 32,
    paddingLeft: 20,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  recentList: {
    paddingRight: 20,
  },
  recentCard: {
    width: 100,
    marginRight: 12,
  },
  recentImage: {
    width: 100,
    height: 100,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
  },
  recentImageGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentEmoji: {
    fontSize: 32,
    color: '#FFFFFF',
  },
  recentName: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
    textAlign: 'center',
  },
  bottomWave: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    overflow: 'hidden',
  },
  wave1: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    right: -30,
    height: 60,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
  },
  wave2: {
    position: 'absolute',
    bottom: -40,
    left: -20,
    right: -20,
    height: 50,
    backgroundColor: 'rgba(255, 107, 53, 0.05)',
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
  },
});

export default FloatingIslandAddRecipeScreen;
