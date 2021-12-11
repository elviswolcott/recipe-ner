#!/usr/bin/env node
/* set of tools for obtaining recipe data
 * only works on websites that provide a sitemap and JSON-LD for their recipes
 * provided as a set of command line tools to allow scripting together for customization
 */
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { readFile, writeFile } from 'fs/promises'
import list from './list.js'
import get from './get.js'
import batch from './batch.js'
import clean from './clean.js'
import transcribe from './transcribe.js'

// parse command line parameters and call sub modules
// parameters are reused for all commands
// not a perfect CLI, but it does what we need
// eventually it would be nice to support stdin for bash scripting
// it would also be good to refactor the file stuff all into the CLI
// and leave the functions pure data handling
yargs(hideBin(process.argv))
  .option('u', {
    alias: 'user-agent',
    demandOption: true,
    default: 'recipe-scraper',
    describe: 'User-Agent for the scraper',
    type: 'string'
  })
  .option('o', {
    alias: 'out',
    demandOption: false,
    describe: 'Output file',
    type: 'string'
  })
  .option('a', {
    alias: 'append',
    boolean: true,
    demandOption: false,
    describe: 'Append to file',
  })
  .option('q', {
    alias: 'quiet',
    boolean: true,
    demandOption: false,
    describe: 'Do not print to stdout',
  })
  .option('d', {
    alias: 'dir',
    type: 'string',
    default: './data',
    demandOption: false,
    describe: 'Directory for dataset',
  })
  .command('list <url>', 'generate a list of pages from the sitemap URL', () => {}, (argv) => {
    const { url, ...options } = argv;
    list(url, options);
  })
  .command('get <url>', 'download a recipe from the URL', () => {}, (argv) => {
    const { url, ...options } = argv;
    get(url, options);
  })
  .command('batch <file>', 'get all recipes for a list of sitemaps', () => {}, (argv) => {
    const { file, ...options } = argv;
    batch(file, options);
  })
  .command('clean <file>', 'take jsonld and produce only the recipe json. '
          + 'Alternatively, if file is .txt file listing jsonld files, clean each individual file', () => {}, (argv) => {
    const { file, ...options } = argv;
    if (file.endsWith('.txt')) {
      readFile(file, 'utf-8').then(text => {
        const urls = text.trim().split('\n');
        const files = urls.map(url => {
          const parsed = new URL(url);
          return `${parsed.hostname}_${parsed.pathname.replace(/\//g,'')}.json`;
        });
        // run against every file
        const recipes = Promise.all(files.map(file => clean(`${options.dir}/jsonld/${file}`, {
          out: `${options.dir}/json/${file}`,
          ...options
        })));
        // save the list of useable recipes
        recipes.then(r => {
          const list = r.filter(r => r && r !== '').join('\n')
          if (options.out) {
            writeFile(options.out, list, 'utf-8');
          } else if (!options.quiet) {
            console.log(list);
          }
        });
      })
    } else {
      clean(file, options);
    }
  })
  .command('transcribe <file>', 'take json and produce only the recipe text. '
  + 'Alternatively, if file is .txt file listing json files, clean each individual file', () => {}, (argv) => {
    const { file, ...options } = argv;
    if (file.endsWith('.txt')) {
      readFile(file, 'utf-8').then(text => {
        const files = text.trim().split('\n');
        // run against every file
        // clean up how files and naming is handled to be more flexible in future
        Promise.all(files.map(file => transcribe(file.replace('jsonld', 'json'), {
          out: file.replace('jsonld', 'text').replace('.json', '.txt'),
          ...options
        })));
      })
    } else {
      transcribe(file, options);
    }
  })
  .demandCommand(1)
  .parse()

