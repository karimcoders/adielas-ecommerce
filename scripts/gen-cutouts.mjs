import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const OUT_DIR = '/home/z/my-project/public/images/more';

const jobs = [
  {
    file: 'can-green.png',
    size: '864x1152',
    prompt:
      'Professional product photography of an unbranded matte olive-green protein powder tub with white lid, clean blank white label, standing upright straight pose facing camera, isolated on a solid pure bright chroma key green screen background #00FF00 filling the entire background evenly, no shadow on background, studio lighting on product only, e-commerce packshot, photorealistic, high quality',
  },
  {
    file: 'ingredient-cookie.png',
    size: '768x768',
    prompt:
      'Photography of a small stack of three golden-brown chocolate chip cookies, isolated on a solid pure bright chroma key green screen background #00FF00 filling the entire background evenly, no shadow, soft studio light, food photography, photorealistic, high quality',
  },
  {
    file: 'ingredient-strawberry.png',
    size: '768x768',
    prompt:
      'Photography of two fresh ripe red strawberries with green leaves, isolated on a solid pure bright chroma key green screen background #00FF00 filling the entire background evenly, no shadow, soft studio light, food photography, photorealistic, high quality',
  },
];

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  const zai = await ZAI.create();

  for (const job of jobs) {
    const outPath = path.join(OUT_DIR, job.file);
    let ok = false;
    for (let attempt = 1; attempt <= 3 && !ok; attempt++) {
      try {
        const res = await zai.images.generations.create({
          prompt: job.prompt,
          size: job.size,
        });
        const b64 = res?.data?.[0]?.base64;
        if (!b64) throw new Error('empty base64');
        fs.writeFileSync(outPath, Buffer.from(b64, 'base64'));
        console.log(`OK ${job.file} (${job.size})`);
        ok = true;
      } catch (err) {
        console.error(`FAIL attempt ${attempt} ${job.file}: ${err.message}`);
        if (attempt < 3) await new Promise((r) => setTimeout(r, 1500 * attempt));
      }
    }
    if (!ok) console.error(`GAVE UP: ${job.file}`);
  }
  console.log('done');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
