import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";
import path from "path";

const OUT = "/home/z/my-project/public/images/adielas";
fs.mkdirSync(OUT, { recursive: true });

const STYLE =
  ", premium matte ceramic jar in warm off-white cream with a wooden bamboo-finish lid, minimal apothecary-style front label design for an organic children's nutrition brand, tiny lowercase wordmark 'adielas' on the label, standing centered on a seamless solid warm ivory beige studio background, soft diffused daylight, gentle soft floor shadow, a few scattered golden millet grains and ragi millet sprigs at the base, photorealistic professional product photography, ultra sharp, high quality";

const JOBS = [
  {
    out: "jar-stage1.png",
    prompt:
      "Single supplement jar with a soft butter-yellow wooden lid, clean minimal label reading 'STAGE 1' 'sprouted ragi' '400 g' with small illustration of a millet sprig" +
      STYLE,
  },
  {
    out: "jar-stage2.png",
    prompt:
      "Single supplement jar with a warm terracotta-caramel wooden lid, clean minimal label reading 'STAGE 2' 'multigrain' '400 g' with small illustration of wheat stalks" +
      STYLE,
  },
  {
    out: "jar-stage3.png",
    prompt:
      "Single supplement jar with a deep maroon-brown wooden lid, clean minimal label reading 'STAGE 3' 'dry fruits' '400 g' with small illustration of almonds and cashews" +
      STYLE,
  },
  {
    out: "jar-open.png",
    prompt:
      "Open cream ceramic nutrition jar filled with golden sprouted ragi grain powder, its butter-yellow wooden lid lying beside it on the surface, a small wooden spoon dusted with powder resting across the jar mouth" +
      STYLE,
  },
  {
    out: "jar-trio.png",
    prompt:
      "Three matching supplement jars standing side by side, one with butter-yellow lid labelled 'STAGE 1', one with terracotta-caramel lid labelled 'STAGE 2', one with deep maroon-brown lid labelled 'STAGE 3'" +
      STYLE,
  },
];

async function main() {
  const zai = await ZAI.create();
  for (const job of JOBS) {
    const dest = path.join(OUT, job.out);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 60000) {
      console.log(`skip ${job.out} (exists)`);
      continue;
    }
    let ok = false;
    for (let attempt = 1; attempt <= 3 && !ok; attempt++) {
      try {
        const res = await zai.images.generations.create({
          prompt: job.prompt,
          size: "1024x1024",
        });
        const b64 = res?.data?.[0]?.base64;
        if (!b64) throw new Error("empty response");
        fs.writeFileSync(dest, Buffer.from(b64, "base64"));
        console.log(`✓ ${job.out}`);
        ok = true;
      } catch (e) {
        console.error(`✗ ${job.out} attempt ${attempt}: ${e.message}`);
        await new Promise((r) => setTimeout(r, 1500 * attempt));
      }
    }
    if (!ok) process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
