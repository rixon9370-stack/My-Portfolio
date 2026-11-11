const fs = require('fs');
const path = require('path');

const rootDir = fs.existsSync(path.join(__dirname, '..', 'index.html'))
  ? path.join(__dirname, '..')
  : __dirname;

function minifyCSS(css) {
  return css
    // remove comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // remove @import for fonts (handled via <link rel="preload">)
    .replace(/@import\s+url\([^)]+\);\s*/g, '')
    // normalize whitespace
    .replace(/\s+/g, ' ')
    // remove spaces around symbols
    .replace(/\s*([{}:;,>~])\s*/g, '$1')
    // remove trailing semicolons before closing brace
    .replace(/;}/g, '}')
    .trim();
}

function minifyJS(js) {
  return js
    // remove block comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // remove line comments that don't look like URLs
    .replace(/(^|[^:])\/\/[^'\n\r"]*/g, '$1')
    // normalize whitespace
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n/g, '\n')
    .trim();
}

const cssPath = path.join(rootDir, 'assets', 'css', 'style.css');
const minCssPath = path.join(rootDir, 'assets', 'css', 'style.min.css');
const jsPath = path.join(rootDir, 'assets', 'js', 'app.js');
const minJsPath = path.join(rootDir, 'assets', 'js', 'app.min.js');

if (fs.existsSync(cssPath)) {
  const rawCSS = fs.readFileSync(cssPath, 'utf-8');
  const minCSS = minifyCSS(rawCSS);
  fs.writeFileSync(minCssPath, minCSS, 'utf-8');
  console.log(`style.css: ${rawCSS.length} bytes -> style.min.css: ${minCSS.length} bytes (-${Math.round((1 - minCSS.length / rawCSS.length) * 100)}%)`);
}

if (fs.existsSync(jsPath)) {
  const rawJS = fs.readFileSync(jsPath, 'utf-8');
  const minJS = minifyJS(rawJS);
  fs.writeFileSync(minJsPath, minJS, 'utf-8');
  console.log(`app.js: ${rawJS.length} bytes -> app.min.js: ${minJS.length} bytes (-${Math.round((1 - minJS.length / rawJS.length) * 100)}%)`);
}
