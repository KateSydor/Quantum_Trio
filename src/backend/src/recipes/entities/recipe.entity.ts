import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RecipeReview } from './recipe-review.entity';
import { RecipeIngredient } from './recipe-ingredient.entity';
import { RecipeStep } from './recipe-step.entity';

export type RecipeTagJson = { key: string; label: string };

@Entity('recipes')
export class Recipe {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ name: 'title_emphasis', type: 'text', nullable: true })
  titleEmphasis: string | null;

  @Column({ name: 'banner_emoji', type: 'text', nullable: true })
  bannerEmoji: string | null;

  @Column({ name: 'is_ai_generated', default: true })
  isAiGenerated: boolean;

  @Column({ name: 'chef_tip', type: 'text', nullable: true })
  chefTip: string | null;

  @Column({ name: 'prep_time_label', type: 'text' })
  prepTimeLabel: string;

  @Column({ type: 'int' })
  servings: number;

  @Column({ name: 'calories_kcal', type: 'int' })
  caloriesKcal: number;

  @Column({ name: 'nutrition_protein', type: 'int' })
  nutritionProtein: number;

  @Column({ name: 'nutrition_fat', type: 'int' })
  nutritionFat: number;

  @Column({ name: 'nutrition_carbs', type: 'int' })
  nutritionCarbs: number;

  @Column({ name: 'tags', type: 'jsonb' })
  tags: RecipeTagJson[];

  @OneToMany(() => RecipeIngredient, (i) => i.recipe, { cascade: true })
  ingredients: RecipeIngredient[];

  @OneToMany(() => RecipeStep, (s) => s.recipe, { cascade: true })
  steps: RecipeStep[];

  @OneToMany(() => RecipeReview, (r) => r.recipe)
  reviews: RecipeReview[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
