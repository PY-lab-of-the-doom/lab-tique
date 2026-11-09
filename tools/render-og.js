// Génère assets/og-image.png (aperçu de partage) et assets/apple-touch-icon.png
// Usage : node tools/render-og.js   (nécessite Playwright)
const path = require("path");
const { chromium } = require("playwright");
(async () => {
  const root = path.resolve(__dirname, "..");
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await p.goto("file://" + path.join(root, "tools/og-card.html"));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(500);
  await p.screenshot({ path: path.join(root, "assets/og-image.png") });
  const i = await b.newPage({ viewport: { width: 180, height: 180 }, deviceScaleFactor: 1 });
  await i.setContent(`<body style="margin:0;width:180px;height:180px;background:#d7ff1e;display:grid;place-items:center">
    <div style="width:132px;height:132px;border-radius:50%;background:#ff3fa4;border:6px solid #0b0b0b;display:grid;place-items:center;
    font:italic 110px/1 Georgia,serif;color:#0b0b0b;padding-bottom:14px;box-sizing:border-box">π</div></body>`);
  await i.screenshot({ path: path.join(root, "assets/apple-touch-icon.png") });
  await b.close();
})();
