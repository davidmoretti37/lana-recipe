# Lana Recipe

An AI-powered recipe extraction app that automatically extracts recipes from Instagram videos and posts.

## Features

- **Instagram Integration**: Share recipes directly from Instagram to the app
- **AI-Powered Extraction**: Automatically analyzes videos and captions to generate structured recipes
- **Cookbook Organization**: Organize recipes into custom cookbooks with visual thumbnails
- **Meal Planning**: Weekly calendar view for planning meals
- **Grocery Lists**: Automatic grocery list generation from recipes
- **Search**: Quickly find recipes by title or ingredients

## Tech Stack

### Backend
- Node.js with Express.js
- PostgreSQL with Prisma ORM
- OpenAI GPT-4 Vision API for recipe extraction
- JWT authentication

### Mobile App
- React Native (iOS & Android)
- React Navigation
- Redux Toolkit for state management
- Share extension for Instagram integration

## Project Structure

```
lana-recipe/
├── backend/           # Node.js API server
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── controllers/  # Request handlers
│   │   ├── services/     # Business logic
│   │   ├── models/       # Database models
│   │   ├── middleware/   # Auth, validation, etc.
│   │   └── config/       # Configuration
│   └── prisma/           # Database schema
├── mobile/            # React Native app
│   ├── src/
│   │   ├── screens/      # App screens
│   │   ├── components/   # Reusable components
│   │   ├── navigation/   # Navigation setup
│   │   ├── services/     # API services
│   │   ├── store/        # Redux store
│   │   └── hooks/        # Custom hooks
│   ├── ios/              # iOS native code
│   └── android/          # Android native code
└── docs/              # Documentation
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- React Native development environment
- OpenAI API key

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env  # Configure environment variables
npm run db:migrate
npm run dev
```

### Mobile Setup

```bash
cd mobile
npm install
npx pod-install ios
npm run ios  # or npm run android
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/lana_recipe
JWT_SECRET=your-secret-key
OPENAI_API_KEY=your-openai-api-key
```

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/recipes/extract` - Extract recipe from URL/content
- `GET /api/recipes` - List user's recipes
- `GET /api/cookbooks` - List user's cookbooks
- `POST /api/meal-plans` - Create meal plan
- `GET /api/groceries` - Get grocery list

## License

MIT
