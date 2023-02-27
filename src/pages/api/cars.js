import traders from '@/data/traders';

export default async function fetchTrueValue(req, res) {
  const promises = traders.map(async (trader) => {
    const remote = await fetch(trader.scrapeLink);
    const html = await remote.text();
    const vehicle = trader.getVehicleData(html);
    return vehicle;
  });

  const data = (await Promise.all(promises)).flat();

  res.status(200).json({ data });
}
