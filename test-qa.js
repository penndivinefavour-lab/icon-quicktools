// QA Test Harness - ICON QuickTools
// Tests core utility functions extracted from each tool
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TOOLS_DIR = path.join(__dirname, 'js/tools');
let passed = 0;
let failed = 0;
const results = [];

function assert(name, condition, detail) {
  if (condition) {
    passed++;
    results.push({ status: 'PASS', name, detail });
  } else {
    failed++;
    results.push({ status: 'FAIL', name, detail });
  }
}

// === TEXT CLEANER ===
function cleanText(text, trim, collapse, blank, caseVal) {
  if (trim) text = text.trim();
  if (collapse) text = text.replace(/[ \t]+/g, ' ');
  if (blank) text = text.replace(/\n\s*\n/g, '\n');
  switch (caseVal) {
    case 'lower': text = text.toLowerCase(); break;
    case 'upper': text = text.toUpperCase(); break;
    case 'title': text = text.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()); break;
    case 'sentence': text = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(); break;
  }
  return text;
}

assert('Text Cleaner: trim', cleanText('  hello  ', true, false, false, 'none') === 'hello');
assert('Text Cleaner: collapse', cleanText('hello    world', false, true, false, 'none') === 'hello world');
assert('Text Cleaner: blank lines', cleanText('a\n\nb\n\nc', false, false, true, 'none') === 'a\nb\nc');
assert('Text Cleaner: lowercase', cleanText('HELLO WORLD', false, false, false, 'lower') === 'hello world');
assert('Text Cleaner: uppercase', cleanText('hello world', false, false, false, 'upper') === 'HELLO WORLD');
assert('Text Cleaner: title case', cleanText('hello world test', false, false, false, 'title') === 'Hello World Test');
assert('Text Cleaner: sentence case', cleanText('hello. world', false, false, false, 'sentence') === 'Hello. world');
assert('Text Cleaner: empty input', cleanText('', true, true, true, 'none') === '');
assert('Text Cleaner: no changes', cleanText('hello world', false, false, false, 'none') === 'hello world');
assert('Text Cleaner: all combined', cleanText('  HELLO   WORLD  ', true, true, false, 'lower') === 'hello world');

// === WORD COUNTER ===
function countStats(text) {
  if (!text) return { chars: 0, noSpaces: 0, words: 0, lines: 0, paragraphs: 0 };
  const chars = text.length;
  const noSpaces = text.replace(/\s/g, '').length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text.split('\n').length;
  const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim()).length : 0;
  return { chars, noSpaces, words, lines, paragraphs };
}

assert('Counter: basic', countStats('hello world').words === 2);
assert('Counter: chars', countStats('hello').chars === 5);
assert('Counter: no spaces', countStats('hello world').noSpaces === 10);
assert('Counter: lines', countStats('a\nb\nc').lines === 3);
assert('Counter: paragraphs', countStats('para one\n\npara two').paragraphs === 2);
assert('Counter: empty', JSON.stringify(countStats('')) === JSON.stringify({ chars: 0, noSpaces: 0, words: 0, lines: 0, paragraphs: 0 }));
assert('Counter: only spaces', countStats('   ').words === 0);
assert('Counter: multiline words', countStats('one two\nthree four').words === 4);

// === JSON FORMATTER ===
function validateJSON(text) {
  try { JSON.parse(text); return { valid: true }; }
  catch (e) { return { valid: false, error: e.message }; }
}
function formatJSON(text) { return JSON.stringify(JSON.parse(text), null, 2); }
function minifyJSON(text) { return JSON.stringify(JSON.parse(text)); }

assert('JSON: valid object', validateJSON('{"key":"value"}').valid === true);
assert('JSON: valid array', validateJSON('[1,2,3]').valid === true);
assert('JSON: invalid', validateJSON('{key: value}').valid === false);
assert('JSON: trailing comma', validateJSON('{"a":1,}').valid === false);
assert('JSON: empty string', validateJSON('').valid === false);
assert('JSON: format pretty', formatJSON('{"a":1,"b":2}').includes('\n'));
assert('JSON: format minify', minifyJSON('{\n  "a": 1\n}') === '{"a":1}');
assert('JSON: nested', validateJSON('{"a":{"b":{"c":1}}}').valid === true);
assert('JSON: unicode', validateJSON('{"emoji":"🎉"}').valid === true);

