import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const footer = fs.readFileSync(path.join(root, 'partials/footer.html'), 'utf8').trim();
const banner = fs.readFileSync(path.join(root, 'partials/research-banner.html'), 'utf8').trim();

const SKIP_DIRS = new Set(['partials', 'scripts', 'node_modules', '.git']);

const SKIP = new Set([
  '404.html',
  'news.html',
  'corridor.html',
  'news/index.html',
  'corridor/index.html',
  'studio/for-investors/index.html',
]);

const CANONICAL = {
  'index.html': 'https://caiglobal.ai/',
  'team.html': 'https://caiglobal.ai/team.html',
  'studio.html': 'https://caiglobal.ai/studio.html',
  'portfolio.html': 'https://caiglobal.ai/portfolio.html',
  'connect.html': 'https://caiglobal.ai/connect.html',
  'terms.html': 'https://caiglobal.ai/terms.html',
  'privacy.html': 'https://caiglobal.ai/privacy.html',
  'content/index.html': 'https://caiglobal.ai/content/',
  'ecosystem/index.html': 'https://caiglobal.ai/ecosystem/',
  'ecosystem/network/index.html': 'https://caiglobal.ai/ecosystem/network/',
  'ecosystem/corridor/index.html': 'https://caiglobal.ai/ecosystem/corridor/',
  'ecosystem/suzhou/index.html': 'https://caiglobal.ai/ecosystem/suzhou/',
  'future-leaders/index.html': 'https://caiglobal.ai/future-leaders/',
  'studio/for-founders/index.html': 'https://caiglobal.ai/studio/for-founders/',
  'studio/for-companies/index.html': 'https://caiglobal.ai/studio/for-companies/',
  'studio/for-partners/index.html': 'https://caiglobal.ai/studio/for-partners/',
};

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

function relFromRoot(file) {
  return path.relative(root, file).split(path.sep).join('/');
}

function syncFooter(content) {
  if (!content.includes('<footer>')) return content;
  return content.replace(/<footer>[\s\S]*?<\/footer>/, footer);
}

function syncBanner(content) {
  const bannerBlock = banner + '\n\n';
  const existing = /<div class="research-banner">[\s\S]*?<\/div>\r?\n<\/div>\r?\n<\/div>\r?\n\r?\n(?=<header>)/;
  if (existing.test(content)) return content.replace(existing, bannerBlock);
  return content.replace(/(<body>\r?\n\r?\n)/, `$1${bannerBlock}`);
}

function syncCanonical(content, rel) {
  const url = CANONICAL[rel];
  if (!url) return content;
  const tag = `<link rel="canonical" href="${url}">`;
  if (content.includes('rel="canonical"')) {
    return content.replace(/<link rel="canonical" href="[^"]*">/, tag);
  }
  return content.replace('</head>', `${tag}\n</head>`);
}

function syncScript(content) {
  return content.replace(
    '<script src="/js/main.js"></script>',
    '<script src="/js/main.js" defer></script>'
  );
}

let updated = 0;
for (const file of walk(root)) {
  const rel = relFromRoot(file);
  if (SKIP.has(rel)) continue;

  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  content = syncFooter(content);
  content = syncBanner(content);
  content = syncCanonical(content, rel);
  content = syncScript(content);

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('updated:', rel);
    updated += 1;
  }
}

console.log(`Done. ${updated} file(s) updated.`);
