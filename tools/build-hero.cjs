const sharp = require("sharp");

(async () => {
  const src = "src/images/alpha_headshot.png";
  const outBase = "public/img/alpha_headshot";
  const width = 400; // 2x for ~200px display

  // AVIF + WebP keep transparency
  await sharp(src)
    .resize({ width })
    .avif({ quality: 45 })
    .toFile(`${outBase}.avif`);
  await sharp(src)
    .resize({ width })
    .webp({ quality: 70 })
    .toFile(`${outBase}.webp`);

  // JPG fallback (no transparency). Uncomment next line to set a background color:
  // const bg = { r: 255, g: 247, b: 209, alpha: 1 }; // cream sample
  // await sharp(src).resize({ width }).flatten({ background: bg }).jpeg({ quality: 72 }).toFile(`${outBase}.jpg`);

  // default: white background if you don't use flatten()
  await sharp(src)
    .resize({ width })
    .jpeg({ quality: 72 })
    .toFile(`${outBase}.jpg`);
})();
