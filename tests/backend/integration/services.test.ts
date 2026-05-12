/**
 * Backend Integration Tests — Real NestJS Services
 *
 * Creates actual NestJS service instances via TestingModule.
 * TypeORM repositories are replaced with jest mocks — no database required.
 * Tests exercise real service logic: bcrypt hashing, JWT signing, exception
 * throwing, entity mapping, and query builder usage.
 */

import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';

import { AuthService } from '../../../src/backend/src/auth/auth.service';
import { UsersService } from '../../../src/backend/src/users/users.service';
import { User } from '../../../src/backend/src/users/user.entity';

import { RecipesService } from '../../../src/backend/src/recipes/recipes.service';
import { Recipe } from '../../../src/backend/src/recipes/entities/recipe.entity';
import { RecipeReview } from '../../../src/backend/src/recipes/entities/recipe-review.entity';

// Skip slow 10-round bcrypt in unit/integration tests
jest.mock('bcrypt', () => ({
  hash:    jest.fn().mockResolvedValue('$2b$10$mockhashedpassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

/* ═══════ Constants & fixtures ═══════════════════════════════════════════════ */

const JWT_SECRET     = 'test-jwt-secret';
const MOCK_USER_ID   = '550e8400-e29b-41d4-a716-446655440001';
const MOCK_RECIPE_ID = '550e8400-e29b-41d4-a716-446655440002';

const mockUser: User = {
  id: MOCK_USER_ID,
  email: 'test@example.com',
  passwordHash: '$2b$10$mockhashedpassword',
  createdAt: new Date('2024-01-01'),
};

const mockRecipeEntity = {
  id: MOCK_RECIPE_ID,
  title: 'Шпинатна яєчня',
  titleEmphasis: null,
  bannerEmoji: '🥚',
  isAiGenerated: true,
  chefTip: 'Додай щіпку мускату',
  prepTimeLabel: '15 хв',
  servings: 2,
  caloriesKcal: 320,
  nutritionProtein: 22,
  nutritionFat: 24,
  nutritionCarbs: 6,
  tags: [],
  ingredients: [],
  steps: [],
  reviews: [],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
} as unknown as Recipe;

/* ═══════ Mock factories ══════════════════════════════════════════════════════ */

function makeUserRepoMock() {
  return {
    findOne: jest.fn(),
    create:  jest.fn().mockImplementation((dto: Partial<User>) => ({ ...dto })),
    save:    jest.fn(),
    count:   jest.fn(),
  };
}

function makeRecipeRepoMock() {
  return {
    findOne: jest.fn(),
    save:    jest.fn(),
    count:   jest.fn(),
  };
}

function makeReviewRepoMock() {
  const queryBuilder = {
    select:   jest.fn().mockReturnThis(),
    where:    jest.fn().mockReturnThis(),
    getRawOne: jest.fn().mockResolvedValue({ avg: null }),
  };
  return {
    findOne:       jest.fn(),
    findOneOrFail: jest.fn(),
    findAndCount:  jest.fn(),
    create:        jest.fn(),
    save:          jest.fn(),
    count:         jest.fn().mockResolvedValue(0),
    createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
    queryBuilder,
  };
}

/* ═══════ AuthService ════════════════════════════════════════════════════════ */

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService:   JwtService;
  let userRepoMock: ReturnType<typeof makeUserRepoMock>;

  beforeEach(async () => {
    userRepoMock = makeUserRepoMock();

    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: JWT_SECRET, signOptions: { expiresIn: '1h' } })],
      providers: [
        AuthService,
        UsersService,
        { provide: getRepositoryToken(User), useValue: userRepoMock },
      ],
    }).compile();

    authService  = module.get(AuthService);
    usersService = module.get(UsersService);
    jwtService   = module.get(JwtService);
  });

  // BI-AUTH-001
  test('register() returns access_token and user info', async () => {
    userRepoMock.findOne.mockResolvedValue(null);
    userRepoMock.save.mockResolvedValue(mockUser);

    const result = await authService.register('test@example.com', 'password123');

    expect(result.access_token).toBeDefined();
    expect(result.user.id).toBe(MOCK_USER_ID);
    expect(result.user.email).toBe('test@example.com');
  });

  // BI-AUTH-002
  test('register() token payload contains correct sub and email', async () => {
    userRepoMock.findOne.mockResolvedValue(null);
    userRepoMock.save.mockResolvedValue(mockUser);

    const { access_token } = await authService.register('test@example.com', 'password123');
    const payload = jwtService.verify<{ sub: string; email: string }>(access_token);

    expect(payload.sub).toBe(MOCK_USER_ID);
    expect(payload.email).toBe('test@example.com');
  });

  // BI-AUTH-003
  test('register() throws ConflictException when email already exists', async () => {
    userRepoMock.findOne.mockResolvedValue(mockUser);

    await expect(authService.register('test@example.com', 'password123'))
      .rejects.toThrow(ConflictException);
  });

  // BI-AUTH-004
  test('login() returns access_token for valid credentials', async () => {
    userRepoMock.findOne.mockResolvedValue(mockUser);
    // bcrypt.compare mocked to true

    const result = await authService.login('test@example.com', 'password123');

    expect(result.access_token).toBeDefined();
    expect(result.user.email).toBe('test@example.com');
  });

  // BI-AUTH-005
  test('login() throws UnauthorizedException when user not found', async () => {
    userRepoMock.findOne.mockResolvedValue(null);

    await expect(authService.login('nobody@example.com', 'password123'))
      .rejects.toThrow(UnauthorizedException);
  });

  // BI-AUTH-006
  test('login() throws UnauthorizedException for wrong password', async () => {
    const bcrypt = require('bcrypt');
    userRepoMock.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValueOnce(false);

    await expect(authService.login('test@example.com', 'wrongpassword'))
      .rejects.toThrow(UnauthorizedException);
  });

  // BI-AUTH-007
  test('email is lower-cased before repository lookup', async () => {
    userRepoMock.findOne.mockResolvedValue(null);
    userRepoMock.save.mockResolvedValue({ ...mockUser, email: 'upper@example.com' });

    await authService.register('UPPER@EXAMPLE.COM', 'password123');

    expect(userRepoMock.findOne).toHaveBeenCalledWith({
      where: { email: 'upper@example.com' },
    });
  });

  // BI-AUTH-008
  test('login() lower-cases email before lookup', async () => {
    userRepoMock.findOne.mockResolvedValue(null);

    await expect(authService.login('UPPER@EXAMPLE.COM', 'password123'))
      .rejects.toThrow(UnauthorizedException);

    expect(userRepoMock.findOne).toHaveBeenCalledWith({
      where: { email: 'upper@example.com' },
    });
  });
});

