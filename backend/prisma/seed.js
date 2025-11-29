const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo1234', 12);

  const user = await prisma.user.upsert({
    where: { email: 'demo@lanarecipe.com' },
    update: {},
    create: {
      email: 'demo@lanarecipe.com',
      password: hashedPassword,
      name: 'Lana',
    },
  });

  console.log('Created user:', user.email);

  // Create default cookbook
  const cookbook = await prisma.cookbook.upsert({
    where: {
      id: 'default-cookbook',
    },
    update: {},
    create: {
      id: 'default-cookbook',
      name: 'My Recipes',
      description: 'Your personal recipe collection',
      isDefault: true,
      userId: user.id,
    },
  });

  console.log('Created cookbook:', cookbook.name);

  // Create sample recipe
  const recipe = await prisma.recipe.create({
    data: {
      title: 'Classic Pasta Carbonara',
      description: 'A rich and creamy Italian pasta dish with eggs, cheese, and pancetta.',
      imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800',
      prepTime: 10,
      cookTime: 20,
      servings: 4,
      difficulty: 'medium',
      cuisine: 'Italian',
      tags: ['pasta', 'italian', 'dinner', 'quick'],
      userId: user.id,
      cookbookId: cookbook.id,
      ingredients: {
        create: [
          { name: 'spaghetti', quantity: '400', unit: 'g', order: 0 },
          { name: 'guanciale or pancetta', quantity: '200', unit: 'g', order: 1 },
          { name: 'egg yolks', quantity: '4', order: 2 },
          { name: 'whole egg', quantity: '1', order: 3 },
          { name: 'Pecorino Romano cheese', quantity: '100', unit: 'g', order: 4 },
          { name: 'black pepper', quantity: '2', unit: 'tsp', order: 5 },
          { name: 'salt', notes: 'for pasta water', order: 6 },
        ],
      },
      instructions: {
        create: [
          { stepNumber: 1, text: 'Bring a large pot of salted water to boil and cook spaghetti according to package directions.' },
          { stepNumber: 2, text: 'While pasta cooks, cut guanciale into small cubes and cook in a large pan over medium heat until crispy.' },
          { stepNumber: 3, text: 'In a bowl, whisk together egg yolks, whole egg, grated Pecorino, and generous amount of black pepper.' },
          { stepNumber: 4, text: 'When pasta is al dente, reserve 1 cup pasta water, then drain.' },
          { stepNumber: 5, text: 'Remove pan from heat, add hot pasta to the guanciale.' },
          { stepNumber: 6, text: 'Quickly pour egg mixture over pasta, tossing constantly. Add pasta water as needed for creamy consistency.' },
          { stepNumber: 7, text: 'Serve immediately with extra Pecorino and black pepper.' },
        ],
      },
    },
  });

  console.log('Created recipe:', recipe.title);

  // Create another sample recipe
  const recipe2 = await prisma.recipe.create({
    data: {
      title: 'Avocado Toast with Poached Egg',
      description: 'A simple and healthy breakfast that\'s ready in minutes.',
      imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800',
      prepTime: 5,
      cookTime: 10,
      servings: 2,
      difficulty: 'easy',
      cuisine: 'American',
      tags: ['breakfast', 'healthy', 'quick', 'vegetarian'],
      userId: user.id,
      cookbookId: cookbook.id,
      ingredients: {
        create: [
          { name: 'ripe avocados', quantity: '2', order: 0 },
          { name: 'eggs', quantity: '2', order: 1 },
          { name: 'sourdough bread', quantity: '2', unit: 'slices', order: 2 },
          { name: 'lemon juice', quantity: '1', unit: 'tbsp', order: 3 },
          { name: 'red pepper flakes', order: 4 },
          { name: 'salt and pepper', notes: 'to taste', order: 5 },
        ],
      },
      instructions: {
        create: [
          { stepNumber: 1, text: 'Toast the bread until golden brown.' },
          { stepNumber: 2, text: 'Mash avocados in a bowl with lemon juice, salt, and pepper.' },
          { stepNumber: 3, text: 'Bring a pot of water to simmer. Create a gentle whirlpool and crack in eggs for poaching. Cook 3-4 minutes.' },
          { stepNumber: 4, text: 'Spread mashed avocado on toasted bread.' },
          { stepNumber: 5, text: 'Top each toast with a poached egg, red pepper flakes, and extra salt and pepper.' },
        ],
      },
    },
  });

  console.log('Created recipe:', recipe2.title);

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
