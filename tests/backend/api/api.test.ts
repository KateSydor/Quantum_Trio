/**
 * API Tests — RecipeAI Backend
 *
 * Uses a real NestJS TestingModule with Supertest for HTTP assertions.
 * TypeORM repositories are replaced with jest mocks — no database required.
 * All controller routing, DTO validation, service logic, and JWT auth are real.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';

import { AuthController } from '../../../src/backend/src/auth/auth.controller';
import { AuthService } from '../../../src/backend/src/auth/auth.service';
import { UsersService } from '../../../src/backend/src/users/users.service';
import { JwtStrategy } from '../../../src/backend/src/auth/strategies/jwt.strategy';
import { User } from '../../../src/backend/src/users/user.entity';

import { RecipesController } from '../../../src/backend/src/recipes/recipes.controller';
import { RecipesService } from '../../../src/backend/src/recipes/recipes.service';
import { Recipe } from '../../../src/backend/src/recipes/entities/recipe.entity';
import { RecipeReview } from '../../../src/backend/src/recipes/entities/recipe-review.entity';

// Avoid 10-round bcrypt hashing in every test
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('$2b$10$mockhashedpassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

/* ═══════ Constants & fixtures ═══════════════════════════════════════════════ */

const JWT_SECRET = 'test-jwt-secret';
const MOCK_USER_ID  = '550e8400-e29b-41d4-a716-446655440001';
const MOCK_RECIPE_ID = '550e8400-e29b-41d4-a716-446655440002';
const MOCK_REVIEW_ID = '550e8400-e29b-41d4-a716-446655440003';

const mockUser: User = {
  id: MOCK_USER_ID,
  email: 'test@example.com',
  passwordHash: '$2b$10$mockhashedpassword',
  createdAt: new Date('2024-01-01'),
};

const mockRecipe = {
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

const mockReview = {
  id: MOCK_REVIEW_ID,
  rating: 5,
  body: 'Дуже смачно!',
  user: mockUser,
  recipe: mockRecipe,
  createdAt: new Date('2024-01-01'),
} as unknown as RecipeReview;

/* ═══════ Mock factories ══════════════════════════════════════════════════════ */

function makeUserRepoMock() {
  return {
    findOne: jest.fn(),
    create: jest.fn().mockImplementation((dto: Partial<User>) => ({ ...dto })),
    save:   jest.fn(),
    count:  jest.fn(),
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
    select: jest.fn().mockReturnThis(),
    where:  jest.fn().mockReturnThis(),
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

/* ═══════ App factory ════════════════════════════════════════════════════════ */

type Mocks = {
  userRepo:   ReturnType<typeof makeUserRepoMock>;
  recipeRepo: ReturnType<typeof makeRecipeRepoMock>;
  reviewRepo: ReturnType<typeof makeReviewRepoMock>;
};

async function createTestApp(): Promise<{ app: INestApplication; jwtService: JwtService } & Mocks> {
  const userRepo   = makeUserRepoMock();
  const recipeRepo = makeRecipeRepoMock();
  const reviewRepo = makeReviewRepoMock();

  const module: TestingModule = await Test.createTestingModule({
    imports: [
      PassportModule,
      JwtModule.register({ secret: JWT_SECRET, signOptions: { expiresIn: '1h' } }),
    ],
    controllers: [AuthController, RecipesController],
    providers: [
      AuthService,
      UsersService,
      RecipesService,
      JwtStrategy,
      {
        provide: ConfigService,
        useValue: {
          getOrThrow: (key: string) => {
            if (key === 'auth.jwtSecret') return JWT_SECRET;
            throw new Error(`Unknown config key: ${key}`);
          },
        },
      },
      { provide: getRepositoryToken(User),         useValue: userRepo },
      { provide: getRepositoryToken(Recipe),       useValue: recipeRepo },
      { provide: getRepositoryToken(RecipeReview), useValue: reviewRepo },
    ],
  }).compile();

  const app = module.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.init();

  return { app, jwtService: module.get(JwtService), userRepo, recipeRepo, reviewRepo };
}

/* ═══════ POST /auth/register ════════════════════════════════════════════════ */

describe('API: POST /auth/register', () => {
  let app: INestApplication;
  let userRepo: ReturnType<typeof makeUserRepoMock>;

  beforeAll(async () => ({ app, userRepo } = await createTestApp()));
  afterAll(() => app.close());
  beforeEach(() => jest.clearAllMocks());

  // AT-AUTH-001
  test('201 — creates user and returns access_token + user info', async () => {
    userRepo.findOne.mockResolvedValue(null);
    userRepo.save.mockResolvedValue(mockUser);

    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'new@example.com', password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body.access_token).toBeDefined();
    expect(res.body.user.id).toBe(MOCK_USER_ID);
    expect(res.body.user.email).toBe('test@example.com');
  });

  // AT-AUTH-002
  test('400 — invalid email fails DTO validation', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'not-an-email', password: 'password123' });

    expect(res.status).toBe(400);
  });

  // AT-AUTH-003
  test('400 — password shorter than 8 chars fails validation', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'ok@example.com', password: '1234567' });

    expect(res.status).toBe(400);
  });

  // AT-AUTH-004
  test('409 — duplicate email returns Conflict', async () => {
    userRepo.findOne.mockResolvedValue(mockUser);

    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(res.status).toBe(409);
  });
});

