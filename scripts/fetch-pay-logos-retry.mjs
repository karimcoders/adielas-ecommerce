/* Retry failed payment-logo searches sequentially. */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { writeFile } from "node:fs/promises";
import path from "node:path";

const run = promisify(execFile);
const OUT = "/home/z/my-project/public/images/pay";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const targets = [
  { name: "upi", q: "UPI payment logo transparent png" },
  { name: "paytm", q: "Paytm logo png" },
  { name: "phonepe", q: "PhonePe logo png" },
  { name: "visa", q: "Visa logo png" },
  { name: "mastercard", q: "Mastercard logo png" },
  { name: "amazonpay", q: "Amazon Pay logo png" },
];

for (const t of targets) {
  let done = false;
  for (let attempt = 0; attempt < 2 && !done; attempt++) {
    try {
      const { stdout } = await run(
        "z-ai",
        ["image-search", "-q", t.q, "--count", "4", "--gl", "us", "--no-rank"],
        { timeout: 150000, maxBuffer: 1024 * 1024 * 8 },
      );
      const start = stdout.indexOf("{");
      const json = JSON.parse(stdout.slice(start));
      for (let i = 0; i < (json.results || []).length && !done; i++) {
        const url = json.results[i]?.original_url;
        if (!url) continue;
        const res = await fetch(url);
        if (!res.ok) continue;
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length < 2000) continue;
        const ext = /\.jpe?g$/i.test(url) ? "jpg" : "png";
        await writeFile(path.join(OUT, `${t.name}.${ext}`), buf);
        console.log(`OK  ${t.name} <- cand ${i} (${buf.length}B)`);
        done = true;
      }
    } catch (e) {
      console.log(`ERR ${t.name} attempt ${attempt}: ${String(e).slice(0, 140)}`);
      await sleep(4000);
    }
  }
  if (!done) console.log(`MISS ${t.name}`);
  await sleep(2500);
}
console.log("done");