/* ═══════ UsersService ═══════════════════════════════════════════════════════ */

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepoMock: ReturnType<typeof makeUserRepoMock>;

  beforeEach(async () => {
    userRepoMock = makeUserRepoMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: userRepoMock },
      ],
    }).compile();

    usersService = module.get(UsersService);
  });

  // BI-US-001
  test('create() hashes password and saves user', async () => {
    const bcrypt = require('bcrypt');
    userRepoMock.save.mockResolvedValue(mockUser);

    const user = await usersService.create('test@example.com', 'plainpassword');

    expect(bcrypt.hash).toHaveBeenCalledWith('plainpassword', 10);
    expect(userRepoMock.save).toHaveBeenCalled();
    expect(user).toEqual(mockUser);
  });

  // BI-US-002
  test('validatePassword() returns true for matching password', async () => {
    const bcrypt = require('bcrypt');
    bcrypt.compare.mockResolvedValueOnce(true);

    const result = await usersService.validatePassword(mockUser, 'password123');

    expect(result).toBe(true);
    expect(bcrypt.compare).toHaveBeenCalledWith('password123', mockUser.passwordHash);
  });

  // BI-US-003
  test('validatePassword() returns false for wrong password', async () => {
    const bcrypt = require('bcrypt');
    bcrypt.compare.mockResolvedValueOnce(false);

    const result = await usersService.validatePassword(mockUser, 'wrongpassword');

    expect(result).toBe(false);
  });

  // BI-US-004
  test('findByEmail() queries with lower-cased email', async () => {
    userRepoMock.findOne.mockResolvedValue(mockUser);

    await usersService.findByEmail('Test@Example.COM');

    expect(userRepoMock.findOne).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
  });
});

