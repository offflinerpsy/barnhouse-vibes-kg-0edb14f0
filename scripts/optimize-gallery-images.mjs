/**
 * Gallery Image Optimization Script
 * Converts PNG images to optimized WebP format
 * 
 * Usage: node scripts/optimize-gallery-images.mjs
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GALLERY_DIR = path.join(__dirname, '../public/gallery');
const OUTPUT_DIR = path.join(__dirname, '../public/gallery/optimized');

// Optimization settings
const CONFIG = {
  maxWidth: 1920,
  webpQuality: 82,
  effort: 6, // Higher = better compression, slower
};

async function optimizeImages() {
  console.log('🖼️  Gallery Image Optimization');
  console.log('================================\n');
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`📁 Created output directory: ${OUTPUT_DIR}\n`);
  }

  // Get all PNG files
  const files = fs.readdirSync(GALLERY_DIR)
    .filter(file => file.endsWith('.png'));

  if (files.length === 0) {
    console.log('No PNG files found in gallery directory.');
    return;
  }

  console.log(`Found ${files.length} PNG files to optimize:\n`);

  let totalOriginal = 0;
  let totalOptimized = 0;

  for (const file of files) {
    const inputPath = path.join(GALLERY_DIR, file);
    const outputFile = file.replace('.png', '.webp');
    const outputPath = path.join(OUTPUT_DIR, outputFile);

    // Get original file size
    const originalSize = fs.statSync(inputPath).size;
    totalOriginal += originalSize;

    try {
      // Get image metadata
      const metadata = await sharp(inputPath).metadata();
      
      // Calculate new width (max 1920px)
      const newWidth = Math.min(metadata.width, CONFIG.maxWidth);

      // Optimize and convert to WebP
      await sharp(inputPath)
        .resize(newWidth, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({
          quality: CONFIG.webpQuality,
          effort: CONFIG.effort,
          lossless: false
        })
        .toFile(outputPath);

      // Get optimized file size
      const optimizedSize = fs.statSync(outputPath).size;
      totalOptimized += optimizedSize;

      // Calculate savings
      const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
      const originalMB = (originalSize / 1024 / 1024).toFixed(2);
      const optimizedKB = (optimizedSize / 1024).toFixed(0);

      console.log(`✅ ${file}`);
      console.log(`   ${metadata.width}x${metadata.height} → ${newWidth}px width`);
      console.log(`   ${originalMB} MB → ${optimizedKB} KB (${savings}% smaller)\n`);

    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }

  // Summary
  console.log('================================');
  console.log('📊 SUMMARY');
  console.log('================================');
  console.log(`Total original: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total optimized: ${(totalOptimized / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total savings: ${((totalOriginal - totalOptimized) / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Compression ratio: ${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%`);
  console.log(`\n📁 Optimized files saved to: ${OUTPUT_DIR}`);
  console.log('\n💡 Next steps:');
  console.log('   1. Review optimized images');
  console.log('   2. Move them to replace originals');
  console.log('   3. Update Gallery.tsx to use .webp extension');
}

optimizeImages().catch(console.error);
