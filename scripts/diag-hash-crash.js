/* Diagnosa crash client-side pada muat-fresh rute hash (#/...). */
const path = "/home/z/.npm-global/lib/node_modules/playwright";
const { chromium } = require(path);

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push("PAGEERROR: " + e.message + "\n" + (e.stack ?? "").slice(0, 1200)));
  page.on("console", (m) => {
    if (m.type() === "error") errs.push("CONSOLE: " + m.text().slice(0, 500));
  });
  page.on("response", (r) => {
    if (r.status() >= 400) errs.push(`HTTP ${r.status()}: ${r.url()}`);
  });
  await page.goto("http://localhost:3000/#/vvip", { waitUntil: "networkidle" });
  await page.waitForTimeout(3000);
  const body = await page.evaluate(() => document.body.innerText.slice(0, 120));
  console.log("BODY:", JSON.stringify(body));
  console.log(errs.length ? errs.join("\n---\n") : "(tidak ada error tercatat)");
  await browser.close();
})();
