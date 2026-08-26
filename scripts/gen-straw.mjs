import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

const zai = await ZAI.create();
const res = await zai.images.generations.create({
  prompt:
    'Photography of two whole fresh ripe red strawberries with green leaves standing upright next to each other, fully visible with generous empty margin around them, isolated on a solid pure bright chroma key green screen background #00FF00 filling the entire background evenly, no shadow, soft studio light, food photography, photorealistic, high quality',
  size: '768x768',
});
const b64 = res?.data?.[0]?.base64;
if (!b64) throw new Error('empty');
fs.writeFileSync(
  '/home/z/my-project/public/images/more/ingredient-strawberry.png',
  Buffer.from(b64, 'base64'),
);
console.log('OK');