/* ═══════ POST /auth/login ═══════════════════════════════════════════════════ */

describe('API: POST /auth/login', () => {
  let app: INestApplication;
  let userRepo: ReturnType<typeof makeUserRepoMock>;

  beforeAll(async () => ({ app, userRepo } = await createTestApp()));
  afterAll(() => app.close());
  beforeEach(() => jest.clearAllMocks());

  // AT-AUTH-005
  // NestJS default for @Post() without @HttpCode() is 201
  test('201 — valid credentials return access_token and user', async () => {
    userRepo.findOne.mockResolvedValue(mockUser);
    // bcrypt.compare mocked to true

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body.access_token).toBeDefined();
    expect(res.body.user.email).toBe('test@example.com');
  });

  // AT-AUTH-006
  test('401 — unknown email returns Unauthorized', async () => {
    userRepo.findOne.mockResolvedValue(null);

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'nobody@example.com', password: 'password123' });

    expect(res.status).toBe(401);
  });

  // AT-AUTH-007
  test('401 — wrong password returns Unauthorized', async () => {
    const bcrypt = require('bcrypt');
    userRepo.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValueOnce(false);

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'wrongpassword' });

    expect(res.status).toBe(401);
  });

  // AT-AUTH-008
  test('400 — empty password fails validation', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: '' });

    expect(res.status).toBe(400);
  });
});

/* ═══════ GET /auth/profile ══════════════════════════════════════════════════ */

describe('API: GET /auth/profile', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let userRepo: ReturnType<typeof makeUserRepoMock>;

  beforeAll(async () => ({ app, jwtService, userRepo } = await createTestApp()));
  afterAll(() => app.close());
  beforeEach(() => jest.clearAllMocks());

  // AT-AUTH-009
  test('200 — valid JWT returns user from strategy', async () => {
    userRepo.findOne.mockResolvedValue(mockUser);
    const token = jwtService.sign({ sub: MOCK_USER_ID, email: mockUser.email });

    const res = await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(MOCK_USER_ID);
    expect(res.body.email).toBe('test@example.com');
  });

  // AT-AUTH-010
  test('401 — missing JWT returns Unauthorized', async () => {
    const res = await request(app.getHttpServer()).get('/auth/profile');
    expect(res.status).toBe(401);
  });

  // AT-AUTH-011
  test('401 — tampered JWT is rejected', async () => {
    const res = await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', 'Bearer not.a.valid.jwt');

    expect(res.status).toBe(401);
  });
});

/* ═══════ POST /generate ═════════════════════════════════════════════════════ */

describe('API: POST /generate', () => {
  let app: INestApplication;
  let recipeRepo: ReturnType<typeof makeRecipeRepoMock>;
  let reviewRepo: ReturnType<typeof makeReviewRepoMock>;

  beforeAll(async () => ({ app, recipeRepo, reviewRepo } = await createTestApp()));
  afterAll(() => app.close());
  beforeEach(() => jest.clearAllMocks());

  // AT-REC-001
  test('201 — returns full RecipePageResponse', async () => {
    recipeRepo.save.mockResolvedValue(mockRecipe);
    reviewRepo.count.mockResolvedValue(0);

    const res = await request(app.getHttpServer()).post('/generate');

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.title).toBeDefined();
    expect(res.body.meta).toBeDefined();
    expect(res.body.meta.caloriesLabel).toContain('ккал');
    expect(res.body.ingredients).toBeInstanceOf(Array);
    expect(res.body.steps).toBeInstanceOf(Array);
    expect(res.body.nutritionPerServing).toBeDefined();
    expect(res.body.reviews).toBeDefined();
  });
});

/* ═══════ GET /recipes/:id ═══════════════════════════════════════════════════ */

