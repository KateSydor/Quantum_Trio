import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from './config/app-config.module';
import type { AppConfiguration } from './config/configuration';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
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
        const base = {
          type: 'postgres' as const,
          entities: [User, Recipe, RecipeIngredient, RecipeStep, RecipeReview],
          synchronize: db.synchronize,
          logging: db.logging,
          ssl: db.url ? { rejectUnauthorized: false } : false,
        };
        // Use DATABASE_URL (Render) when available, otherwise individual vars
        if (db.url) {
          return { ...base, url: db.url };
        }
        return { ...base, host: db.host, port: db.port, username: db.username, password: db.password, database: db.name };
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api/(.*)', '/auth/(.*)', '/health', '/docs(.*)'],
    }),
    UsersModule,
    AuthModule,
    RecipesModule,
    HealthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
