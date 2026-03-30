/**
 * Backend Integration Tests
 * Тести інтеграції між модулями бекенду
 * В реальному проєкті — Spring Boot @SpringBootTest + TestContainers
 */

/* ═══════ SIMULATED SERVICES ═══════ */

// Simulated Database (PostgreSQL)
class UserRepository {
  private users = new Map<string, any>();
  private nextId = 1;

  save(user: { name: string; email: string; passwordHash: string; preferences: any }) {
    const id = String(this.nextId++);
    const record = { id, ...user, createdAt: new Date().toISOString() };
    this.users.set(id, record);
    return record;
  }

  findByEmail(email: string) {
    return Array.from(this.users.values()).find(u => u.email === email) || null;
  }

  findById(id: string) {
    return this.users.get(id) || null;
  }

  count() {
    return this.users.size;
  }
}

class RecipeRepository {
  private recipes = new Map<string, any>();
  private nextId = 1;

  save(recipe: any) {
    const id = String(this.nextId++);
    const record = { id, ...recipe, createdAt: new Date().toISOString() };
    this.recipes.set(id, record);
    return record;
  }

  findById(id: string) {
    return this.recipes.get(id) || null;
  }

  findByUserId(userId: string) {
    return Array.from(this.recipes.values()).filter(r => r.userId === userId);
  }

  count() {
    return this.recipes.size;
  }
}

// Simulated Cache (Redis)
class CacheService {
  private cache = new Map<string, { value: any; expiresAt: number }>();

  set(key: string, value: any, ttlSeconds: number) {
    this.cache.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
  }

  get(key: string) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.value;
  }

  invalidate(key: string) {
    this.cache.delete(key);
  }

  size() {
    return this.cache.size;
  }
}

// Simulated Auth Service (JWT)
class AuthService {
  private userRepo: UserRepository;

  constructor(userRepo: UserRepository) {
    this.userRepo = userRepo;
  }

  register(name: string, email: string, password: string) {
    if (this.userRepo.findByEmail(email)) {
      throw new Error('Email already exists');
    }
    const passwordHash = `hashed_${password}`;
    const user = this.userRepo.save({ name, email, passwordHash, preferences: {} });
    return { userId: user.id, token: `jwt_${user.id}_${Date.now()}` };
  }

  login(email: string, password: string) {
    const user = this.userRepo.findByEmail(email);
    if (!user || user.passwordHash !== `hashed_${password}`) {
      throw new Error('Invalid credentials');
    }
    return { userId: user.id, token: `jwt_${user.id}_${Date.now()}` };
  }

  validateToken(token: string): string | null {
    if (!token || !token.startsWith('jwt_')) return null;
    const parts = token.split('_');
    return parts[1] || null;
  }
}

// Simulated Recipe Service
class RecipeService {
  private recipeRepo: RecipeRepository;
  private cache: CacheService;

  constructor(recipeRepo: RecipeRepository, cache: CacheService) {
    this.recipeRepo = recipeRepo;
    this.cache = cache;
  }

  generate(userId: string, ingredients: string[], mealType: string, time: number, servings: number) {
    if (ingredients.length === 0) throw new Error('No ingredients');
    const recipe = this.recipeRepo.save({
      userId,
      title: `AI Recipe from ${ingredients.join(', ')}`,
      ingredients,
      mealType,
      time,
      servings,
      steps: ['Step 1', 'Step 2', 'Step 3'],
      nutrition: { calories: 320, protein: '22g', fat: '24g', carbs: '6g' },
    });
    // Cache the recipe
    this.cache.set(`recipe_${recipe.id}`, recipe, 3600);
    return recipe;
  }

  getById(id: string) {
    // Try cache first
    const cached = this.cache.get(`recipe_${id}`);
    if (cached) return { ...cached, fromCache: true };
    // Fallback to DB
    const recipe = this.recipeRepo.findById(id);
    if (recipe) {
      this.cache.set(`recipe_${id}`, recipe, 3600);
    }
    return recipe ? { ...recipe, fromCache: false } : null;
  }

  getByUserId(userId: string) {
    return this.recipeRepo.findByUserId(userId);
  }
}

/* ═══════ INTEGRATION TESTS ═══════ */

describe('Integration: Auth + User Repository', () => {
  let userRepo: UserRepository;
  let authService: AuthService;

  beforeEach(() => {
    userRepo = new UserRepository();
    authService = new AuthService(userRepo);
  });

  // BI-AUTH-001
  test('register creates user in repository', () => {
    const result = authService.register('Олексій', 'oleksiy@example.com', 'pass123');
    expect(result.userId).toBeDefined();
    expect(result.token).toBeDefined();
    expect(userRepo.count()).toBe(1);
  });

  // BI-AUTH-002
  test('register then login with same credentials', () => {
    authService.register('Олексій', 'oleksiy@example.com', 'pass123');
    const loginResult = authService.login('oleksiy@example.com', 'pass123');
    expect(loginResult.token).toBeDefined();
  });

  // BI-AUTH-003
  test('register duplicate email throws error', () => {
    authService.register('Олексій', 'oleksiy@example.com', 'pass123');
    expect(() => {
      authService.register('Інший', 'oleksiy@example.com', 'pass456');
    }).toThrow('Email already exists');
  });

  // BI-AUTH-004
  test('login with wrong password throws error', () => {
    authService.register('Олексій', 'oleksiy@example.com', 'pass123');
    expect(() => {
      authService.login('oleksiy@example.com', 'wrongpass');
    }).toThrow('Invalid credentials');
  });

  // BI-AUTH-005
  test('token contains user id', () => {
    const result = authService.register('Олексій', 'oleksiy@example.com', 'pass123');
    const userId = authService.validateToken(result.token);
    expect(userId).toBe(result.userId);
  });

  // BI-AUTH-006
  test('invalid token returns null', () => {
    expect(authService.validateToken('invalid_token')).toBeNull();
    expect(authService.validateToken('')).toBeNull();
  });
});

