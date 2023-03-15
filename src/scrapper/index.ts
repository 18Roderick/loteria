import { chromium, devices } from '@playwright/test';

(async () => {
  // Setup
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('http://www.lnb.gob.pa/numerosjugados.php');

  const table = await page.$$('tr[bgcolor]');

  for (const sorteo of table) {
    const title = await sorteo.$eval('.style1', (el) => el.textContent);
    console.log(await sorteo.textContent());
  }

  // await page.screenshot({ path: `example.png` });
  await browser.close();
})();
