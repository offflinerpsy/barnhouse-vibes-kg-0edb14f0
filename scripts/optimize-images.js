import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join, extname, basename, dirname } from 'path';

const CATALOG_PATH = './public/catalog';
const OUTPUT_PATH = './public/catalog-optimized';

// Settings for optimization
const WEBP_QUALITY = 75; // Good balance between quality and size
const MAX_WIDTH = 1920; // Max width for gallery images
const MAX_WIDTH_THUMBNAIL = 800; // For thumbnails
const MAX_WIDTH_FLOOR_PLAN = 1400; // For floor plans

async function getAllFiles(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getAllFiles(fullPath));
    } else if (['.webp', '.jpg', '.jpeg', '.png'].includes(extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }
  
  return files;
}

async function optimizeImage(inputPath, outputPath) {
  const filename = basename(inputPath).toLowerCase();
  const dirName = dirname(inputPath);
  
  // Determine max width based on folder type
  let maxWidth = MAX_WIDTH;
  if (dirName.includes('floor-plan')) {
    maxWidth = MAX_WIDTH_FLOOR_PLAN;
  } else if (filename.includes('thumb') || filename.includes('preview')) {
    maxWidth = MAX_WIDTH_THUMBNAIL;
  }
  
  const inputStats = await stat(inputPath);
  
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // Resize if needed
    let pipeline = image;
    if (metadata.width > maxWidth) {
      pipeline = pipeline.resize(maxWidth, null, {
        withoutEnlargement: true,
        fit: 'inside'
      });
    }
    
    // Output as optimized WebP
    await pipeline
      .webp({ 
        quality: WEBP_QUALITY,
        effort: 6, // Higher compression effort
        nearLossless: false
      })
      .toFile(outputPath);
    
    const outputStats = await stat(outputPath);
    const savings = ((inputStats.size - outputStats.size) / inputStats.size * 100).toFixed(1);
    const inputSizeMB = (inputStats.size / 1024 / 1024).toFixed(2);
    const outputSizeMB = (outputStats.size / 1024 / 1024).toFixed(2);
    
    console.log(`✅ ${basename(inputPath)}: ${inputSizeMB}MB → ${outputSizeMB}MB (${savings}% saved)`);
    
    return { input: inputStats.size, output: outputStats.size };
  } catch (error) {
    console.error(`❌ Error processing ${inputPath}:`, error.message);
    return { input: inputStats.size, output: inputStats.size };
  }
}

async function main() {
  console.log('🖼️  Starting image optimization...\n');
  
  const files = await getAllFiles(CATALOG_PATH);
  console.log(`Found ${files.length} images to optimize\n`);
  
  let totalInput = 0;
  let totalOutput = 0;
  
  for (const inputPath of files) {
    // Create output path
    const relativePath = inputPath.replace(CATALOG_PATH, '');
    const outputPath = join(OUTPUT_PATH, relativePath);
    
    // Ensure output directory exists
    await mkdir(dirname(outputPath), { recursive: true });
    
    const result = await optimizeImage(inputPath, outputPath);
    totalInput += result.input;
    totalOutput += result.output;
  }
  
  const totalInputMB = (totalInput / 1024 / 1024).toFixed(2);
  const totalOutputMB = (totalOutput / 1024 / 1024).toFixed(2);
  const totalSavings = ((totalInput - totalOutput) / totalInput * 100).toFixed(1);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`📊 TOTAL: ${totalInputMB}MB → ${totalOutputMB}MB`);
  console.log(`💾 Saved: ${(totalInput - totalOutput) / 1024 / 1024}MB (${totalSavings}%)`);
  console.log(`${'='.repeat(50)}`);
}

main().catch(console.error);
