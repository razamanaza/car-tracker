import * as cheerio from 'cheerio';

const whiteSpacesRegex = /\s+/g;

export default [
  {
    name: 'True Value Cars',
    link: 'https://www.truevaluecars.co.nz/vehicles',
    scrapeLink:
      'https://www.truevaluecars.co.nz/vehicles?Make=&Text=&PriceFrom=0&PriceTo=0&YearFrom=0&YearTo=0&Transmission=&BodyStyle=&Dealership=&SortOption=200&Page=1&EngineSizeFrom=0&EngineSizeTo=0&OdometerFrom=0&OdometerTo=0&Model=',
    getVehicleData: function (html) {
      const $ = cheerio.load(html);
      const data = [];
      const vehicles = $('.vehicle');
      vehicles.each((idx, el) => {
        const link = `https://www.truevaluecars.co.nz${$(el)
          .find('.vehicle-info div:first a')
          .attr('href')}`;
        const name = $(el)
          .find('.vehicle-info div:first h6')
          .text()
          .trim()
          .replaceAll(whiteSpacesRegex, ' ');
        const price = $(el)
          .find('.price-wrapper .amount')
          .text()
          .trim()
          .replaceAll(whiteSpacesRegex, ' ')
          .replaceAll(/\D+/g, '');
        const description = $(el)
          .find('.vehicle-specs')
          .text()
          .trim()
          .replaceAll(whiteSpacesRegex, ' ');
        const year = name.slice(0, 4);
        const mileage = description
          .match(/\d+,\d+km/gi)[0]
          .replaceAll(/\D/g, '');
        data.push({
          link,
          name,
          description,
          price,
          year,
          mileage,
          trader: this.name,
        });
      });
      return data;
    },
  },
];
