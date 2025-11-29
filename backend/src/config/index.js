module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4o', // Using GPT-4 Vision for video/image analysis
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },
};
