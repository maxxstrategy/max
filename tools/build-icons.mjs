import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';

// ایجاد __dirname در ماژول‌های ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// پیکربندی
const CONFIG = {
  input: {
    svgPath: path.join(__dirname, '../icons/svg/maxxlogos.master.svg')
  },
  output: {
    directory: path.join(__dirname, '../icons/png'),
    sizes: [16, 32, 48, 64, 96, 128, 180, 192, 256, 384, 512],
    prefix: 'icon'
  },
  compression: {
    level: 9,
    quality: 90
  },
  concurrencyLimit: 4
};

// سیستم لاگینگ
const logger = {
  info: (message) => console.log(`\x1b[36mℹ️ [INFO]\x1b[0m ${message}`),
  success: (message) => console.log(`\x1b[32m✅ [SUCCESS]\x1b[0m ${message}`),
  error: (message) => console.error(`\x1b[31m❌ [ERROR]\x1b[0m ${message}`),
  warn: (message) => console.warn(`\x1b[33m⚠️ [WARN]\x1b[0m ${message}`)
};

// بررسی وجود فایل
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// پردازش دسته‌ای
async function processBatch(batch, inputPath) {
  return Promise.all(batch.map(async (size) => {
    const outputPath = path.join(CONFIG.output.directory, `${CONFIG.output.prefix}-${size}x${size}.png`);
    
    try {
      await sharp(inputPath)
        .resize(size, size, {
          kernel: sharp.kernel.lanczos3,
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png({
          compressionLevel: CONFIG.compression.level,
          quality: CONFIG.compression.quality
        })
        .toFile(outputPath);
      
      logger.success(`Generated ${size}x${size} icon`);
      return { size, success: true };
    } catch (err) {
      logger.error(`Failed to generate ${size}x${size} icon: ${err.message}`);
      return { size, success: false, error: err.message };
    }
  }));
}

// تابع اصلی
async function generateIcons() {
  const startTime = Date.now();
  logger.info('Starting icon generation process...');
  
  try {
    // بررسی وجود فایل SVG
    if (!await fileExists(CONFIG.input.svgPath)) {
      throw new Error(`SVG file not found: ${CONFIG.input.svgPath}`);
    }
    
    // ایجاد پوشه خروجی
    await fs.mkdir(CONFIG.output.directory, { recursive: true });
    logger.info(`Output directory: ${CONFIG.output.directory}`);
    
    // پردازش دسته‌ای
    const batches = [];
    for (let i = 0; i < CONFIG.output.sizes.length; i += CONFIG.concurrencyLimit) {
      batches.push(CONFIG.output.sizes.slice(i, i + CONFIG.concurrencyLimit));
    }
    
    let successCount = 0;
    let failCount = 0;
    
    for (let i = 0; i < batches.length; i++) {
      logger.info(`Processing batch ${i + 1}/${batches.length}...`);
      
      const results = await processBatch(batches[i], CONFIG.input.svgPath);
      
      results.forEach(result => {
        if (result.success) {
          successCount++;
        } else {
          failCount++;
        }
      });
    }
    
    // خلاصه نتایج
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    logger.info(`Process completed in ${duration} seconds`);
    logger.info(`Results: ${successCount} successful, ${failCount} failed`);
    
    if (failCount > 0) {
      logger.warn('Some icons failed to generate. Check the errors above.');
      process.exit(1);
    } else {
      logger.success('All icons generated successfully!');
    }
    
  } catch (err) {
    logger.error(`Fatal error: ${err.message}`);
    process.exit(1);
  }
}

// اجرای اسکریپت
generateIcons();