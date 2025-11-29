const OpenAI = require('openai');
const config = require('../config');

const openai = new OpenAI({
  apiKey: config.openai.apiKey,
});

/**
 * Extract recipe from Instagram/social media content
 * Uses GPT-4 Vision to analyze images/video frames and captions
 */
async function extractRecipeFromContent({ imageUrls, videoUrl, caption, sourceUrl }) {
  const systemPrompt = `You are an expert chef and recipe analyst. Your job is to analyze cooking content from social media (images, videos, captions) and extract a complete, structured recipe.

When analyzing content:
1. Identify all visible ingredients, even if not explicitly mentioned
2. Infer quantities based on visual cues when not stated
3. Determine cooking steps from the visual content and caption
4. Estimate prep time, cook time, and servings
5. Identify the cuisine type and difficulty level

Always provide a complete recipe even if information is partial - use your culinary expertise to fill in gaps.`;

  const userPrompt = buildUserPrompt({ imageUrls, videoUrl, caption });

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  try {
    const response = await openai.chat.completions.create({
      model: config.openai.model,
      messages,
      response_format: { type: 'json_object' },
      max_tokens: 4096,
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    const recipe = JSON.parse(content);

    // Validate and normalize the recipe structure
    return normalizeRecipe(recipe, { sourceUrl, caption });
  } catch (error) {
    console.error('AI extraction error:', error);
    throw new Error('Failed to extract recipe from content');
  }
}

function buildUserPrompt({ imageUrls, videoUrl, caption }) {
  const content = [];

  // Add instruction text
  content.push({
    type: 'text',
    text: `Analyze this cooking content and extract a complete recipe.

${caption ? `Caption: "${caption}"` : 'No caption provided.'}

${videoUrl ? `Video URL: ${videoUrl}` : ''}

Please provide the recipe in the following JSON format:
{
  "title": "Recipe name",
  "description": "Brief description of the dish",
  "ingredients": [
    { "name": "ingredient name", "quantity": "amount", "unit": "unit", "notes": "optional notes" }
  ],
  "instructions": [
    { "stepNumber": 1, "text": "Step description", "duration": optional_minutes }
  ],
  "prepTime": minutes_or_null,
  "cookTime": minutes_or_null,
  "servings": number_or_null,
  "difficulty": "easy|medium|hard",
  "cuisine": "cuisine type",
  "tags": ["tag1", "tag2"],
  "confidence": 0.0_to_1.0
}

Be thorough - extract every ingredient you can see and infer steps from the cooking process shown.`,
  });

  // Add images if provided
  if (imageUrls && imageUrls.length > 0) {
    for (const url of imageUrls) {
      content.push({
        type: 'image_url',
        image_url: { url, detail: 'high' },
      });
    }
  }

  return content;
}

function normalizeRecipe(recipe, { sourceUrl, caption }) {
  return {
    title: recipe.title || 'Untitled Recipe',
    description: recipe.description || null,
    ingredients: (recipe.ingredients || []).map((ing, index) => ({
      name: ing.name || 'Unknown ingredient',
      quantity: ing.quantity || null,
      unit: ing.unit || null,
      notes: ing.notes || null,
      order: index,
    })),
    instructions: (recipe.instructions || []).map((inst, index) => ({
      stepNumber: inst.stepNumber || index + 1,
      text: inst.text || '',
      duration: inst.duration || null,
    })),
    prepTime: recipe.prepTime || null,
    cookTime: recipe.cookTime || null,
    servings: recipe.servings || null,
    difficulty: recipe.difficulty || null,
    cuisine: recipe.cuisine || null,
    tags: recipe.tags || [],
    aiConfidence: recipe.confidence || 0.8,
    sourceUrl,
    rawContent: caption,
    sourcePlatform: detectPlatform(sourceUrl),
  };
}

function detectPlatform(url) {
  if (!url) return null;
  if (url.includes('instagram.com')) return 'instagram';
  if (url.includes('tiktok.com')) return 'tiktok';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('pinterest.com')) return 'pinterest';
  if (url.includes('facebook.com')) return 'facebook';
  return 'web';
}

/**
 * Extract recipe from a URL by fetching content
 */
async function extractRecipeFromUrl(url) {
  // For MVP, we'll accept the URL and any images/text the mobile app extracts
  // In production, you'd use web scraping or platform APIs to get content
  return {
    sourceUrl: url,
    sourcePlatform: detectPlatform(url),
  };
}

module.exports = {
  extractRecipeFromContent,
  extractRecipeFromUrl,
  detectPlatform,
};
