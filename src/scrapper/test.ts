import { chromium, devices } from '@playwright/test';

(async () => {
  // Setup
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('http://www.lnb.gob.pa/index.php/consulte/numeros-jugados');
  const text = await page.evaluate(
    () => document.querySelector('#wob_tm').textContent,
  );
  console.log(text);
  // await page.screenshot({ path: `example.png` });
  await browser.close();
})();
