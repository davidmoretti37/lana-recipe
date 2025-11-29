import { useEffect, useState } from 'react';
import { Linking, Platform } from 'react-native';
import { processSharedContent } from '../services/shareHandler';

/**
 * Hook to handle shared content from Instagram and other apps
 * This is the core integration point for the "share to app" feature
 */
export function useShareIntent() {
  const [sharedContent, setSharedContent] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Handle initial URL (app opened via share)
    const handleInitialUrl = async () => {
      try {
        const url = await Linking.getInitialURL();
        if (url) {
          await processUrl(url);
        }
      } catch (error) {
        console.error('Error handling initial URL:', error);
      }
    };

    // Handle URL events (app already open)
    const handleUrlEvent = async ({ url }) => {
      if (url) {
        await processUrl(url);
      }
    };

    const processUrl = async (url) => {
      setIsProcessing(true);
      try {
        // Parse the URL for shared data
        if (url.startsWith('lanarecipe://add-shared')) {
          // Content was shared via share extension
          // Retrieve from shared storage (implemented natively)
          const sharedData = await getSharedData();
          if (sharedData) {
            const processed = await processSharedContent(sharedData);
            setSharedContent(processed);
          }
        } else if (url.includes('instagram.com') || url.includes('tiktok.com')) {
          // Direct URL shared
          const processed = await processSharedContent({ text: url });
          setSharedContent(processed);
        }
      } finally {
        setIsProcessing(false);
      }
    };

    handleInitialUrl();
    const subscription = Linking.addEventListener('url', handleUrlEvent);

    return () => subscription.remove();
  }, []);

  const clearSharedContent = () => {
    setSharedContent(null);
  };

  return {
    sharedContent,
    isProcessing,
    clearSharedContent,
  };
}

/**
 * Get shared data from native storage (iOS App Groups / Android SharedPreferences)
 * This would be implemented with native modules in production
 */
async function getSharedData() {
  if (Platform.OS === 'ios') {
    // In production, use react-native-shared-group-preferences
    // or similar to read from App Groups
    return null;
  } else {
    // In production, use native modules to read from Intent extras
    return null;
  }
}

export default useShareIntent;
