import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const brainDir = 'C:/Users/P Swyom Sanjog/.gemini/antigravity-ide/brain/b667c846-7a16-4461-8c4f-d6113b57314d';
const targetDir = 'e:/web/public/images/projects';

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const mapping = [
  {
    id: 'ecommerce-storefront',
    source: 'project_ecommerce_1792604613061.jpg',
  },
  {
    id: 'fitness-tracking-app',
    source: 'project_fitness_1792604629838.jpg',
  },
  {
    id: 'lead-generation-campaign',
    source: 'project_lead_gen_1792604649881.jpg',
  },
  {
    id: 'product-launch-reel',
    source: 'project_launch_reel_1792604669538.jpg',
  },
  {
    id: 'cafe-brand-identity',
    source: 'project_cafe_brand_1792604689054.jpg',
  },
  {
    id: 'saas-analytics-dashboard',
    source: 'project_saas_dashboard_1792604720967.jpg',
  },
  {
    id: 'food-ordering-app',
    source: 'project_food_app_1792604742883.jpg',
  },
  {
    id: 'creator-portfolio-website',
    source: 'project_creator_portfolio_1792604763131.jpg',
  },
];

async function processImages() {
  for (const item of mapping) {
    const srcPath = path.join(brainDir, item.source);
    if (!fs.existsSync(srcPath)) {
      console.error(`Missing source: ${srcPath}`);
      continue;
    }
    const webpPath = path.join(targetDir, `${item.id}.webp`);
    const jpgPath = path.join(targetDir, `${item.id}.jpg`);
    const avifPath = path.join(targetDir, `${item.id}.avif`);

    console.log(`Processing ${item.id}...`);

    // WebP (1600px width max for crisp display on 4k and retina displays)
    await sharp(srcPath)
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 86 })
      .toFile(webpPath);

    // AVIF
    await sharp(srcPath)
      .resize({ width: 1600, withoutEnlargement: true })
      .avif({ quality: 80 })
      .toFile(avifPath);

    // JPG fallback
    await sharp(srcPath)
      .resize({ width: 1600, withoutEnlargement: true })
      .jpeg({ quality: 85, progressive: true })
      .toFile(jpgPath);

    console.log(`Finished ${item.id}`);
  }
}

processImages().catch(console.error);
