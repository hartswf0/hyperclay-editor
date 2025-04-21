// Script: parse_slides_to_json.js
// Description: Parses all *SLIDE ENRICHED.md files in the directory, extracts slides, and outputs a combined slides.json.
// Usage: Run with `node parse_slides_to_json.js` in the 4_20_25s directory.

const fs = require('fs');
const path = require('path');

const SLIDE_PATTERN = /^(Slide \d+:|Slide [A-Za-z]+:|\d+: Slide \d+:)/;
const DIR = __dirname;
const OUTPUT = path.join(DIR, 'slides.json');

function parseSlidesFromFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split(/\r?\n/);
    let slides = [];
    let current = null;
    let slideTitle = '';
    let slideContent = [];
    
    for (let line of lines) {
        if (SLIDE_PATTERN.test(line.trim())) {
            // Save previous slide
            if (current) {
                slides.push({
                    title: slideTitle,
                    content: slideContent.join('\n').trim()
                });
            }
            slideTitle = line.replace(/^\d+:\s*/, '').replace(/^Slide [^:]+:/, '').trim();
            slideContent = [];
            current = true;
        } else {
            if (current) slideContent.push(line);
        }
    }
    // Push last slide
    if (current) {
        slides.push({
            title: slideTitle,
            content: slideContent.join('\n').trim()
        });
    }
    return slides;
}

function main() {
    const files = fs.readdirSync(DIR).filter(f => f.endsWith('SLIDE ENRICHED.md'));
    let allSlides = [];
    files.forEach(file => {
        const slides = parseSlidesFromFile(path.join(DIR, file));
        allSlides = allSlides.concat(slides.map(s => ({...s, source: file})));
    });
    fs.writeFileSync(OUTPUT, JSON.stringify(allSlides, null, 2));
    console.log(`Parsed ${allSlides.length} slides from ${files.length} files. Output: slides.json`);
}

main();
