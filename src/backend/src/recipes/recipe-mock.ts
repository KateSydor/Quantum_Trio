import { Recipe, RecipeTagJson } from './entities/recipe.entity';
import { RecipeIngredient } from './entities/recipe-ingredient.entity';
import { RecipeStep } from './entities/recipe-step.entity';

const BANNERS = ['🥚', '🥗', '🍲', '🥣', '🌯', '🍝', '🥘', '🥙'];

const TITLE_PAIRS: { full: string; em: string }[] = [
  { full: 'Кремовий рис з печеними овочами', em: 'рис' },
  { full: 'Салат з кіноа та сиром фета', em: 'кіноа' },
  { full: 'Гречана каша з грибами', em: 'каша' },
  { full: 'Томлена курка з паприкою', em: 'курка' },
  { full: 'Сирний омлет з зеленню', em: 'омлет' },
  { full: 'Овсяна каша з ягодами', em: 'крупа' },
];

const ING_POOL: { e: string; n: string; a: string }[] = [
  { e: '🥚', n: 'Яйця курячі', a: '3–4 штуки' },
  { e: '🥛', n: 'Вершки', a: '100 мл' },
  { e: '🧀', n: 'Пармезан тертий', a: '30 г' },
  { e: '🌿', n: 'Свіжий кріп/петрушка', a: '30 г' },
  { e: '🧂', n: 'Сіль та перець', a: 'за смаком' },
  { e: '🫒', n: 'Олія оливкова', a: '2 ст.л.' },
  { e: '🥔', n: 'Картопля', a: '2 шт.' },
  { e: '🥕', n: 'Морква', a: '1 шт.' },
  { e: '🧄', n: 'Часник', a: '2–3 зубчики' },
  { e: '🍄', n: 'Гриби', a: '200 г' },
  { e: '🍅', n: 'Помідори', a: '2 шт.' },
];

const STEP_TEMPLATES = (main: string) => [
  `Підготуй інгредієнти та наріж ${main} однаково для рівного приготування.`,
  'Розігрій пательню з олією на середньому вогні.',
  'Додай основу та обсмажуй, поки не з’явиться золотиста скоринка.',
  'Склопи вогонь, додай трави та спеції, перемішай акуратно.',
  'Спробуй на сіль і, за потреби, доведи баланс кислоти.',
  'Подавай теплим, за бажанням посип зеленню — смачного!',
];

const TIPS = [
  'Додай сік лайма в кінці — витягне всі кислотні ноти.',
  'Сіль краще розігрівати по шарах, а не одним разом в кінці.',
  'Залиш страву «відпочивати» 2–3 хвилини перед подачею — соки розподіляться.',
  'До зелених пюре додавай крижану воду, щоб колір лишався яскравим.',
];

const TAGS: [string, string][] = [
  ['vegetarian', 'Вегетаріанське'],
  ['quick', 'Швидко'],
  ['dinner', 'Вечеря'],
  ['breakfast', 'Сніданок'],
  ['easy', 'Легко'],
  ['gluten_free', 'Без глютену'],
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickTags(count: number): RecipeTagJson[] {
  const s = shuffle(TAGS).slice(0, count);
  return s.map(([key, label]) => ({ key, label }));
}

/**
 * Produces a fresh {@link Recipe} graph (not persisted) with random but coherent fields.
 */
export function buildMockRecipeGraph(): {
  recipe: Recipe;
} {
  const titlePick = pick(TITLE_PAIRS);
  const mainWord = 'овочі';
  const steps = STEP_TEMPLATES(mainWord);
  const ingCount = 4 + Math.floor(Math.random() * 3);
  const ings = shuffle(ING_POOL).slice(0, ingCount);
  const servings = 1 + Math.floor(Math.random() * 4);
  const prepMin = 10 + Math.floor(Math.random() * 36);
  const cal = 200 + Math.floor(Math.random() * 400);
  const protein = 10 + Math.floor(Math.random() * 25);
  const fat = 5 + Math.floor(Math.random() * 30);
  const carbs = 5 + Math.floor(Math.random() * 40);

  const recipe = new Recipe();
  recipe.title = titlePick.full;
  recipe.titleEmphasis = titlePick.em;
  recipe.bannerEmoji = pick(BANNERS);
  recipe.isAiGenerated = true;
  recipe.chefTip = pick(TIPS);
  recipe.prepTimeLabel = `${prepMin} хв`;
  recipe.servings = servings;
  recipe.caloriesKcal = cal;
  recipe.nutritionProtein = protein;
  recipe.nutritionFat = fat;
  recipe.nutritionCarbs = carbs;
  recipe.tags = pickTags(2);

  recipe.ingredients = ings.map((raw, i) => {
    const row = new RecipeIngredient();
    row.position = i;
    row.emoji = raw.e;
    row.name = raw.n;
    row.amount = raw.a;
    row.recipe = recipe;
    return row;
  });

  recipe.steps = steps.map((text, i) => {
    const s = new RecipeStep();
    s.position = i;
    s.instruction = text;
    s.recipe = recipe;
    return s;
  });

  return { recipe };
}
