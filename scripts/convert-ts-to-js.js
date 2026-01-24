import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Find all .ts files in generated/prisma (except .d.ts)
const files = glob.sync('generated/prisma/**/*.ts', {
  cwd: rootDir,
  ignore: ['**/*.d.ts']
});

files.forEach(file => {
  const fullPath = join(rootDir, file);
  const content = readFileSync(fullPath, 'utf-8');
  
  // Remove TypeScript-specific syntax
  let jsContent = content
    // Remove 'import type' -> 'import'
    .replace(/import\s+type\s+/g, 'import ')
    // Remove type-only exports
    .replace(/export\s+type\s+/g, 'export ')
    // Remove type annotations in function parameters (basic cases)
    .replace(/:\s*[A-Za-z][A-Za-z0-9<>[\]|&,.\s]*(\s*=\s*[^,)]+)?/g, (match, defaultValue) => {
      // Only remove if it's a type annotation, keep default values
      return defaultValue || '';
    });
  
  const jsPath = file.replace(/\.ts$/, '.js');
  writeFileSync(join(rootDir, jsPath), jsContent, 'utf-8');
  console.log(`Converted ${file} -> ${jsPath}`);
});
