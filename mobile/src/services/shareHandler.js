import { Linking, Platform } from 'react-native';

/**
 * Handle shared content from Instagram and other apps
 * This is the core feature for receiving recipes shared from social media
 */

// Parse Instagram URL to extract post ID
export function parseInstagramUrl(url) {
  const patterns = [
    /instagram\.com\/p\/([a-zA-Z0-9_-]+)/,
    /instagram\.com\/reel\/([a-zA-Z0-9_-]+)/,
    /instagram\.com\/tv\/([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return {
        postId: match[1],
        type: url.includes('/reel/') ? 'reel' : url.includes('/tv/') ? 'igtv' : 'post',
        url,
      };
    }
  }

  return null;
}

// Parse TikTok URL
export function parseTikTokUrl(url) {
  const pattern = /tiktok\.com\/@[\w.-]+\/video\/(\d+)/;
  const match = url.match(pattern);

  if (match) {
    return {
      videoId: match[1],
      type: 'video',
      url,
    };
  }

  return null;
}

// Detect platform from URL
export function detectPlatform(url) {
  if (!url) return null;

  if (url.includes('instagram.com')) return 'instagram';
  if (url.includes('tiktok.com')) return 'tiktok';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('pinterest.com')) return 'pinterest';
  if (url.includes('facebook.com')) return 'facebook';

  return 'web';
}

// Extract URLs from shared text
export function extractUrls(text) {
  const urlPattern = /https?:\/\/[^\s]+/g;
  return text.match(urlPattern) || [];
}

// Process shared content
export async function processSharedContent(sharedData) {
  const result = {
    urls: [],
    images: [],
    text: '',
    platform: null,
    platformData: null,
  };

  // Handle text content
  if (sharedData.text) {
    result.text = sharedData.text;
    result.urls = extractUrls(sharedData.text);

    // Try to identify platform
    for (const url of result.urls) {
      result.platform = detectPlatform(url);

      if (result.platform === 'instagram') {
        result.platformData = parseInstagramUrl(url);
        break;
      } else if (result.platform === 'tiktok') {
        result.platformData = parseTikTokUrl(url);
        break;
      }
    }
  }

  // Handle images
  if (sharedData.images) {
    result.images = sharedData.images;
  }

  return result;
}

// Register for deep links
export function setupDeepLinking(navigation) {
  const handleUrl = async ({ url }) => {
    if (!url) return;

    // Handle lanarecipe:// scheme
    if (url.startsWith('lanarecipe://')) {
      const path = url.replace('lanarecipe://', '');

      if (path.startsWith('recipe/')) {
        const recipeId = path.replace('recipe/', '');
        navigation.navigate('RecipeDetail', { id: recipeId });
      } else if (path === 'add') {
        navigation.navigate('AddRecipe');
      }
    }
  };

  // Handle initial URL
  Linking.getInitialURL().then((url) => {
    if (url) handleUrl({ url });
  });

  // Listen for new URLs
  const subscription = Linking.addEventListener('url', handleUrl);

  return () => subscription.remove();
}

export default {
  parseInstagramUrl,
  parseTikTokUrl,
  detectPlatform,
  extractUrls,
  processSharedContent,
  setupDeepLinking,
};
