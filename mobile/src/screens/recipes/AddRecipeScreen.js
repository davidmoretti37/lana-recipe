import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, typography, borderRadius, shadows } from '../../utils/theme';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { extractRecipe } from '../../store/slices/recipesSlice';
import { fetchCookbooks } from '../../store/slices/cookbooksSlice';

export default function AddRecipeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { isExtracting, error } = useSelector((state) => state.recipes);
  const { items: cookbooks } = useSelector((state) => state.cookbooks);

  const [mode, setMode] = useState('url'); // 'url' or 'image'
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [images, setImages] = useState([]);
  const [selectedCookbook, setSelectedCookbook] = useState(null);

  React.useEffect(() => {
    dispatch(fetchCookbooks());
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to select images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets.map((a) => a.uri)]);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleExtract = async () => {
    if (mode === 'url' && !url) {
      Alert.alert('Error', 'Please enter an Instagram URL');
      return;
    }

    if (mode === 'image' && images.length === 0 && !caption) {
      Alert.alert('Error', 'Please add an image or description');
      return;
    }

    const data = {
      sourceUrl: mode === 'url' ? url : undefined,
      imageUrls: images.length > 0 ? images : undefined,
      caption: caption || undefined,
      cookbookId: selectedCookbook?.id,
    };

    const action = await dispatch(extractRecipe(data));

    if (!action.error) {
      Alert.alert('Success', 'Recipe extracted and saved!', [
        {
          text: 'View Recipe',
          onPress: () => {
            navigation.navigate('Cookbooks', {
              screen: 'RecipeDetail',
              params: { id: action.payload.recipe.id },
            });
          },
        },
        { text: 'Add Another', onPress: () => resetForm() },
      ]);
    }
  };

  const resetForm = () => {
    setUrl('');
    setCaption('');
    setImages([]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Add Recipe</Text>
        <Text style={styles.subtitle}>
          Share from Instagram or add manually
        </Text>

        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'url' && styles.modeButtonActive]}
            onPress={() => setMode('url')}
          >
            <Text style={[styles.modeButtonText, mode === 'url' && styles.modeButtonTextActive]}>
              From URL
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'image' && styles.modeButtonActive]}
            onPress={() => setMode('image')}
          >
            <Text style={[styles.modeButtonText, mode === 'image' && styles.modeButtonTextActive]}>
              From Image
            </Text>
          </TouchableOpacity>
        </View>

        {mode === 'url' ? (
          <View style={styles.section}>
            <Input
              label="Instagram URL"
              value={url}
              onChangeText={setUrl}
              placeholder="https://www.instagram.com/p/..."
              autoCapitalize="none"
              keyboardType="url"
            />
            <Text style={styles.hint}>
              Paste the URL of an Instagram post, reel, or video
            </Text>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.label}>Images</Text>
            <View style={styles.imageGrid}>
              {images.map((uri, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri }} style={styles.image} />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeImage(index)}
                  >
                    <Text style={styles.removeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                <Text style={styles.addImageIcon}>+</Text>
                <Text style={styles.addImageText}>Add Image</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Input
            label="Caption / Description (Optional)"
            value={caption}
            onChangeText={setCaption}
            placeholder="Paste the caption or describe the recipe..."
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Save to Cookbook</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.cookbookOption,
                !selectedCookbook && styles.cookbookOptionActive,
              ]}
              onPress={() => setSelectedCookbook(null)}
            >
              <Text style={[
                styles.cookbookOptionText,
                !selectedCookbook && styles.cookbookOptionTextActive,
              ]}>
                Default
              </Text>
            </TouchableOpacity>
            {cookbooks.map((cb) => (
              <TouchableOpacity
                key={cb.id}
                style={[
                  styles.cookbookOption,
                  selectedCookbook?.id === cb.id && styles.cookbookOptionActive,
                ]}
                onPress={() => setSelectedCookbook(cb)}
              >
                <Text style={[
                  styles.cookbookOptionText,
                  selectedCookbook?.id === cb.id && styles.cookbookOptionTextActive,
                ]}>
                  {cb.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Button
          title={isExtracting ? 'Extracting Recipe...' : 'Extract Recipe with AI'}
          onPress={handleExtract}
          loading={isExtracting}
          disabled={isExtracting}
          style={styles.extractButton}
        />

        {isExtracting && (
          <View style={styles.extractingInfo}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.extractingText}>
              AI is analyzing the content and generating your recipe...
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
    marginBottom: spacing.xl,
  },
  modeButton: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  modeButtonActive: {
    backgroundColor: colors.white,
    ...shadows.sm,
  },
  modeButtonText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  modeButtonTextActive: {
    color: colors.text,
    fontWeight: '600',
  },
  section: {
    marginBottom: spacing.xl,
  },
  label: {
    ...typography.bodySmall,
    fontWeight: '500',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  hint: {
    ...typography.caption,
    color: colors.textLight,
    marginTop: spacing.xs,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageContainer: {
    position: 'relative',
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.lg,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageIcon: {
    fontSize: 24,
    color: colors.textSecondary,
  },
  addImageText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  cookbookOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    backgroundColor: colors.backgroundSecondary,
    marginRight: spacing.sm,
  },
  cookbookOptionActive: {
    backgroundColor: colors.primary,
  },
  cookbookOptionText: {
    ...typography.bodySmall,
    color: colors.text,
  },
  cookbookOptionTextActive: {
    color: colors.white,
    fontWeight: '500',
  },
  errorBanner: {
    backgroundColor: colors.error + '15',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.error,
  },
  extractButton: {
    marginBottom: spacing.md,
  },
  extractingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  extractingText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
});
