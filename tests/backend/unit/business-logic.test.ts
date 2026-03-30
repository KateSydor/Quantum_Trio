/**
 * Backend Unit Tests — Business Logic
 * Імітація JUnit-тестів (TypeScript-версія для прототипу)
 * В реальному проєкті — JUnit 5 + Mockito
 */

/* ═══════ DOMAIN MODELS ═══════ */

interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

interface NutritionInfo {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

interface RecipeRequest {
  ingredients: string[];
  mealType: string;
  cookingTime: number;
  servings: number;
  allergies: string[];
  difficulty: number;
}

/* ═══════ BUSINESS LOGIC ═══════ */

function validateRecipeRequest(req: RecipeRequest): string[] {
  const errors: string[] = [];

  if (!req.ingredients || req.ingredients.length === 0) {
    errors.push('Ingredients list cannot be empty');
  }

  if (req.ingredients && req.ingredients.length > 20) {
    errors.push('Maximum 20 ingredients allowed');
  }

  const validMealTypes = ['breakfast', 'lunch', 'dinner', 'dessert', 'snack'];
  if (!validMealTypes.includes(req.mealType)) {
    errors.push('Invalid meal type');
  }

  if (req.cookingTime < 5 || req.cookingTime > 120) {
    errors.push('Cooking time must be between 5 and 120 minutes');
  }

  if (req.servings < 1 || req.servings > 10) {
    errors.push('Servings must be between 1 and 10');
  }

  if (req.difficulty < 1 || req.difficulty > 3) {
    errors.push('Difficulty must be between 1 and 3');
  }

  return errors;
}

function calculateNutrition(ingredients: Ingredient[], servings: number): NutritionInfo {
  // Simplified nutrition calculation
  const totalCalories = ingredients.length * 80;
  const totalProtein = ingredients.length * 5;
  const totalFat = ingredients.length * 4;
  const totalCarbs = ingredients.length * 10;

  return {
    calories: Math.round(totalCalories / servings),
    protein: Math.round(totalProtein / servings),
    fat: Math.round(totalFat / servings),
    carbs: Math.round(totalCarbs / servings),
  };
}

function filterAllergens(ingredients: string[], allergies: string[]): string[] {
  const allergenMap: Record<string, string[]> = {
    nuts: ['горіхи', 'мигдаль', 'арахіс', 'фундук', 'волоський горіх'],
    lactose: ['молоко', 'сир', 'масло', 'йогурт', 'вершки', 'сметана'],
    gluten: ['борошно', 'хліб', 'макарони', 'пшениця', 'ячмінь'],
    eggs: ['яйця', 'яйце'],
    fish: ['риба', 'лосось', 'тунець', 'форель'],
    seafood: ['креветки', 'мідії', 'кальмари', 'устриці'],
  };

  const blockedIngredients: string[] = [];
  for (const allergy of allergies) {
    const allergenWords = allergenMap[allergy] || [];
    for (const ing of ingredients) {
      const lower = ing.toLowerCase();
      if (allergenWords.some(word => lower.includes(word))) {
        blockedIngredients.push(ing);
      }
    }
  }

  return ingredients.filter(ing => !blockedIngredients.includes(ing));
}

function formatServingsLabel(n: number): string {
  if (n === 1) return '1 порція';
  if (n >= 2 && n <= 4) return `${n} порції`;
  return `${n} порцій`;
}

function estimateDifficulty(cookingTime: number, ingredientsCount: number): string {
  const score = (cookingTime / 30) + (ingredientsCount / 5);
  if (score <= 2) return 'Легко';
  if (score <= 4) return 'Середньо';
  return 'Складно';
}

function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePassword(password: string): { valid: boolean; strength: string } {
  if (password.length < 8) return { valid: false, strength: 'Слабкий' };
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*]/.test(password);

  const score = [hasUpper, hasLower, hasDigit, hasSpecial].filter(Boolean).length;

  if (score <= 1) return { valid: true, strength: 'Слабкий' };
  if (score <= 2) return { valid: true, strength: 'Середній' };
  return { valid: true, strength: 'Сильний' };
}

