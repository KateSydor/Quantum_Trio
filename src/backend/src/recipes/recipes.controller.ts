import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateReviewDto } from './dto/create-review.dto';
import { ListReviewsQueryDto } from './dto/list-reviews-query.dto';
import { RecipePageResponseDto } from './dto/recipe-page-response.dto';
import {
  ListReviewsResponseDto,
  ReviewItemResponseDto,
} from './dto/review-item-response.dto';
import { RecipesService } from './recipes.service';

@ApiTags('recipes')
@Controller()
export class RecipesController {
  constructor(private readonly recipes: RecipesService) {}

  @Post('generate')
  @ApiOperation({
    summary: 'Generate a mock recipe',
    description:
      'Builds random recipe data, saves it, and returns the full payload for the recipe page.',
  })
  @ApiCreatedResponse({ type: RecipePageResponseDto })
  generate() {
    return this.recipes.generateAndSave();
  }

  @Get('recipes/:id')
  @ApiOperation({ summary: 'Get recipe by id' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Recipe id' })
  @ApiOkResponse({ type: RecipePageResponseDto })
  @ApiNotFoundResponse({ description: 'Recipe not found' })
  getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.recipes.findById(id);
  }

  @Get('recipes/:id/reviews')
  @ApiOperation({ summary: 'List reviews (recipe_reviews table)' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Recipe id' })
  @ApiOkResponse({ type: ListReviewsResponseDto })
  @ApiNotFoundResponse({ description: 'Recipe not found' })
  listReviews(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: ListReviewsQueryDto,
  ) {
    return this.recipes.listReviews(id, query);
  }

  @Post('recipes/:id/reviews')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Add a review (one per user per recipe)' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Recipe id' })
  @ApiCreatedResponse({ type: ReviewItemResponseDto })
  @ApiNotFoundResponse({ description: 'Recipe not found' })
  @ApiConflictResponse({ description: 'User already reviewed this recipe' })
  addReview(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: { user: { id: string; email: string } },
    @Body() dto: CreateReviewDto,
  ) {
    return this.recipes.createReview(id, req.user, dto);
  }
}
