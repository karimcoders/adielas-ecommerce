import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const OUT_DIR = '/home/z/my-project/public/images/more';

const jobs = [
  {
    file: 'can.png',
    size: '864x1152',
    prompt:
      'Professional product photography of an unbranded matte olive-green protein powder tub with white lid, clean blank label, tilted standing pose, on a solid soft sage green studio background, soft diffused lighting, gentle shadow, e-commerce supplement packshot, high quality, detailed, photorealistic',
  },
  {
    file: 'clip-shake.png',
    size: '1344x768',
    prompt:
      'Photo of a hand shaking a clear shaker bottle filled with creamy iced matcha green protein latte, dynamic splash inside bottle, solid sage green studio backdrop, bright soft lighting, lifestyle product photography, photorealistic, high quality',
  },
  {
    file: 'clip-morning.png',
    size: '1344x768',
    prompt:
      'Tall glass of iced matcha latte with milk layers and ice cubes on a sunlit kitchen counter, green tones, morning cozy atmosphere, shallow depth of field, lifestyle photography, photorealistic, high quality',
  },
  {
    file: 'clip-gym.png',
    size: '1344x768',
    prompt:
      'Fit woman in sportswear drinking a green matcha protein smoothie from a bottle after workout in a bright gym, towel on shoulders, natural window light, lifestyle photography, photorealistic, high quality',
  },
  {
    file: 'pouch-fudge.png',
    size: '768x1344',
    prompt:
      'Professional product photography of a single unbranded stand-up supplement flavour pouch, deep chocolate brown matte packaging with cream accent band, blank label, centered on a soft warm cream studio background, soft shadow, photorealistic, high quality',
  },
  {
    file: 'pough-vanilla-choc.png',
    size: '768x1344',
    prompt:
      'Professional product photography of a single unbranded stand-up supplement flavour pouch, warm beige packaging with dark chocolate chip accents and cream band, blank label, centered on a soft warm cream studio background, soft shadow, photorealistic, high quality',
  },
  {
    file: 'pouch-caramel.png',
    size: '768x1344',
    prompt:
      'Professional product photography of a single unbranded stand-up supplement flavour pouch, glossy caramel amber packaging with cream accent band, blank label, centered on a soft warm cream studio background, soft shadow, photorealistic, high quality',
  },
  {
    file: 'pouch-vanilla.png',
    size: '768x1344',
    prompt:
      'Professional product photography of a single unbranded stand-up supplement flavour pouch, light vanilla cream packaging with golden accent band, blank label, centered on a soft warm cream studio background, soft shadow, photorealistic, high quality',
  },
  {
    file: 'pouch-strawberry.png',
    size: '768x1344',
    prompt:
      'Professional product photography of a single unbranded stand-up supplement flavour pouch, soft strawberry pink packaging with cream accent band, blank label, centered on a soft warm cream studio background, soft shadow, photorealistic, high quality',
  },
];

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  const zai = await ZAI.create();

  for (const job of jobs) {
    const outPath = path.join(OUT_DIR, job.file);
    if (fs.existsSync(outPath)) {
      console.log(`skip (exists): ${job.file}`);
      continue;
    }
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
        console.log(`✓ ${job.file} (${job.size})`);
        ok = true;
      } catch (err) {
        console.error(`✗ attempt ${attempt} ${job.file}: ${err.message}`);
        if (attempt < 3) await new Promise((r) => setTimeout(r, 1500 * attempt));
      }
    }
    if (!ok) console.error(`FAILED: ${job.file}`);
  }
  console.log('done');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
