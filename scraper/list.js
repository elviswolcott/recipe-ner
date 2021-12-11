// parses a sitemap to get a list of URLs on a recipe site
import Sitemapper from 'sitemapper';
import { writeFile, appendFile } from 'fs/promises';

const list = async (url, options) => {
  const site = new Sitemapper({
    url: url,
    timeout: 15000,
    requestHeaders: {
      'User-Agent': options.userAgent
    }
  });

  try {
    const { sites: pages } = await site.fetch();
    const result = pages.join('\n');
    // check wether to print or save to file
    if (options.out) {
      if (options.a) {
        await appendFile(options.out, result);
      } else {
        await writeFile(options.out, result);
      }
    } else if (!options.quiet) {
      console.log(result)
    }
    // array is useful for use in other js scripts
    return pages;
  } catch (error) {
    console.error(error);
  }
}

export default list