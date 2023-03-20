import * as cheerio from 'cheerio';

export default async function (scrapeLink) {
  const whiteSpacesRegex = /\s+/g;
  const remoteUrl = new URL(scrapeLink);
  const remote = await fetch(scrapeLink);
  const html = await remote.text();
  const $ = cheerio.load(html);
  const data = [];
  const vehicles = $('.product-card');
  console.log(vehicles);
  vehicles.each((idx, el) => {
    const link = `${remoteUrl.origin}${$(el).attr('href')}`;
    const name = $(el)
      .find('.title h3')
      .text()
      .trim()
      .replaceAll(whiteSpacesRegex, ' ');
    const price = $(el)
      .find('ul li:first small:first')
      .text()
      .trim()
      .replaceAll('.00', '')
      .replaceAll(whiteSpacesRegex, ' ')
      .replaceAll(/\D+/g, '');
    const description = $(el)
      .find('ul')
      .text()
      .trim()
      .replaceAll(whiteSpacesRegex, ' ');
    const year = name.slice(0, 4);
    const mileage = description.match(/\d+ km/gi)[0].replaceAll(/\D/g, '');
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
