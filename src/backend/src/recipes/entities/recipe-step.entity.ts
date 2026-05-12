import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Recipe } from './recipe.entity';

@Entity('recipe_steps')
export class RecipeStep {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  position: number;

  @Column({ type: 'text' })
  instruction: string;

  @ManyToOne(() => Recipe, (r) => r.steps, { onDelete: 'CASCADE' })
  recipe: Recipe;
}
