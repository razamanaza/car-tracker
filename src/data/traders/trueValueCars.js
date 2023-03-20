const whiteSpacesRegex = /\s+/g;

export default {
  name: 'True Value Cars',
  baseUrl: 'https://www.truevaluecars.co.nz/vehicles',
  scrapeLink:
    'https://www.truevaluecars.co.nz/vehicles?Make=&Text=&PriceFrom=0&PriceTo=0&YearFrom=0&YearTo=0&Transmission=&BodyStyle=&Dealership=&SortOption=200&Page=1&EngineSizeFrom=0&EngineSizeTo=0&OdometerFrom=0&OdometerTo=0&Model=',
  siteEngine: 'motorcentral',
};