// === URL CODER ===
assert('URL: encode', encodeURIComponent('hello world!') === 'hello%20world!');
assert('URL: decode', decodeURIComponent('hello%20world%21') === 'hello world!');
assert('URL: encode special', encodeURIComponent('a=b&c=d') === 'a%3Db%26c%3Dd');
assert('URL: decode special', decodeURIComponent('a%3Db%26c%3Dd') === 'a=b&c=d');
assert('URL: encode unicode', encodeURIComponent('café') === 'caf%C3%A9');
assert('URL: roundtrip', decodeURIComponent(encodeURIComponent('hello world!@#$%')) === 'hello world!@#$%');

// === BASE64 ===
function encodeB64(text) { return Buffer.from(text, 'utf-8').toString('base64'); }
function decodeB64(text) { return Buffer.from(text, 'base64').toString('utf-8'); }

assert('Base64: encode', encodeB64('hello') === 'aGVsbG8=');
assert('Base64: decode', decodeB64('aGVsbG8=') === 'hello');
assert('Base64: roundtrip', decodeB64(encodeB64('Hello World 123!')) === 'Hello World 123!');
assert('Base64: empty', encodeB64('') === '');
assert('Base64: unicode', decodeB64(encodeB64('🎉')) === '🎉');
assert('Base64: long text', decodeB64(encodeB64('The quick brown fox jumps over the lazy dog')) === 'The quick brown fox jumps over the lazy dog');

