import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const prismaDir = join(rootDir, 'generated/prisma');

function findTsFiles(dir, fileList = []) {
  const files = readdirSync(dir);
  
  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      findTsFiles(filePath, fileList);
    } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

const tsFiles = findTsFiles(prismaDir);

tsFiles.forEach(tsFile => {
  const content = readFileSync(tsFile, 'utf-8');
  
  // Remove TypeScript-specific syntax
  const jsContent = content
    .replace(/import\s+type\s+/g, 'import ')
    .replace(/export\s+type\s+/g, 'export ');
  
  const jsFile = tsFile.replace(/\.ts$/, '.js');
  writeFileSync(jsFile, jsContent, 'utf-8');
  console.log(`✓ Converted ${tsFile.replace(rootDir + '/', '')} -> ${jsFile.replace(rootDir + '/', '')}`);
});

console.log(`\n✓ Converted ${tsFiles.length} TypeScript files to JavaScript`);
