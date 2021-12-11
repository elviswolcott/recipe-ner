import { readFile, writeFile } from 'fs/promises'
import { URL } from 'url'
import list from './list.js'
import get from './get.js'

const batch = async (file, options) => {
  const sources = await readFile(file, 'utf-8');
  const sites = sources.split('\n');
  const pages = {};
  const pageCounts = {};
  const keys = [];
  let total = 0;
  let valid = "";

  for (const site of sites) {
    // get all the pages on a site
    const key = (new URL(site).hostname);
    const sitePages = await list(site, {
      quiet: true,
      userAgent: options.userAgent,
    });
    // some sites split the sitemap into multiple sections
    if (pages.hasOwnProperty(key)) {
      pages[key] = pages[key].concat(sitePages);
      pageCounts[key] += sitePages.length;
    } else {
      pages[key] = sitePages;
      pageCounts[key] = sitePages.length;
      keys.push(key);
    }
  }

  const max = Math.max(...Object.values(pageCounts));
  // go through all the sites together
  // should somewhat help with load balancing until the end
  for (let i = 0; i < max; i++) {
    for (const key of keys) {
      // check this site still has pages
      if (i < pageCounts[key]) {
        const page = pages[key][i];
        try {
          const id = (new URL(page)).pathname.replace(/\//g,'');
          // save jsonld
          const status = await get(page, { 
            quiet: true,
            userAgent: options.userAgent,
            out: `${options.dir}/jsonld/${key}_${id}.json`
          });
          // null indicates an error
          if (status !== null) {
            valid += `${page}\n`;
            total++;
            if (total % 100 === 0) {
              console.log(`Finished downloading ${total} total recipes.`);
            }
          }
        } catch(e) {
          console.error(e);
          console.error(i, key, page);
        }
      }
    }
  }

  // save which pages are valid
  await writeFile(`${options.dir}/recipes.txt`, valid);
  
}

export default batch;