/* ═══════ RecipesService ══════════════════════════════════════════════════════ */

describe('RecipesService', () => {
  let recipesService: RecipesService;
  let recipeRepoMock: ReturnType<typeof makeRecipeRepoMock>;
  let reviewRepoMock: ReturnType<typeof makeReviewRepoMock>;

  beforeEach(async () => {
    recipeRepoMock = makeRecipeRepoMock();
    reviewRepoMock = makeReviewRepoMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipesService,
        { provide: getRepositoryToken(Recipe),       useValue: recipeRepoMock },
        { provide: getRepositoryToken(RecipeReview), useValue: reviewRepoMock },
      ],
    }).compile();

    recipesService = module.get(RecipesService);
  });

  // BI-REC-001
  test('generateAndSave() returns RecipePageResponse with required shape', async () => {
    recipeRepoMock.save.mockResolvedValue(mockRecipeEntity);
    reviewRepoMock.count.mockResolvedValue(0);

    const result = await recipesService.generateAndSave();

    expect(result.id).toBeDefined();
    expect(result.title).toBeDefined();
    expect(result.meta).toBeDefined();
    expect(result.meta.caloriesLabel).toContain('ккал');
    expect(result.ingredients).toBeInstanceOf(Array);
    expect(result.steps).toBeInstanceOf(Array);
    expect(result.nutritionPerServing.calories).toBeGreaterThan(0);
    expect(result.reviews.count).toBe(0);
    expect(result.isAiGenerated).toBe(true);
  });

  // BI-REC-002
  test('findById() returns RecipePageResponse for existing recipe', async () => {
    recipeRepoMock.findOne.mockResolvedValue(mockRecipeEntity);
    reviewRepoMock.count.mockResolvedValue(0);

    const result = await recipesService.findById(MOCK_RECIPE_ID);

    expect(result.id).toBe(MOCK_RECIPE_ID);
    expect(result.title).toBe('Шпинатна яєчня');
    expect(result.meta.servings).toBe(2);
  });

  // BI-REC-003
  test('findById() calculates average rating from query builder', async () => {
    recipeRepoMock.findOne.mockResolvedValue(mockRecipeEntity);
    reviewRepoMock.count.mockResolvedValue(3);
    reviewRepoMock.queryBuilder.getRawOne.mockResolvedValue({ avg: '4.3' });

    const result = await recipesService.findById(MOCK_RECIPE_ID);

    expect(result.reviews.count).toBe(3);
    expect(result.meta.rating).toBe(4.3);
  });

  // BI-REC-004
  test('findById() throws NotFoundException when recipe does not exist', async () => {
    recipeRepoMock.findOne.mockResolvedValue(null);

    await expect(recipesService.findById(MOCK_RECIPE_ID))
      .rejects.toThrow(NotFoundException);
  });

  // BI-REC-005
  test('toResponse() maps entity fields correctly', () => {
    const result = recipesService.toResponse(mockRecipeEntity, { count: 5, average: 4.8 });

    expect(result.id).toBe(MOCK_RECIPE_ID);
    expect(result.meta.caloriesLabel).toBe('320 ккал');
    expect(result.meta.servings).toBe(2);
    expect(result.meta.rating).toBe(4.8);
    expect(result.nutritionPerServing.calories).toBe(320);
    expect(result.nutritionPerServing.proteinG).toBe(22);
    expect(result.nutritionPerServing.fatG).toBe(24);
    expect(result.nutritionPerServing.carbsG).toBe(6);
    expect(result.reviews.count).toBe(5);
    expect(result.banner).toEqual({ type: 'emoji', value: '🥚' });
  });

  // BI-REC-006
  test('createReview() saves review and returns ReviewItemResponse', async () => {
    const savedReview = {
      id: 'review-uuid',
      rating: 5,
      body: 'Смачно!',
      user: mockUser,
      recipe: mockRecipeEntity,
      createdAt: new Date('2024-06-01'),
    } as unknown as RecipeReview;

    recipeRepoMock.findOne.mockResolvedValue(mockRecipeEntity);
    reviewRepoMock.findOne.mockResolvedValueOnce(null);
    reviewRepoMock.create.mockReturnValue(savedReview);
    reviewRepoMock.save.mockResolvedValue(savedReview);
    reviewRepoMock.findOneOrFail.mockResolvedValue(savedReview);

    const result = await recipesService.createReview(
      MOCK_RECIPE_ID,
      { id: MOCK_USER_ID, email: 'test@example.com' },
      { rating: 5, body: 'Смачно!' },
    );

    expect(result.rating).toBe(5);
    expect(result.body).toBe('Смачно!');
    expect(result.user.id).toBe(MOCK_USER_ID);
    expect(result.user.email).toBe('test@example.com');
    expect(result.createdAt).toBeDefined();
  });

  // BI-REC-007
  test('createReview() trims whitespace-only body to null', async () => {
    const savedReview = {
      id: 'review-uuid', rating: 4, body: null, user: mockUser,
      recipe: mockRecipeEntity, createdAt: new Date(),
    } as unknown as RecipeReview;

    recipeRepoMock.findOne.mockResolvedValue(mockRecipeEntity);
    reviewRepoMock.findOne.mockResolvedValueOnce(null);
    reviewRepoMock.create.mockReturnValue(savedReview);
    reviewRepoMock.save.mockResolvedValue(savedReview);
    reviewRepoMock.findOneOrFail.mockResolvedValue(savedReview);

    const result = await recipesService.createReview(
      MOCK_RECIPE_ID,
      { id: MOCK_USER_ID, email: 'test@example.com' },
      { rating: 4, body: '   ' },
    );

    expect(reviewRepoMock.create).toHaveBeenCalledWith(
      expect.objectContaining({ body: null }),
    );
    expect(result.body).toBeNull();
  });

  // BI-REC-008
  test('createReview() throws ConflictException for duplicate review', async () => {
    recipeRepoMock.findOne.mockResolvedValue(mockRecipeEntity);
    reviewRepoMock.findOne.mockResolvedValue({ id: 'existing' } as RecipeReview);

    await expect(
      recipesService.createReview(
        MOCK_RECIPE_ID,
        { id: MOCK_USER_ID, email: 'test@example.com' },
        { rating: 4 },
      ),
    ).rejects.toThrow(ConflictException);
  });

  // BI-REC-009
  test('createReview() throws NotFoundException when recipe missing', async () => {
    recipeRepoMock.findOne.mockResolvedValue(null);

    await expect(
      recipesService.createReview(
        MOCK_RECIPE_ID,
        { id: MOCK_USER_ID, email: 'test@example.com' },
        { rating: 3 },
      ),
    ).rejects.toThrow(NotFoundException);
  });

  // BI-REC-010
  test('listReviews() returns count and mapped items', async () => {
    const reviewRow = {
      id: 'review-1', rating: 4, body: 'Good',
      user: mockUser, recipe: mockRecipeEntity, createdAt: new Date(),
    } as unknown as RecipeReview;

    recipeRepoMock.count.mockResolvedValue(1);
    reviewRepoMock.findAndCount.mockResolvedValue([[reviewRow], 1]);

    const result = await recipesService.listReviews(MOCK_RECIPE_ID, { limit: 20, offset: 0 });

    expect(result.count).toBe(1);
    expect(result.items).toHaveLength(1);
    expect(result.items[0].rating).toBe(4);
    expect(result.items[0].user.email).toBe('test@example.com');
  });

  // BI-REC-011
  test('listReviews() throws NotFoundException when recipe missing', async () => {
    recipeRepoMock.count.mockResolvedValue(0);

    await expect(
      recipesService.listReviews(MOCK_RECIPE_ID, { limit: 20, offset: 0 }),
    ).rejects.toThrow(NotFoundException);
  });
});
