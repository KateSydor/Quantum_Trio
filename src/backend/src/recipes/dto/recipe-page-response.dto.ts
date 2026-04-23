import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class RecipeBannerDocDto {
  @ApiProperty({ enum: ['emoji'] })
  type: 'emoji';

  @ApiPropertyOptional({ type: String, nullable: true })
  value: string | null;
}

class RecipeMetaDocDto {
  @ApiProperty() timeLabel: string;
  @ApiProperty() servings: number;
  @ApiProperty() servingsLabel: string;
  @ApiProperty() caloriesLabel: string;
  @ApiProperty() rating: number;
}

class RecipeTagItemDocDto {
  @ApiProperty() key: string;
  @ApiProperty() label: string;
}

class ChefTipDocDto {
  @ApiProperty() title: string;
  @ApiPropertyOptional({ type: String, nullable: true })
  body: string | null;
}

class RecipeIngredientDocDto {
  @ApiProperty() id: string;
  @ApiProperty() position: number;
  @ApiPropertyOptional({ type: String, nullable: true })
  emoji: string | null;
  @ApiProperty() name: string;
  @ApiProperty() amount: string;
}

class RecipeStepDocDto {
  @ApiProperty() position: number;
  @ApiProperty() text: string;
}

class NutritionPerServingDocDto {
  @ApiProperty() calories: number;
  @ApiProperty() proteinG: number;
  @ApiProperty() fatG: number;
  @ApiProperty() carbsG: number;
}

class ReviewsSummaryDocDto {
  @ApiProperty({
    description:
      'Count of rows in `recipe_reviews` (use GET /recipes/{id}/reviews for the list).',
  })
  count: number;
}

/** OpenAPI model for a single recipe (recipe page payload). */
export class RecipePageResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() title: string;
  @ApiPropertyOptional({ type: String, nullable: true })
  titleEmphasis: string | null;

  @ApiProperty({ type: RecipeBannerDocDto })
  banner: RecipeBannerDocDto;

  @ApiProperty() isAiGenerated: boolean;
  @ApiProperty({ type: RecipeMetaDocDto })
  meta: RecipeMetaDocDto;

  @ApiProperty({ type: [RecipeTagItemDocDto] })
  tags: RecipeTagItemDocDto[];

  @ApiProperty({ type: ChefTipDocDto })
  chefTip: ChefTipDocDto;

  @ApiProperty({ type: [RecipeIngredientDocDto] })
  ingredients: RecipeIngredientDocDto[];

  @ApiProperty({ type: [RecipeStepDocDto] })
  steps: RecipeStepDocDto[];

  @ApiProperty({ type: NutritionPerServingDocDto })
  nutritionPerServing: NutritionPerServingDocDto;

  @ApiProperty({ type: ReviewsSummaryDocDto })
  reviews: ReviewsSummaryDocDto;
}
