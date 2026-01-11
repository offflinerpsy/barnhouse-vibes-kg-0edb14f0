/**
 * Advantages Images Optimization Script
 * Converts PNG images to optimized WebP format
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ADVANTAGES_DIR = path.join(__dirname, '../public/advantages');

const CONFIG = {
  maxWidth: 1920,
  webpQuality: 82,
  effort: 6,
};

async function optimizeImages() {
  console.log('🏠 Advantages Image Optimization');
  console.log('=================================\n');

  const files = fs.readdirSync(ADVANTAGES_DIR).filter(file => file.endsWith('.png'));

  if (files.length === 0) {
    console.log('No PNG files found.');
    return;
  }

  console.log(`Found ${files.length} PNG files to optimize:\n`);

  let totalOriginal = 0;
  let totalOptimized = 0;

  for (const file of files) {
    const inputPath = path.join(ADVANTAGES_DIR, file);
    const outputFile = file.replace('.png', '.webp');
    const outputPath = path.join(ADVANTAGES_DIR, outputFile);

    const originalSize = fs.statSync(inputPath).size;
    totalOriginal += originalSize;

    try {
      const metadata = await sharp(inputPath).metadata();
      const newWidth = Math.min(metadata.width, CONFIG.maxWidth);

      await sharp(inputPath)
        .resize(newWidth, null, { withoutEnlargement: true, fit: 'inside' })
        .webp({ quality: CONFIG.webpQuality, effort: CONFIG.effort, lossless: false })
        .toFile(outputPath);

      const optimizedSize = fs.statSync(outputPath).size;
      totalOptimized += optimizedSize;

      const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
      const originalKB = (originalSize / 1024).toFixed(0);
      const optimizedKB = (optimizedSize / 1024).toFixed(0);

      console.log(`✅ ${file} → ${outputFile}`);
      console.log(`   ${originalKB} KB → ${optimizedKB} KB (${savings}% smaller)\n`);

    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }

  // Remove original PNGs
  for (const file of files) {
    fs.unlinkSync(path.join(ADVANTAGES_DIR, file));
  }

  console.log('=================================');
  console.log('📊 SUMMARY');
  console.log('=================================');
  console.log(`Total original: ${(totalOriginal / 1024).toFixed(0)} KB`);
  console.log(`Total optimized: ${(totalOptimized / 1024).toFixed(0)} KB`);
  console.log(`Total savings: ${((totalOriginal - totalOptimized) / 1024).toFixed(0)} KB`);
  console.log(`Compression ratio: ${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%`);
  console.log('\n✅ Original PNG files removed, WebP files ready!');
}

optimizeImages().catch(console.error);
