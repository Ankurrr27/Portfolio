const fs = require('fs');
const file = 'src/app/globals.css';
let c = fs.readFileSync(file, 'utf8');

// Find and replace the light theme block
const startMarker = "[data-theme='light'] {";
const endMarker = "\n}";

const startIdx = c.indexOf(startMarker);
if (startIdx === -1) { console.log('NOT FOUND'); process.exit(1); }

const endIdx = c.indexOf(endMarker, startIdx) + endMarker.length;

const newBlock = `[data-theme='light'] {
  --bg-dark: #f8f7ff;
  --text-main: #0a0a0a;
  --card-bg: rgba(0, 0, 0, 0.04);
  --border-color: rgba(0, 0, 0, 0.09);
  --primary-glow: rgba(124, 58, 237, 0.15);
  --section-bg-alt: #ede9ff;
  --muted-text: rgba(0,0,0,0.45);
  --faint-text: rgba(0,0,0,0.25);
  --grid-line: rgba(0,0,0,0.05);
  --card-surface: rgba(0,0,0,0.03);
  --card-border-color: rgba(0,0,0,0.09);
}

[data-theme='dark'] {
  --section-bg-alt: #080512;
  --muted-text: rgba(255,255,255,0.45);
  --faint-text: rgba(255,255,255,0.25);
  --grid-line: rgba(255,255,255,0.03);
  --card-surface: rgba(255,255,255,0.025);
  --card-border-color: rgba(255,255,255,0.07);
}`;

c = c.slice(0, startIdx) + newBlock + c.slice(endIdx);
fs.writeFileSync(file, c);
console.log('Done! Replaced block from index', startIdx, 'to', endIdx);
