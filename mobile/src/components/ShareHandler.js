import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { Alert } from 'react-native';
import { useShareIntent } from '../hooks/useShareIntent';
import { extractRecipe } from '../store/slices/recipesSlice';

/**
 * Component that handles incoming shared content
 * Place this at the root of your app to handle shares
 */
export function ShareHandler({ children }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { sharedContent, isProcessing, clearSharedContent } = useShareIntent();

  useEffect(() => {
    if (sharedContent && !isProcessing) {
      handleSharedContent();
    }
  }, [sharedContent, isProcessing]);

  const handleSharedContent = async () => {
    // Show confirmation dialog
    Alert.alert(
      'Save Recipe',
      'Extract recipe from shared content?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: clearSharedContent,
        },
        {
          text: 'Extract',
          onPress: async () => {
            try {
              const data = {
                sourceUrl: sharedContent.urls?.[0],
                imageUrls: sharedContent.images,
                caption: sharedContent.text,
              };

              const action = await dispatch(extractRecipe(data));

              if (!action.error) {
                Alert.alert(
                  'Success!',
                  'Recipe has been extracted and saved.',
                  [
                    {
                      text: 'View Recipe',
                      onPress: () => {
                        navigation.navigate('Cookbooks', {
                          screen: 'RecipeDetail',
                          params: { id: action.payload.recipe.id },
                        });
                      },
                    },
                    { text: 'OK' },
                  ]
                );
              } else {
                Alert.alert('Error', 'Failed to extract recipe. Please try again.');
              }
            } finally {
              clearSharedContent();
            }
          },
        },
      ]
    );
  };

  return children;
}

export default ShareHandler;
