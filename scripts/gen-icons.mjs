import { PNG } from 'pngjs';
import { writeFileSync, mkdirSync } from 'node:fs';

const forest = [31, 53, 48]; // #1f3530
const gold = [224, 217, 133]; // #e0d985

function setPx(png, x, y, c) {
  if (x < 0 || y < 0 || x >= png.width || y >= png.height) return;
  const i = (png.width * y + x) << 2;
  png.data[i] = c[0];
  png.data[i + 1] = c[1];
  png.data[i + 2] = c[2];
  png.data[i + 3] = 255;
}
function rect(png, x0, y0, w, h, c) {
  for (let y = y0; y < y0 + h; y += 1) for (let x = x0; x < x0 + w; x += 1) setPx(png, x, y, c);
}
function icon(S) {
  const png = new PNG({ width: S, height: S });
  rect(png, 0, 0, S, S, forest);
  const bw = Math.round(S * 0.1);
  const gap = Math.round(S * 0.055);
  const heights = [0.3, 0.5, 0.38].map((h) => Math.round(S * h));
  const totalW = bw * 3 + gap * 2;
  let x = Math.round((S - totalW) / 2);
  const baseY = Math.round(S * 0.68);
  for (const h of heights) {
    rect(png, x, baseY - h, bw, h, gold);
    x += bw + gap;
  }
  return PNG.sync.write(png);
}

mkdirSync('public/icons', { recursive: true });
for (const S of [192, 512, 180]) writeFileSync(`public/icons/icon-${S}.png`, icon(S));
console.log('icons written: public/icons/icon-{192,512,180}.png');
