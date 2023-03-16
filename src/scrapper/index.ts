import { chromium, devices } from '@playwright/test';
import { URL } from 'url';

interface Sorteo {
  tipo: string;
  fecha: string;
}
interface KeyType {
  [key: string]: string;
}
type SorteoData = string | number | Date;
//* fecha inicial de los sorteos 2011 a meses [1 - 12]
//* ?tiposorteo=T&ano=2023&meses=03&Consultar=Buscar

(async () => {
  // Setup
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const whiteSpacesRx = /\s+/gm;
  await page.goto('http://www.lnb.gob.pa/numerosjugados.php');

  const table = await page.$$('tr[bgcolor]');

  let listaTitulos: KeyType;
  const listaSorteos: Array<SorteoData[]> = [];
  for (const title of await page.$$('strong > [color="#FFFFFF"]')) {
    const key: string = await title.innerHTML();
    const keyReplace = key.replace(/\s+de\s+/g, '').replace(whiteSpacesRx, '');
    listaTitulos = { ...listaTitulos, [keyReplace]: key };
  }

  for (const sorteo of table) {
    const title = await sorteo.$eval('.style1', (el) => el.textContent);
    listaSorteos.push(
      (await sorteo.textContent())
        .replace(whiteSpacesRx, ' ')
        .trim()
        .split(whiteSpacesRx),
    );
  }
  console.log(listaTitulos);
  // await page.screenshot({ path: `example.png` });
  await browser.close();
})();
