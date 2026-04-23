import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from './config/app-config.module';
import type { AppConfiguration } from './config/configuration';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { Recipe } from './recipes/entities/recipe.entity';
import { RecipeIngredient } from './recipes/entities/recipe-ingredient.entity';
import { RecipeReview } from './recipes/entities/recipe-review.entity';
import { RecipeStep } from './recipes/entities/recipe-step.entity';
import { RecipesModule } from './recipes/recipes.module';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<AppConfiguration>) => {
        const db = config.getOrThrow('database', { infer: true });
        return {
          type: 'postgres' as const,
          host: db.host,
          port: db.port,
          username: db.username,
          password: db.password,
          database: db.name,
          entities: [User, Recipe, RecipeIngredient, RecipeStep, RecipeReview],
          synchronize: db.synchronize,
          logging: db.logging,
        };
      },
    }),
    UsersModule,
    AuthModule,
    RecipesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
