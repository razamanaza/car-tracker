import * as cheerio from 'cheerio';

export default async function (scrapeLink) {
  const whiteSpacesRegex = /\s+/g;
  const remoteUrl = new URL(scrapeLink);
  const remote = await fetch(scrapeLink);
  const html = await remote.text();
  const $ = cheerio.load(html);
  const data = [];
  const vehicles = $('.card');
  vehicles.each((idx, el) => {
    const link = `${$(el).find('a').attr('href')}`;
    const name = $(el)
      .find('.vehicle-details .flex h3')
      .text()
      .trim()
      .replaceAll(whiteSpacesRegex, ' ');
    const price = $(el)
      .find('.price-section .price:nth-child(2)')
      .text()
      .trim()
      .replaceAll(whiteSpacesRegex, ' ')
      .replaceAll(/[$\.\,]+/g, '');
    const description = $(el)
      .find('ul')
      .text()
      .trim()
      .replaceAll(whiteSpacesRegex, ' ');
    const year = name.slice(0, 4);
    const mileage = description.match(/\d+,\d+ km/gi)[0].replaceAll(/\D/g, '');
    if (price !== 'POA') {
      data.push({
        link,
        name,
        description,
        price,
        year,
        mileage,
      });
    }
  });
  return data;
}
