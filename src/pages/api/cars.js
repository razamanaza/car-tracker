import traders from '@/data/traders';
import * as siteEngines from '@/data/siteEngines';
import fs from 'fs/promises';
import path from 'path';
import * as cheerio from 'cheerio';

export default async function fetchTrueValue(req, res) {
  try {
    const cacheDir = path.join('/', 'tmp', 'cache');
    const cacheFile = path.join(cacheDir, 'data.json');
    await fs.mkdir(cacheDir, { recursive: true });
    let lastChangeDate = 0;
    try {
      const { mtime } = await fs.stat(cacheFile);
      lastChangeDate = mtime;
    } catch {
      console.log('No cache file');
    }
    const dateDiff = Date.now() - lastChangeDate;

    let data = {};
    if (dateDiff > 86400000 || req.query?.force) {
      const promises = traders.map(async (trader) => {
        const engine = siteEngines[trader.siteEngine];
        const vehicle = await engine(trader.scrapeLink);
        return vehicle.map((item) => ({ ...item, trader: trader.name }));
      });
      data = (await Promise.all(promises)).flat();
      await fs.writeFile(cacheFile, JSON.stringify(data));
      console.log(dateDiff);
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