// === PASSWORD GEN ===
function genPassword(length, upper, lower, numbers, symbols) {
  let chars = '';
  if (upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (lower) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (numbers) chars += '0123456789';
  if (symbols) chars += '!@#$%^&*()';
  if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';
  let pw = '';
  for (let i = 0; i < length; i++) pw += chars.charAt(Math.floor(Math.random() * chars.length));
  return pw;
}

const pw1 = genPassword(16, true, true, true, true);
assert('Password: length', pw1.length === 16);
const pw2 = genPassword(8, true, false, false, false);
assert('Password: only upper', pw2.length === 8 && pw2 === pw2.toUpperCase() && /^[A-Z]+$/.test(pw2));
const pw3 = genPassword(32, false, true, false, false);
assert('Password: only lower', pw3.length === 32 && pw3 === pw3.toLowerCase() && /^[a-z]+$/.test(pw3));
const pw4 = genPassword(12, false, false, true, false);
assert('Password: only digits', pw4.length === 12 && /^[0-9]+$/.test(pw4));
const pw5 = genPassword(20, true, true, true, true);
assert('Password: all sets', pw5.length === 20);
assert('Password: two different differ', genPassword(16,true,true,true,true) !== genPassword(16,true,true,true,true));

// === UUID GEN ===
function genUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const uuid = genUUID();
assert('UUID: format', /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(uuid));
assert('UUID: different each call', genUUID() !== genUUID());
assert('UUID: version 4', genUUID()[14] === '4');

// === TIMESTAMP ===
function formatDate(date) {
  const pad = n => String(n).padStart(2, '0');
  return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + ' ' +
         pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
}

const now = Date.now();
const tsSec = Math.floor(now / 1000);
assert('Timestamp: seconds > 0', tsSec > 1000000000);
assert('Timestamp: seconds < 2e9', tsSec < 2000000000);
const dateFromTs = new Date(tsSec * 1000);
assert('Timestamp: roundtrip seconds', Math.floor(dateFromTs.getTime() / 1000) === tsSec);
const dateFromMs = new Date(now);
assert('Timestamp: roundtrip ms', dateFromMs.getTime() === now);

// === COLOR CONVERTER ===
function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const num = parseInt(hex, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}
function rgbToHex(r, g, b) { return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join(''); }
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}
function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  if (s === 0) { r = g = b = l; }
  else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1; if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3); g = hue2rgb(p, q, h); b = hue2rgb(p, q, h - 1/3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

const rgb1 = hexToRgb('#6b21a8');
assert('Color: hex→rgb', rgb1.r === 107 && rgb1.g === 33 && rgb1.b === 168);
const hex1 = rgbToHex(107, 33, 168);
assert('Color: rgb→hex', hex1 === '#6b21a8');
const rgb2 = hexToRgb('#fff');
assert('Color: short hex', rgb2.r === 255 && rgb2.g === 255 && rgb2.b === 255);
const hsl1 = rgbToHsl(107, 33, 168);
assert('Color: rgb→hsl h', hsl1.h >= 269 && hsl1.h <= 273);
const rgbBack = hslToRgb(hsl1.h, hsl1.s, hsl1.l);
assert('Color: hsl→rgb roundtrip', Math.abs(rgbBack.r - 107) <= 2 && Math.abs(rgbBack.g - 33) <= 2 && Math.abs(rgbBack.b - 168) <= 2);
assert('Color: black', JSON.stringify(hexToRgb('#000000')) === JSON.stringify({r:0,g:0,b:0}));
assert('Color: white', JSON.stringify(hexToRgb('#ffffff')) === JSON.stringify({r:255,g:255,b:255}));

// === QR CODE ===
// Check QR library loaded
assert('QR: library file exists', fs.existsSync(path.join(__dirname, 'js/vendor/qrcode.min.js')));
const qrSize = fs.statSync(path.join(__dirname, 'js/vendor/qrcode.min.js')).size;
assert('QR: library non-empty', qrSize > 10000);

// === JS SYNTAX CHECK ===
const allFiles = ['js/app.js', ...fs.readdirSync(TOOLS_DIR).map(f => `js/tools/${f}`)];
for (const file of allFiles) {
  const code = fs.readFileSync(path.join(__dirname, file), 'utf-8');
  try {
    new Function(code);
    assert(`Syntax: ${file}`, true);
  } catch (e) {
    assert(`Syntax: ${file}`, false, e.message);
  }
}

// === HTML STRUCTURE ===
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
assert('HTML: DOCTYPE', html.includes('<!DOCTYPE html>'));
assert('HTML: viewport meta', html.includes('name="viewport"'));
assert('HTML: theme-color', html.includes('name="theme-color"'));
assert('HTML: Poppins font', html.includes('Poppins'));
assert('HTML: 10 tool scripts', (html.match(/js\/tools\//g) || []).length === 10);
assert('HTML: back buttons', (html.match(/back-btn/g) || []).length >= 1);
assert('HTML: search input', html.includes('id="search-input"'));
assert('HTML: category filters', html.includes('id="category-filters"'));
assert('HTML: tools grid', html.includes('id="tools-grid"'));

// === CSS STRUCTURE ===
const css = fs.readFileSync(path.join(__dirname, 'css/style.css'), 'utf-8');
assert('CSS: brand colors', css.includes('--purple: #6b21a8') && css.includes('--navy: #1a2744'));
assert('CSS: responsive breakpoints', css.includes('@media (min-width: 720px)'));
assert('CSS: mobile grid', css.includes('grid-template-columns'));
assert('CSS: poppins font', css.includes('Poppins'));
assert('CSS: tool card styles', css.includes('.tool-card'));
assert('CSS: toast styles', css.includes('.toast'));

// === PROJECT STRUCTURE ===
assert('Project: index.html', fs.existsSync(path.join(__dirname, 'index.html')));
assert('Project: style.css', fs.existsSync(path.join(__dirname, 'css/style.css')));
assert('Project: app.js', fs.existsSync(path.join(__dirname, 'js/app.js')));
assert('Project: 10 tools', fs.readdirSync(TOOLS_DIR).length === 10);
assert('Project: qrcode vendor', fs.existsSync(path.join(__dirname, 'js/vendor/qrcode.min.js')));

// === SERVER TEST ===
try {
  const res = execSync('curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/', { timeout: 5000 });
  assert('Server: HTTP 200', res.toString().trim() === '200');
} catch (e) {
  assert('Server: HTTP 200', false, e.message);
}

try {
  const cssRes = execSync('curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/css/style.css', { timeout: 5000 });
  assert('Server: CSS 200', cssRes.toString().trim() === '200');
} catch (e) {
  assert('Server: CSS 200', false, e.message);
}

try {
  const jsRes = execSync('curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/js/app.js', { timeout: 5000 });
  assert('Server: JS 200', jsRes.toString().trim() === '200');
} catch (e) {
  assert('Server: JS 200', false, e.message);
}

// === PRINT RESULTS ===
console.log('\n' + '='.repeat(60));
console.log(`ICON QuickTools QA TEST RESULTS`);
console.log('='.repeat(60));
const passList = results.filter(r => r.status === 'PASS');
const failList = results.filter(r => r.status === 'FAIL');

failList.forEach(r => console.log(`FAIL: ${r.name} - ${r.detail || ''}`));
console.log('');
passList.forEach(r => console.log(`PASS: ${r.name}`));

console.log('\n' + '-'.repeat(60));
console.log(`TOTAL: ${results.length} | PASS: ${passed} | FAIL: ${failed}`);
console.log('='.repeat(60));

if (failed > 0) process.exit(1);