/* ═══════ UNIT TESTS ═══════ */

describe('Backend: Recipe Request Validation', () => {
  // BU-VAL-001
  test('valid request returns no errors', () => {
    const req: RecipeRequest = {
      ingredients: ['Яйця', 'Шпинат'],
      mealType: 'breakfast',
      cookingTime: 30,
      servings: 2,
      allergies: [],
      difficulty: 1,
    };
    expect(validateRecipeRequest(req)).toHaveLength(0);
  });

  // BU-VAL-002
  test('empty ingredients returns error', () => {
    const req: RecipeRequest = {
      ingredients: [],
      mealType: 'breakfast',
      cookingTime: 30,
      servings: 2,
      allergies: [],
      difficulty: 1,
    };
    const errors = validateRecipeRequest(req);
    expect(errors).toContain('Ingredients list cannot be empty');
  });

  // BU-VAL-003
  test('too many ingredients returns error', () => {
    const req: RecipeRequest = {
      ingredients: Array(21).fill('item'),
      mealType: 'breakfast',
      cookingTime: 30,
      servings: 2,
      allergies: [],
      difficulty: 1,
    };
    const errors = validateRecipeRequest(req);
    expect(errors).toContain('Maximum 20 ingredients allowed');
  });

  // BU-VAL-004
  test('invalid meal type returns error', () => {
    const req: RecipeRequest = {
      ingredients: ['Яйця'],
      mealType: 'brunch',
      cookingTime: 30,
      servings: 2,
      allergies: [],
      difficulty: 1,
    };
    const errors = validateRecipeRequest(req);
    expect(errors).toContain('Invalid meal type');
  });

  // BU-VAL-005
  test('cooking time out of range returns error', () => {
    const req: RecipeRequest = {
      ingredients: ['Яйця'],
      mealType: 'breakfast',
      cookingTime: 200,
      servings: 2,
      allergies: [],
      difficulty: 1,
    };
    const errors = validateRecipeRequest(req);
    expect(errors).toContain('Cooking time must be between 5 and 120 minutes');
  });

  // BU-VAL-006
  test('servings out of range returns error', () => {
    const req: RecipeRequest = {
      ingredients: ['Яйця'],
      mealType: 'breakfast',
      cookingTime: 30,
      servings: 15,
      allergies: [],
      difficulty: 1,
    };
    const errors = validateRecipeRequest(req);
    expect(errors).toContain('Servings must be between 1 and 10');
  });

  // BU-VAL-007
  test('invalid difficulty returns error', () => {
    const req: RecipeRequest = {
      ingredients: ['Яйця'],
      mealType: 'breakfast',
      cookingTime: 30,
      servings: 2,
      allergies: [],
      difficulty: 5,
    };
    const errors = validateRecipeRequest(req);
    expect(errors).toContain('Difficulty must be between 1 and 3');
  });
});

describe('Backend: Nutrition Calculation', () => {
  // BU-NUT-001
  test('calculates nutrition per serving', () => {
    const ingredients: Ingredient[] = [
      { name: 'Яйця', amount: '4', unit: 'шт' },
      { name: 'Шпинат', amount: '100', unit: 'г' },
    ];
    const result = calculateNutrition(ingredients, 2);
    expect(result.calories).toBe(80);
    expect(result.protein).toBe(5);
    expect(result.fat).toBe(4);
    expect(result.carbs).toBe(10);
  });

  // BU-NUT-002
  test('single serving returns full nutrition', () => {
    const ingredients: Ingredient[] = [
      { name: 'Яйця', amount: '2', unit: 'шт' },
    ];
    const result = calculateNutrition(ingredients, 1);
    expect(result.calories).toBe(80);
  });

  // BU-NUT-003
  test('more servings reduces per-serving values', () => {
    const ingredients: Ingredient[] = [
      { name: 'Яйця', amount: '4', unit: 'шт' },
      { name: 'Шпинат', amount: '200', unit: 'г' },
      { name: 'Сир', amount: '100', unit: 'г' },
    ];
    const for2 = calculateNutrition(ingredients, 2);
    const for4 = calculateNutrition(ingredients, 4);
    expect(for4.calories).toBeLessThan(for2.calories);
  });
});

