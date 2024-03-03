import pino from 'pino';
import { chromium } from '@playwright/test';
import { Prisma, PrismaClient } from '@prisma/client';
import { URL } from 'url';
import * as fs from 'node:fs';

import { DateTime } from 'luxon';

interface Sorteo {
  Sorteo?: string;
  Fecha?: Date;
  Letras?: string;
  Serie?: string;
  Folio?: string;
  PrimerPremio?: string;
  SegundoPremio?: string;
  TercerPremio?: string;
  url?: string;
}

interface KeyType {
  [key: string]: string;
}

//* fecha inicial de los sorteos 2011 a meses [1 - 12]
//* http://www.lnb.gob.pa/numerosjugados.php?tiposorteo=T&ano=2023&meses=06&Consultar=Buscar
const logger = pino();

const baseURL = 'http://www.lnb.gob.pa/numerosjugados.php';

const links: string[] = [];

const currentYear = new Date();

const errors: KeyType[] = [];

function saveFile(fileName: string, data: unknown) {
  fs.writeFileSync(fileName, JSON.stringify(data));
}
logger.info('Abriendo Navegador');

const prisma = new PrismaClient();
async function main() {
  const data: Array<Sorteo> = [];
  logger.info('Abriendo Navegador');
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  const countUrls = await prisma.urls.count();

  for (let ano = 2011; ano <= currentYear.getFullYear(); ano++) {
    const limit =
      ano == currentYear.getFullYear() ? currentYear.getMonth() + 1 : 12;
    for (let mes = 1; mes <= limit; mes++) {
      const url = new URL(baseURL);
      url.searchParams.set('tiposorteo', 'T');
      url.searchParams.set('ano', ano.toString());
      url.searchParams.set('meses', mes.toString().padStart(2, '0'));
      url.searchParams.set('Consultar', 'Buscar');

      //agregar a la lista si no hay urls guardadas
      if (countUrls < 1) {
        links.push(url.href);
      } else {
        //verificarr si no existe en la baase de datos
        const ulrCount = await prisma.urls.count({ where: { url: url.href } });
        if (ulrCount < 1) {
          links.push(url.href);
        }
      }
    }
  }

  if (links.length > 0) {
    //crear los links nuevos o todos en caso de no tener
    const mapper = links.map((item) => ({
      url: item,
    })) as unknown as Prisma.UrlsCreateManyInput[];
    //await prisma.urls.createMany({ data: mapper });
  }

  for (const url of links) {
    data.push(...(await searchData(url)));
  }

  // saveFile('sorteos.json', data);
  if (data.length > 0) {
    console.log('Guardando Archivo ', data.length);
    saveFile('sorteos.json', data);
    // await prisma.sorteos.createMany({
    //   data: data as Prisma.SorteosCreateManyInput[],
    // });
    process.exit(0);
  }

  if (errors.length) {
    console.log('Proceso Terminado con errores');
    saveFile('errores.json', errors);
  } else {
    console.log('Proceso Terminado');
  }

  async function searchData(url: string) {
    //* ?tiposorteo=T&ano=2011&meses=03&Consultar=Buscar
    console.log('buscando ', url);
    // Setup

    const whiteSpacesRx = /\s+/gm;
    await page.goto(url);

    const table = await page.$$('tr[bgcolor]');

    let listaTitulos: KeyType;
    const listaSorteos: Array<Sorteo> = [];
    try {
      for (const title of await page.$$('strong > [color="#FFFFFF"]')) {
        const key: string = await title.innerHTML();
        const keyReplace = key
          .replace(/\s+de\s+/g, '')
          .replace(whiteSpacesRx, '');
        listaTitulos = { ...listaTitulos, [keyReplace]: key };
      }

      for (const sorteo of table) {
        const lista: string[] = (await sorteo.textContent())
          .replace(whiteSpacesRx, ' ')
          .trim()
          .split(whiteSpacesRx);

        const date = lista[1].split('-');
        const parseDate = DateTime.fromObject({
          day: +date[0],
          month: +date[1],
          year: +date[2],
        }).toJSDate();

        console.log(parseDate, lista);

        listaSorteos.push({
          Sorteo: lista[0],
          Fecha: new Date(parseDate),
          PrimerPremio: lista[2],
          Letras: lista[3],
          Serie: lista[4],
          Folio: lista[5],
          SegundoPremio: lista[6],
          TercerPremio: lista[7],
          url: url,
        });
      }

      return listaSorteos;
    } catch (error) {
      console.log('ocurrió un error');
      errors.push({ [url]: error.message as string });
    }
  }

  console.log('cerrando navegador');
  await browser.close();
  process.exit(0);
  //throw new Error('Culminado ');
}

main();

export const ScrapAllSorteos = main;