describe('API: GET /recipes/:id', () => {
  let app: INestApplication;
  let recipeRepo: ReturnType<typeof makeRecipeRepoMock>;
  let reviewRepo: ReturnType<typeof makeReviewRepoMock>;

  beforeAll(async () => ({ app, recipeRepo, reviewRepo } = await createTestApp()));
  afterAll(() => app.close());
  beforeEach(() => jest.clearAllMocks());

  // AT-REC-002
  test('200 — returns recipe by UUID', async () => {
    recipeRepo.findOne.mockResolvedValue(mockRecipe);
    reviewRepo.count.mockResolvedValue(0);

    const res = await request(app.getHttpServer()).get(`/recipes/${MOCK_RECIPE_ID}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(MOCK_RECIPE_ID);
    expect(res.body.title).toBe('Шпинатна яєчня');
    expect(res.body.meta.servings).toBe(2);
  });

  // AT-REC-003
  test('404 — recipe not found', async () => {
    recipeRepo.findOne.mockResolvedValue(null);

    const res = await request(app.getHttpServer()).get(`/recipes/${MOCK_RECIPE_ID}`);
    expect(res.status).toBe(404);
  });

  // AT-REC-004
  test('400 — non-UUID param rejected by ParseUUIDPipe', async () => {
    const res = await request(app.getHttpServer()).get('/recipes/not-a-uuid');
    expect(res.status).toBe(400);
  });
});

/* ═══════ POST /recipes/:id/reviews ══════════════════════════════════════════ */

describe('API: POST /recipes/:id/reviews', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let userRepo:   ReturnType<typeof makeUserRepoMock>;
  let recipeRepo: ReturnType<typeof makeRecipeRepoMock>;
  let reviewRepo: ReturnType<typeof makeReviewRepoMock>;

  beforeAll(async () => (
    { app, jwtService, userRepo, recipeRepo, reviewRepo } = await createTestApp()
  ));
  afterAll(() => app.close());
  beforeEach(() => jest.clearAllMocks());

  // AT-REC-005
  test('201 — creates review when authenticated', async () => {
    userRepo.findOne.mockResolvedValue(mockUser);
    recipeRepo.findOne.mockResolvedValue(mockRecipe);
    reviewRepo.findOne.mockResolvedValueOnce(null);
    reviewRepo.create.mockReturnValue(mockReview);
    reviewRepo.save.mockResolvedValue(mockReview);
    reviewRepo.findOneOrFail.mockResolvedValue(mockReview);

    const token = jwtService.sign({ sub: MOCK_USER_ID, email: mockUser.email });

    const res = await request(app.getHttpServer())
      .post(`/recipes/${MOCK_RECIPE_ID}/reviews`)
      .set('Authorization', `Bearer ${token}`)
      .send({ rating: 5, body: 'Дуже смачно!' });

    expect(res.status).toBe(201);
    expect(res.body.rating).toBe(5);
    expect(res.body.body).toBe('Дуже смачно!');
    expect(res.body.user.email).toBe('test@example.com');
    expect(res.body.createdAt).toBeDefined();
  });

  // AT-REC-006
  test('401 — no JWT returns Unauthorized', async () => {
    const res = await request(app.getHttpServer())
      .post(`/recipes/${MOCK_RECIPE_ID}/reviews`)
      .send({ rating: 4 });

    expect(res.status).toBe(401);
  });

  // AT-REC-007
  test('409 — duplicate review returns Conflict', async () => {
    userRepo.findOne.mockResolvedValue(mockUser);
    recipeRepo.findOne.mockResolvedValue(mockRecipe);
    reviewRepo.findOne.mockResolvedValue(mockReview);

    const token = jwtService.sign({ sub: MOCK_USER_ID, email: mockUser.email });

    const res = await request(app.getHttpServer())
      .post(`/recipes/${MOCK_RECIPE_ID}/reviews`)
      .set('Authorization', `Bearer ${token}`)
      .send({ rating: 3 });

    expect(res.status).toBe(409);
  });

  // AT-REC-008
  test('400 — rating > 5 fails DTO validation', async () => {
    userRepo.findOne.mockResolvedValue(mockUser);
    const token = jwtService.sign({ sub: MOCK_USER_ID, email: mockUser.email });

    const res = await request(app.getHttpServer())
      .post(`/recipes/${MOCK_RECIPE_ID}/reviews`)
      .set('Authorization', `Bearer ${token}`)
      .send({ rating: 6 });

    expect(res.status).toBe(400);
  });

  // AT-REC-009
  test('400 — rating < 1 fails DTO validation', async () => {
    userRepo.findOne.mockResolvedValue(mockUser);
    const token = jwtService.sign({ sub: MOCK_USER_ID, email: mockUser.email });

    const res = await request(app.getHttpServer())
      .post(`/recipes/${MOCK_RECIPE_ID}/reviews`)
      .set('Authorization', `Bearer ${token}`)
      .send({ rating: 0 });

    expect(res.status).toBe(400);
  });
});