describe('Backend: Allergen Filtering', () => {
  // BU-ALR-001
  test('filters out lactose ingredients', () => {
    const ingredients = ['Яйця', 'Сир фета', 'Молоко', 'Шпинат'];
    const filtered = filterAllergens(ingredients, ['lactose']);
    expect(filtered).not.toContain('Сир фета');
    expect(filtered).not.toContain('Молоко');
    expect(filtered).toContain('Яйця');
    expect(filtered).toContain('Шпинат');
  });

  // BU-ALR-002
  test('filters out gluten ingredients', () => {
    const ingredients = ['Борошно пшеничне', 'Яйця', 'Цукор'];
    const filtered = filterAllergens(ingredients, ['gluten']);
    expect(filtered).not.toContain('Борошно пшеничне');
    expect(filtered).toContain('Яйця');
  });

  // BU-ALR-003
  test('filters multiple allergens simultaneously', () => {
    const ingredients = ['Яйця', 'Молоко', 'Горіхи', 'Шпинат'];
    const filtered = filterAllergens(ingredients, ['lactose', 'nuts', 'eggs']);
    expect(filtered).toEqual(['Шпинат']);
  });

  // BU-ALR-004
  test('no allergies returns all ingredients', () => {
    const ingredients = ['Яйця', 'Молоко', 'Горіхи'];
    const filtered = filterAllergens(ingredients, []);
    expect(filtered).toEqual(ingredients);
  });
});

describe('Backend: Utility Functions', () => {
  // BU-UTL-001
  test('servings label: 1 порція', () => {
    expect(formatServingsLabel(1)).toBe('1 порція');
  });

  // BU-UTL-002
  test('servings label: 2 порції', () => {
    expect(formatServingsLabel(2)).toBe('2 порції');
  });

  // BU-UTL-003
  test('servings label: 5 порцій', () => {
    expect(formatServingsLabel(5)).toBe('5 порцій');
  });

  // BU-UTL-004
  test('difficulty estimation: easy', () => {
    expect(estimateDifficulty(10, 3)).toBe('Легко');
  });

  // BU-UTL-005
  test('difficulty estimation: medium', () => {
    expect(estimateDifficulty(45, 8)).toBe('Середньо');
  });

  // BU-UTL-006
  test('difficulty estimation: hard', () => {
    expect(estimateDifficulty(120, 15)).toBe('Складно');
  });
});

describe('Backend: Email Validation', () => {
  // BU-EML-001
  test('valid email passes', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });

  // BU-EML-002
  test('email without @ fails', () => {
    expect(validateEmail('testexample.com')).toBe(false);
  });

  // BU-EML-003
  test('email without domain fails', () => {
    expect(validateEmail('test@')).toBe(false);
  });

  // BU-EML-004
  test('empty email fails', () => {
    expect(validateEmail('')).toBe(false);
  });

  // BU-EML-005
  test('email with spaces fails', () => {
    expect(validateEmail('test @example.com')).toBe(false);
  });
});

describe('Backend: Password Validation', () => {
  // BU-PWD-001
  test('short password is invalid', () => {
    const result = validatePassword('abc');
    expect(result.valid).toBe(false);
    expect(result.strength).toBe('Слабкий');
  });

  // BU-PWD-002
  test('password with only lowercase is weak', () => {
    const result = validatePassword('abcdefgh');
    expect(result.valid).toBe(true);
    expect(result.strength).toBe('Слабкий');
  });

  // BU-PWD-003
  test('password with upper+lower is medium', () => {
    const result = validatePassword('Abcdefgh');
    expect(result.valid).toBe(true);
    expect(result.strength).toBe('Середній');
  });

  // BU-PWD-004
  test('password with upper+lower+digit+special is strong', () => {
    const result = validatePassword('Abcdef1!');
    expect(result.valid).toBe(true);
    expect(result.strength).toBe('Сильний');
  });

  // BU-PWD-005
  test('8 character password is valid', () => {
    const result = validatePassword('12345678');
    expect(result.valid).toBe(true);
  });
});

