import * as cheerio from 'cheerio';

export default async function (scrapeLink) {
  const whiteSpacesRegex = /\s+/g;
  const remoteUrl = new URL(scrapeLink);
  const remote = await fetch(scrapeLink);
  const html = await remote.text();
  const $ = cheerio.load(html);
  const data = [];
  const vehicles = $('.vehicle');
  vehicles.each((idx, el) => {
    const link = `${remoteUrl.origin}${$(el)
      .find('.cell-photo a')
      .attr('href')}`;
    const name = $(el)
      .find('.vehicle-info a:first h6')
      .text()
      .trim()
      .replaceAll(whiteSpacesRegex, ' ');
    const price = $(el)
      .find('.price-wrapper .price')
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
    const mileage = description.match(/\d+,\d+km/gi)[0].replaceAll(/\D/g, '');
    data.push({
      link,
      name,
      description,
      price,
      year,
      mileage,
    });
  });
  return data;
}
