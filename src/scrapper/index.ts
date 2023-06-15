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
  PrimerPremio?: number;
  SegundoPremio?: number;
  TercerPremio?: number;
}

interface KeyType {
  [key: string]: string;
}

type SorteoData = string | number | Date;
//* fecha inicial de los sorteos 2011 a meses [1 - 12]
//* ?tiposorteo=T&ano=2023&meses=03&Consultar=Buscar

const baseURL = 'http://www.lnb.gob.pa/numerosjugados.php';

const links: string[] = [];

const currentYear = new Date();

const errors: KeyType[] = [];

for (let ano = 2011; ano <= currentYear.getFullYear(); ano++) {
  const limit =
    ano == currentYear.getFullYear() ? currentYear.getMonth() + 1 : 12;
  for (let mes = 1; mes <= limit; mes++) {
    const url = new URL(baseURL);
    url.searchParams.set('tiposorteo', 'T');
    url.searchParams.set('ano', ano.toString());
    url.searchParams.set('meses', mes.toString().padStart(2, '0'));
    url.searchParams.set('Consultar', 'Buscar');

    links.push(url.href);
  }
}

function saveFile(fileName: string, data: unknown) {
  fs.writeFileSync(fileName, JSON.stringify(data));
}

const prisma = new PrismaClient();
async function main() {
  const data: Array<Sorteo> = [];
  console.log('Abriendo Navegador');
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  for (const url of links) {
    data.push(...(await searchData(url)));
  }

  // saveFile('sorteos.json', data);
  if (data.length) {
    console.log('Guardando Archivo');
    await prisma.sorteos.createMany({
      data: data as Prisma.SorteosCreateManyInput[],
    });
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

        listaSorteos.push({
          Sorteo: lista[0],
          Fecha: new Date(parseDate),
          PrimerPremio: Number.parseInt(lista[2]),
          Letras: lista[3],
          Serie: lista[4],
          Folio: lista[5],
          SegundoPremio: Number.parseInt(lista[6]),
          TercerPremio: Number.parseInt(lista[7]),
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
// import * as sorteos from '../files/sorteos.json';
// console.log(sorteos[0]);
