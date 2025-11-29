import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { colors, spacing, typography } from '../../utils/theme';
import { Button } from '../../components/Button';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.logo}>🍳</Text>
          <Text style={styles.title}>Lana Recipe</Text>
          <Text style={styles.subtitle}>
            AI-powered recipe extraction from Instagram
          </Text>
        </View>

        <View style={styles.features}>
          <FeatureItem
            icon="📸"
            title="Share from Instagram"
            description="Share any cooking video directly to the app"
          />
          <FeatureItem
            icon="🤖"
            title="AI Extracts Recipes"
            description="Our AI analyzes videos and creates complete recipes"
          />
          <FeatureItem
            icon="📖"
            title="Your Personal Cookbook"
            description="Organize, plan meals, and generate shopping lists"
          />
        </View>

        <View style={styles.buttons}>
          <Button
            title="Get Started"
            onPress={() => navigation.navigate('Register')}
            style={styles.button}
          />
          <Button
            title="I already have an account"
            onPress={() => navigation.navigate('Login')}
            variant="ghost"
            style={styles.button}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function FeatureItem({ icon, title, description }) {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  hero: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
  },
  logo: {
    fontSize: 80,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  features: {
    paddingVertical: spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  featureIcon: {
    fontSize: 40,
    marginRight: spacing.md,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  featureDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  buttons: {
    paddingBottom: spacing.lg,
  },
  button: {
    marginBottom: spacing.md,
  },
});
