import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { buildMockRecipeGraph } from './recipe-mock';
import { CreateReviewDto } from './dto/create-review.dto';
import { ListReviewsQueryDto } from './dto/list-reviews-query.dto';
import { Recipe } from './entities/recipe.entity';
import { RecipeReview } from './entities/recipe-review.entity';
import { User } from '../users/user.entity';

export type RecipePageResponse = {
  id: string;
  title: string;
  titleEmphasis: string | null;
  banner: { type: 'emoji'; value: string | null };
  isAiGenerated: boolean;
  meta: {
    timeLabel: string;
    servings: number;
    servingsLabel: string;
    caloriesLabel: string;
    rating: number;
  };
  tags: { key: string; label: string }[];
  chefTip: { title: string; body: string | null };
  ingredients: {
    id: string;
    position: number;
    emoji: string | null;
    name: string;
    amount: string;
  }[];
  steps: { position: number; text: string }[];
  nutritionPerServing: {
    calories: number;
    proteinG: number;
    fatG: number;
    carbsG: number;
  };
  /** Total reviews in `recipe_reviews` (load rows via `GET /recipes/:id/reviews`). */
  reviews: { count: number };
};

export type ReviewItemResponse = {
  id: string;
  rating: number;
  body: string | null;
  user: { id: string; email: string };
  createdAt: string;
};

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepo: Repository<Recipe>,
    @InjectRepository(RecipeReview)
    private readonly reviewRepo: Repository<RecipeReview>,
  ) {}

  private async getReviewStats(
    recipeId: string,
  ): Promise<{ count: number; average: number }> {
    const count = await this.reviewRepo.count({
      where: { recipe: { id: recipeId } },
    });
    if (count === 0) {
      return { count: 0, average: 0 };
    }
    const raw = await this.reviewRepo
      .createQueryBuilder('r')
      .select('AVG(r.rating::float)', 'avg')
      .where('r.recipeId = :id', { id: recipeId })
      .getRawOne<{ avg: string | null }>();
    const average =
      Math.round(Number.parseFloat(String(raw?.avg ?? '0')) * 10) / 10;
    return { count, average };
  }

  toResponse(
    r: Recipe,
    reviewStats: { count: number; average: number },
  ): RecipePageResponse {
    const cal = r.caloriesKcal;
    return {
      id: r.id,
      title: r.title,
      titleEmphasis: r.titleEmphasis,
      banner: { type: 'emoji', value: r.bannerEmoji },
      isAiGenerated: r.isAiGenerated,
      meta: {
        timeLabel: r.prepTimeLabel,
        servings: r.servings,
        servingsLabel: String(r.servings),
        caloriesLabel: `${cal} ккал`,
        rating: reviewStats.average,
      },
      tags: r.tags ?? [],
      chefTip: {
        title: 'AI Порада шеф-кухаря',
        body: r.chefTip,
      },
      ingredients: [...(r.ingredients ?? [])]
        .sort((a, b) => a.position - b.position)
        .map((i) => ({
          id: i.id,
          position: i.position,
          emoji: i.emoji,
          name: i.name,
          amount: i.amount,
        })),
      steps: [...(r.steps ?? [])]
        .sort((a, b) => a.position - b.position)
        .map((s) => ({ position: s.position, text: s.instruction })),
      nutritionPerServing: {
        calories: cal,
        proteinG: r.nutritionProtein,
        fatG: r.nutritionFat,
        carbsG: r.nutritionCarbs,
      },
      reviews: { count: reviewStats.count },
    };
  }

  private mapReview(rev: RecipeReview): ReviewItemResponse {
    return {
      id: rev.id,
      rating: rev.rating,
      body: rev.body,
      user: { id: rev.user.id, email: rev.user.email },
      createdAt: rev.createdAt.toISOString(),
    };
  }

  private async findRecipeForApi(id: string): Promise<Recipe> {
    const found = await this.recipeRepo.findOne({
      where: { id },
      relations: { ingredients: true, steps: true },
    });
    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }

  async generateAndSave(): Promise<RecipePageResponse> {
    const { recipe } = buildMockRecipeGraph();
    const saved = await this.recipeRepo.save(recipe);
    const stats = await this.getReviewStats(saved.id);
    return this.toResponse(saved, stats);
  }

  async findById(id: string): Promise<RecipePageResponse> {
    const found = await this.findRecipeForApi(id);
    const stats = await this.getReviewStats(id);
    return this.toResponse(found, stats);
  }

  async listReviews(
    recipeId: string,
    query: ListReviewsQueryDto,
  ): Promise<{ count: number; items: ReviewItemResponse[] }> {
    await this.ensureRecipeExists(recipeId);
    const take = query.limit ?? 20;
    const skip = query.offset ?? 0;
    const [rows, count] = await this.reviewRepo.findAndCount({
      where: { recipe: { id: recipeId } },
      relations: { user: true },
      order: { createdAt: 'DESC' },
      take,
      skip,
    });
    return { count, items: rows.map((row) => this.mapReview(row)) };
  }

  private async ensureRecipeExists(id: string): Promise<void> {
    const n = await this.recipeRepo.count({ where: { id } });
    if (n === 0) throw new NotFoundException();
  }

  async createReview(
    recipeId: string,
    user: Pick<User, 'id' | 'email'>,
    dto: CreateReviewDto,
  ): Promise<ReviewItemResponse> {
    const recipe = await this.recipeRepo.findOne({ where: { id: recipeId } });
    if (!recipe) {
      throw new NotFoundException();
    }
    const existing = await this.reviewRepo.findOne({
      where: { recipe: { id: recipeId }, user: { id: user.id } },
    });
    if (existing) {
      throw new ConflictException('You already left a review for this recipe');
    }
    const row = this.reviewRepo.create({
      recipe,
      user: { id: user.id } as User,
      rating: dto.rating,
      body: dto.body?.trim() ? dto.body.trim() : null,
    });
    const saved = await this.reviewRepo.save(row);
    const withUser = await this.reviewRepo.findOneOrFail({
      where: { id: saved.id },
      relations: { user: true },
    });
    return this.mapReview(withUser);
  }
}
