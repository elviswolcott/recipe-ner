// fetches a recipe and parses the JSON-LD
import { load } from 'cheerio'
import { writeFile } from 'fs/promises'
import fetch from 'node-fetch'

const get = async (url, options) => {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": options.userAgent
      }
    });
    const document = await response.text();
    const $ = load(document);
    const jsonLD = JSON.parse($('script[type="application/ld+json"]').html());
    if (jsonLD !== null) {
      if (options.out) {
        await writeFile(options.out, JSON.stringify(jsonLD));
      } else if (!options.quiet) {
        console.log(jsonLD)
      }
    }
    return jsonLD;
  } catch(e) {
    console.error(e);
    // mark as failed
    return null;
  }
}

export default get