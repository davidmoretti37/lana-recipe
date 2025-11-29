-- Lana Recipe Database Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/qiriahhboopudpasbvym/sql

-- Users table
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- Cookbooks table
CREATE TABLE IF NOT EXISTS "Cookbook" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "coverImageUrl" TEXT,
    "color" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Cookbook_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Cookbook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "Cookbook_userId_idx" ON "Cookbook"("userId");

-- Recipes table
CREATE TABLE IF NOT EXISTS "Recipe" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "sourceUrl" TEXT,
    "sourcePlatform" TEXT,
    "prepTime" INTEGER,
    "cookTime" INTEGER,
    "servings" INTEGER,
    "difficulty" TEXT,
    "cuisine" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "rawContent" TEXT,
    "aiConfidence" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "cookbookId" TEXT,
    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Recipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Recipe_cookbookId_fkey" FOREIGN KEY ("cookbookId") REFERENCES "Cookbook"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "Recipe_userId_idx" ON "Recipe"("userId");
CREATE INDEX IF NOT EXISTS "Recipe_cookbookId_idx" ON "Recipe"("cookbookId");

-- Ingredients table
CREATE TABLE IF NOT EXISTS "Ingredient" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "quantity" TEXT,
    "unit" TEXT,
    "notes" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "recipeId" TEXT NOT NULL,
    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Ingredient_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "Ingredient_recipeId_idx" ON "Ingredient"("recipeId");

-- Instructions table
CREATE TABLE IF NOT EXISTS "Instruction" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "stepNumber" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "duration" INTEGER,
    "imageUrl" TEXT,
    "recipeId" TEXT NOT NULL,
    CONSTRAINT "Instruction_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Instruction_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "Instruction_recipeId_idx" ON "Instruction"("recipeId");

-- MealPlan table
CREATE TABLE IF NOT EXISTS "MealPlan" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "weekStart" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "MealPlan_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "MealPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "MealPlan_userId_weekStart_key" ON "MealPlan"("userId", "weekStart");
CREATE INDEX IF NOT EXISTS "MealPlan_userId_idx" ON "MealPlan"("userId");

-- MealPlanItem table
CREATE TABLE IF NOT EXISTS "MealPlanItem" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "date" TIMESTAMP(3) NOT NULL,
    "mealType" TEXT NOT NULL,
    "mealPlanId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    CONSTRAINT "MealPlanItem_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "MealPlanItem_mealPlanId_fkey" FOREIGN KEY ("mealPlanId") REFERENCES "MealPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MealPlanItem_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "MealPlanItem_mealPlanId_idx" ON "MealPlanItem"("mealPlanId");
CREATE INDEX IF NOT EXISTS "MealPlanItem_recipeId_idx" ON "MealPlanItem"("recipeId");

-- GroceryItem table
CREATE TABLE IF NOT EXISTS "GroceryItem" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "quantity" TEXT,
    "unit" TEXT,
    "category" TEXT,
    "isChecked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "GroceryItem_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "GroceryItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "GroceryItem_userId_idx" ON "GroceryItem"("userId");

-- Success message
SELECT 'All tables created successfully!' as status;
