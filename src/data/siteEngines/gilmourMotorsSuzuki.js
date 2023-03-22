import * as cheerio from 'cheerio';

export default async function (scrapeLink) {
  const whiteSpacesRegex = /\s+/g;
  const remoteUrl = new URL(scrapeLink);
  const remote = await fetch(scrapeLink);
  const html = await remote.text();
  const $ = cheerio.load(html);
  const data = [];
  const vehicles = $('.car-gallery-view');
  vehicles.each((idx, el) => {
    const link = `${$(el).find('.thumb a:first').attr('href')}`;
    const name = $(el)
      .find('.desc  h1')
      .text()
      .trim()
      .replaceAll(whiteSpacesRegex, ' ');
    const price = $(el)
      .find('.desc > span')
      .text()
      .trim()
      .replaceAll(whiteSpacesRegex, ' ')
      .replaceAll(/[$\.\,]+/g, '');
    const description = $(el)
      .find('.desc *:not(h1)')
      .text()
      .trim()
      .replaceAll(whiteSpacesRegex, ' ');
    const year = name.match(/\d{4}$/gi)[0];
    const mileage = $(el)
      .find('.desc > div:nth-child(4)')
      .text()
      .trim()
      .match(/\d+,\d+km./gi)?.[0]
      .replaceAll(/\D/g, '');
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