describe('Integration: Recipe Service + Repository + Cache', () => {
  let recipeRepo: RecipeRepository;
  let cache: CacheService;
  let recipeService: RecipeService;

  beforeEach(() => {
    recipeRepo = new RecipeRepository();
    cache = new CacheService();
    recipeService = new RecipeService(recipeRepo, cache);
  });

  // BI-REC-001
  test('generate saves recipe to DB and cache', () => {
    const recipe = recipeService.generate('user1', ['Яйця', 'Шпинат'], 'breakfast', 15, 2);
    expect(recipe.id).toBeDefined();
    expect(recipeRepo.count()).toBe(1);
    expect(cache.size()).toBe(1);
  });

  // BI-REC-002
  test('getById returns from cache on second call', () => {
    const recipe = recipeService.generate('user1', ['Яйця'], 'breakfast', 15, 2);
    const fetched = recipeService.getById(recipe.id);
    expect(fetched).toBeDefined();
    expect(fetched!.fromCache).toBe(true);
  });

  // BI-REC-003
  test('getById falls back to DB if cache miss', () => {
    const recipe = recipeService.generate('user1', ['Яйця'], 'breakfast', 15, 2);
    cache.invalidate(`recipe_${recipe.id}`);
    const fetched = recipeService.getById(recipe.id);
    expect(fetched).toBeDefined();
    expect(fetched!.fromCache).toBe(false);
  });

  // BI-REC-004
  test('getByUserId returns only user recipes', () => {
    recipeService.generate('user1', ['Яйця'], 'breakfast', 15, 2);
    recipeService.generate('user1', ['Сир'], 'lunch', 30, 4);
    recipeService.generate('user2', ['Молоко'], 'dessert', 20, 1);
    const user1Recipes = recipeService.getByUserId('user1');
    expect(user1Recipes.length).toBe(2);
  });

  // BI-REC-005
  test('generate with empty ingredients throws error', () => {
    expect(() => {
      recipeService.generate('user1', [], 'breakfast', 15, 2);
    }).toThrow('No ingredients');
  });

  // BI-REC-006
  test('getById for non-existent recipe returns null', () => {
    const result = recipeService.getById('non-existent');
    expect(result).toBeNull();
  });
});

describe('Integration: Full User Journey', () => {
  let userRepo: UserRepository;
  let authService: AuthService;
  let recipeRepo: RecipeRepository;
  let cache: CacheService;
  let recipeService: RecipeService;

  beforeEach(() => {
    userRepo = new UserRepository();
    authService = new AuthService(userRepo);
    recipeRepo = new RecipeRepository();
    cache = new CacheService();
    recipeService = new RecipeService(recipeRepo, cache);
  });

  // BI-FLOW-001
  test('register → generate recipe → retrieve recipe', () => {
    // Step 1: Register
    const authResult = authService.register('Марія', 'maria@test.com', 'secure123');
    expect(authResult.userId).toBeDefined();

    // Step 2: Generate recipe
    const recipe = recipeService.generate(
      authResult.userId,
      ['Яйця', 'Шпинат', 'Сир фета'],
      'breakfast',
      15,
      2
    );
    expect(recipe.title).toContain('Яйця');

    // Step 3: Retrieve recipe
    const fetched = recipeService.getById(recipe.id);
    expect(fetched).toBeDefined();
    expect(fetched!.title).toBe(recipe.title);
  });

  // BI-FLOW-002
  test('register → generate multiple → list user recipes', () => {
    const authResult = authService.register('Петро', 'petro@test.com', 'secure456');

    recipeService.generate(authResult.userId, ['Яйця'], 'breakfast', 10, 1);
    recipeService.generate(authResult.userId, ['Молоко', 'Борошно'], 'dessert', 30, 4);
    recipeService.generate(authResult.userId, ['Курка', 'Рис'], 'dinner', 45, 2);

    const userRecipes = recipeService.getByUserId(authResult.userId);
    expect(userRecipes.length).toBe(3);
  });

  // BI-FLOW-003
  test('login → access existing recipes', () => {
    // Register and generate
    const reg = authService.register('Олена', 'olena@test.com', 'pass789');
    recipeService.generate(reg.userId, ['Помідори', 'Огірки'], 'lunch', 20, 2);

    // Login
    const loginResult = authService.login('olena@test.com', 'pass789');
    const userId = authService.validateToken(loginResult.token);

    // Access recipes
    const recipes = recipeService.getByUserId(userId!);
    expect(recipes.length).toBe(1);
  });

  // BI-FLOW-004
  test('cache invalidation forces DB read', () => {
    const reg = authService.register('Тест', 'test@test.com', 'test1234');
    const recipe = recipeService.generate(reg.userId, ['Яйця'], 'breakfast', 10, 1);

    // First read — from cache
    const cached = recipeService.getById(recipe.id);
    expect(cached!.fromCache).toBe(true);

    // Invalidate cache
    cache.invalidate(`recipe_${recipe.id}`);

    // Second read — from DB
    const fromDb = recipeService.getById(recipe.id);
    expect(fromDb!.fromCache).toBe(false);

    // Third read — cached again
    const cachedAgain = recipeService.getById(recipe.id);
    expect(cachedAgain!.fromCache).toBe(true);
  });
});

