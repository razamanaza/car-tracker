import traders from '@/data/traders';
import fs from 'fs/promises';
import path from 'path';

export default async function fetchTrueValue(req, res) {
  try {
    const cacheDir = path.join(__dirname, 'cache');
    const cacheFile = path.join(cacheDir, 'data.json');
    await fs.mkdir(cacheDir, { recursive: true });
    let lastChangeDate = 0;
    try {
      const { mtime } = await fs.stat(cacheFile);
      lastChangeDate = mtime;
    } catch {
      console.log('No file');
    }
    const dateDiff = Date.now() - lastChangeDate;

    let data = {};
    if (dateDiff > 86400) {
      const promises = traders.map(async (trader) => {
        const remote = await fetch(trader.scrapeLink);
        const html = await remote.text();
        const vehicle = trader.getVehicleData(html);
        return vehicle;
      });
      data = (await Promise.all(promises)).flat();
      await fs.writeFile(cacheFile, JSON.stringify(data));
      console.log('Read from internet');
    } else {
      const text = await fs.readFile(cacheFile);
      data = JSON.parse(text);
      console.log('Read from cache');
    }

    res.status(200).json({ data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
