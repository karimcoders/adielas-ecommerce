/* Fetch real payment-method logo PNGs via z-ai image-search, download best candidates. */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const run = promisify(execFile);
const OUT = "/home/z/my-project/public/images/pay";
await mkdir(OUT, { recursive: true });

const targets = [
  { name: "upi", q: "UPI payment logo icon transparent png India BHIM" },
  { name: "paytm", q: "Paytm logo transparent png" },
  { name: "phonepe", q: "PhonePe logo purple transparent png" },
  { name: "rupay", q: "RuPay card logo transparent png" },
  { name: "gpay", q: "Google Pay GPay logo transparent png" },
  { name: "visa", q: "Visa card logo blue transparent png" },
  { name: "mastercard", q: "Mastercard logo overlapping circles transparent png" },
  { name: "amazonpay", q: "Amazon Pay logo transparent png" },
];

async function searchOne(t) {
  try {
    const { stdout } = await run(
      "z-ai",
      ["image-search", "-q", t.q, "--count", "4", "--gl", "us", "--no-rank"],
      { timeout: 150000, maxBuffer: 1024 * 1024 * 8 },
    );
    const start = stdout.indexOf("{");
    const json = JSON.parse(stdout.slice(start));
    return { ...t, results: json.results || [] };
  } catch (e) {
    return { ...t, results: [], err: String(e).slice(0, 200) };
  }
}

const searched = await Promise.all(targets.map(searchOne));

for (const s of searched) {
  let ok = false;
  for (let i = 0; i < s.results.length && !ok; i++) {
    const url = s.results[i]?.original_url;
    if (!url) continue;
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 2000) continue; // too tiny, likely broken
      const ext = url.toLowerCase().includes(".jpg") || url.toLowerCase().includes(".jpeg") ? "jpg" : "png";
      const file = path.join(OUT, `${s.name}.${ext}`);
      await writeFile(file, buf);
      console.log(`OK  ${s.name} <- candidate ${i} (${buf.length} bytes, ${ext}) ${url}`);
      ok = true;
    } catch (e) {
      console.log(`FAIL ${s.name} candidate ${i}: ${String(e).slice(0, 120)}`);
    }
  }
  if (!ok) console.log(`MISS ${s.name} — no downloadable candidate (${s.err ?? "none"})`);
}
console.log("done");
