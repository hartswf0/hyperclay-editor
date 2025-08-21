#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const highlightRegex = /(BETTER|GREAT|BET)(?![A-Za-z])/i; // tags near end or standalone

function familyOf(filename) {
  const base = filename.replace(/\.[^.]+$/, '');
  // strip duplicate markers like " (1)"
  const stripped = base.replace(/ \(\d+\)$/,'');
  // normalize separators to underscore for tokenization
  const norm = stripped.replace(/[-\s]+/g,'_');
  const tokens = norm.split('_').filter(Boolean);
  if (tokens.length >= 3) return tokens.slice(0,3).join('_');
  return tokens.join('_');
}

function highlightTag(filename) {
  const base = filename.replace(/\.[^.]+$/, '');
  const m = base.match(highlightRegex);
  return m ? m[1].toUpperCase() : null;
}

function main() {
  const entries = fs.readdirSync(ROOT, { withFileTypes: true });
  const files = entries
    .filter(e => e.isFile())
    .map(e => e.name)
    .filter(name => name.toLowerCase().endsWith('.html'));

  const byFamily = {};
  for (const name of files) {
    const fam = familyOf(name);
    const tag = highlightTag(name);
    const item = {
      name,
      path: path.join(ROOT, name),
      family: fam,
      highlight: !!tag,
      highlightTag: tag,
    };
    if (!byFamily[fam]) byFamily[fam] = { family: fam, items: [] };
    byFamily[fam].items.push(item);
  }

  // Sort families and items for readability
  const families = Object.values(byFamily)
    .sort((a,b)=> a.family.localeCompare(b.family))
    .map(f => ({
      family: f.family,
      counts: {
        total: f.items.length,
        highlighted: f.items.filter(i=>i.highlight).length,
      },
      items: f.items.sort((a,b)=> a.name.localeCompare(b.name))
    }));

  const summary = {
    generatedAt: new Date().toISOString(),
    root: ROOT,
    totalFiles: files.length,
    familiesCount: families.length,
    highlightRule: "filename contains BET/BETTER/GREAT (case-insensitive)",
    families,
  };

  fs.writeFileSync(path.join(ROOT, 'manifest.json'), JSON.stringify(summary, null, 2));
  console.log(`Wrote manifest.json with ${files.length} files across ${families.length} families.`);
}

main();
