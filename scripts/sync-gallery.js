import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGES_ROOT = path.join(__dirname, '..', 'public', 'images');
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'data', 'gallery.json');
const VALID_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
const SKIP_FOLDERS = ['backgrounds', 'inspo', 'logos'];

function normalizeName(name) {
  return name.replace(/\s+/g, ' ').trim();
}

function extractYear(folderName) {
  const match = folderName.match(/\b(20\d{2})\b/);
  return match ? parseInt(match[1], 10) : 2026;
}

function extractCategory(folderName) {
  const normalized = normalizeName(folderName);
  const withoutYear = normalized.replace(/\b(20\d{2})\b/, '').trim();
  return withoutYear.toLowerCase();
}

function assignTab(category) {
  const lower = category.toLowerCase();

  if (lower.includes('regcon') || lower.includes('regional convention')) {
    return '';
  }
  if (lower.includes('samagam')) {
    return 'samagam';
  }
  if (lower.includes('sangam')) {
    return 'sangam';
  }
  if (lower.includes('virasat')) {
    return 'virasat';
  }
  if (lower.includes('concert') || lower.includes('orientation')) {
    return 'orientation concert';
  }
  if (lower.includes('trip')) {
    return 'yatra';
  }
  if (lower.includes('talk') || lower.includes('workshop')) {
    return 'invited talks';
  }

  return 'performances';
}

function getImageFilesRecursive(dir, baseDir = dir) {
  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);

    if (entry.isDirectory()) {
      files = files.concat(getImageFilesRecursive(fullPath, baseDir));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (VALID_EXTENSIONS.includes(ext)) {
        files.push(relativePath);
      }
    }
  }

  return files;
}

function main() {
  if (!fs.existsSync(IMAGES_ROOT)) {
    console.error(`Images directory not found: ${IMAGES_ROOT}`);
    process.exit(1);
  }

  const entries = [];
  const allEntries = fs.readdirSync(IMAGES_ROOT, { withFileTypes: true });

  for (const entry of allEntries) {
    if (!entry.isDirectory()) continue;
    if (SKIP_FOLDERS.includes(entry.name)) continue;

    const folderName = entry.name;
    const normalizedFolder = normalizeName(folderName);
    const folderPath = path.join(IMAGES_ROOT, folderName);
    const images = getImageFilesRecursive(folderPath);

    console.log(`\n--- Scanning: ${normalizedFolder} ---`);
    console.log(`Resolved path: ${folderPath}`);
    console.log(`Found ${images.length} image(s):`, images);

    if (images.length === 0) {
      console.log(`No images found in ${normalizedFolder}`);
      continue;
    }

    const category = extractCategory(normalizedFolder);
    const year = extractYear(normalizedFolder);
    const tab = assignTab(category);

    for (const image of images) {
      entries.push({
        src: `/images/${folderName}/${image}`,
        alt: `${category} photograph`,
        category,
        year,
        tab
      });
    }

    console.log(`Processed ${images.length} images from ${normalizedFolder} (category: ${category}, year: ${year})`);
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(entries, null, 2));
  console.log(`\nTotal records written: ${entries.length}`);
  console.log(`Output written to: ${OUTPUT_FILE}`);
}

main();