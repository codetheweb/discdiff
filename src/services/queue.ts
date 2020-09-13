import {inject, injectable} from 'inversify';
import {distance} from 'fastest-levenshtein';
import got from 'got';
import cheerio from 'cheerio';
import {Client, TextChannel} from 'discord.js';
import {Site} from '../models';
import {TYPES} from '../types';
import container from '../inversify.config';

@injectable()
export default class {
  private readonly scrapeIntervalMs: number;
  // eslint-disable-next-line no-undef
  private readonly timers: Map<number, NodeJS.Timeout> = new Map();

  constructor(@inject(TYPES.Config.SCRAPE_INTERVAL_S) scrapeIntervalSeconds: number) {
    this.scrapeIntervalMs = scrapeIntervalSeconds * 1000;
  }

  async addFromDatabase() {
    const sites = await Site.findAll();

    sites.forEach(site => {
      this.add(site.id);
    });
  }

  add(siteId: number) {
    this.timers.set(siteId, setInterval(async () => {
      await this.scrape(siteId);
    }, this.scrapeIntervalMs));
  }

  remove(siteId: number) {
    const timer = this.timers.get(siteId);

    if (timer) {
      clearInterval(timer);

      this.timers.delete(siteId);
    }
  }

  private async scrape(siteId: number) {
    const site = await Site.findByPk(siteId);

    if (!site) {
      return;
    }

    const content = (await got(site.address)).body;

    const selectedContent = cheerio.load(content)(site.selector).html() ?? '';

    const disanceScore = distance(selectedContent, site.lastContent);

    site.lastContent = selectedContent;
    site.lastChecked = new Date();

    await site.save();

    if (disanceScore > 1) {
      const client = container.get<Client>(TYPES.DiscordClient);

      const channel = client.channels.cache.find(channel => channel.id === site.channelId);

      if (!channel) {
        return;
      }

      await (channel as TextChannel).send(`<${site.address}> was just updated`);
    }
  }
}
