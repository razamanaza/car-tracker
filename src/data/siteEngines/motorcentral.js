export default function (html, cheerio, baseUrl) {
  const whiteSpacesRegex = /\s+/g;
  const $ = cheerio.load(html);
  const data = [];
  const vehicles = $('.vehicle');
  vehicles.each((idx, el) => {
    const link = `${baseUrl}${$(el)
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
