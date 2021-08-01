const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const HtmlTableToJson = require("html-table-to-json");
const tabletojson = require("tabletojson").Tabletojson;
const urlBase = "https://www.balotas.com";

const sorteoGordito = [
  2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021,
];

const months = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];

const getUrlGordito = (year = 2011) => {
  const tiposorteo = "Z";
  const arr = [];
  const mes = "01";
  const url = `http://www.lnb.gob.pa/numerosjugados.php?tiposorteo=${tiposorteo}&ano=${year}&meses=${mes}&Consultar=Buscar`;

  for (month of months) {
    arr.push(
      `http://www.lnb.gob.pa/numerosjugados.php?tiposorteo=${tiposorteo}&ano=${year}&meses=${month}&Consultar=Buscar`
    );
  }
  return arr;
};

async function cheerioExample() {
  const pageContent = await axios.get(
    "https://www.balotas.com/sorteosjugados.php"
  );
  const $ = cheerio.load(pageContent.data);
  const data = $("table.table-hover.table-bordered tbody tr")
    .map((_, el) => $(el).find("td").map(getTd).get())
    .get();

  function getTd(_, td) {
    let link = $(td).find("a");
    link = link.map(getLink).get();
    return flatToObject(link);
  }

  function getLink(_, item) {
    item = $(item);
    let obj = {
      year: item.text(),
      href: `${urlBase}/${item.attr("href")}`,
    };
    return obj;
  }

  function flatToObject(array) {
    let obj = {};
    if (Array.isArray(array)) {
      array.forEach((item) => {
        if (typeof item === "object") {
          if (String(item["year"]).toLowerCase() === "decenas") {
            obj.decenas = {
              href: item.href,
            };
          } else {
            obj = {
              ...item,
              ...obj,
            };
          }
        }
      });
    }

    return obj;
  }

  fs.writeFileSync(
    path.join(__dirname, "../files/loteriaRegular.json"),
    JSON.stringify(organizarSorteos(data))
  );
}

function organizarSorteos(data) {
  let arr1 = [];
  let arr2 = [];
  //esta expresión regular busca los rangos de fecha n - n
  let regexSorter = /([0-9]+\s)-(\s[0-9]+)/g;
  if (Array.isArray(data)) {
    data.forEach((item) => {
      if (!String(item.year).match(regexSorter)) {
        arr2.push(item);
      }
    });
  }

  return {
    regular: arr2,
    zodiaco: arr1,
  };
}

function construirUrls() {
  let arr = [];
  for (year of sorteoGordito) {
    arr.push(getUrlGordito(year));
  }
  return arr;
}

//cheerioExample();

async function getDataMes(url = "https://www.balotas.com/j2009.html") {
  const pageContent = await axios.get(url);
  const $ = cheerio.load(pageContent.data);
  let regex = /([0-9][0-9][0-9][0-9])/g;
  let listData = [];
  let data = $("center center table tbody tr td p")
    .map((_, el) => {
      el = $(el);
      let mes = $(el).find("p b font font[color=#008000]").text();
      // console.log(mes, $(el).html());
      let scrapedData = [];
      $(el)
        .find("tbody > tr")
        .each((index, element) => {
          // console.log(index, element);

          if (index === 0 || index === 1) return true;
          const tds = $(element).find("td");
          const ths = $(element).find("th");
          let serieFolio = $(ths[0]).find("font div").remove().text();
          let dia = $(ths[0])
            .find("font div")
            .text()
            .split(/[0-9]+/g);

          let domingo = {
            primero: $(tds[0]).text(),
            segundo: $(tds[1]).text(),
            tercero: $(tds[2]).text(),
          };

          let miercoles = {
            primero: $(tds[3]).text(),
            segundo: $(tds[4]).text(),
            tercero: $(tds[5]).text(),
          };

          const tableRow = { domingo, miercoles };
          scrapedData.push(tableRow);
        });

      listData.push({ data: scrapedData });

      console.log(listData);
      return { mes, scrapedData };
    })
    .get();

  console.log(listData[0]);
}

function splitSerieFolio() {}

function buscarDatos() {}

getDataMes();
