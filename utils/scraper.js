const scrapeIt = require("scrape-it");

// Promise interface
const yearsRegex = new RegExp("/[0-9]/g");
scrapeIt("https://www.balotas.com/sorteosjugados.php", {
  years: {
    selector: "table.table-hover.table-bordered tbody tr",
  },
}).then(({ data, response }) => {
  console.log(`Status Code: ${response.statusCode}`);
  console.log(data);
});
