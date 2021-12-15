# Recipe Data Scraper

*A simple command line tool for acquiring web recipe data*

## Usage
```
scraper <command>

Commands:scraper <command>

Commands:
  scraper list <url>         generate a list of pages from the sitemap URL
  scraper get <url>          download a recipe from the URL
  scraper batch <file>       get all recipes for a list of sitemaps
  scraper clean <file>       take jsonld and produce only the recipe json. Alter
                             natively, if file is .txt file listing jsonld files
                             , clean each individual file
  scraper transcribe <file>  take json and produce only the recipe text. Alterna
                             tively, if file is .txt file listing json files, cl
                             ean each individual file
  scraper extract <file>     take json and produce only the ingredients and quan
                             tities. Alternatively, if file is .txt file listing
                              json files, extract from each individual file

Options:
      --help        Show help                                          [boolean]
      --version     Show version number                                [boolean]
  -u, --user-agent  User-Agent for the scraper
                                 [string] [required] [default: "recipe-scraper"]
  -o, --out         Output file                                         [string]
  -a, --append      Append to file                                     [boolean]
  -q, --quiet       Do not print to stdout                             [boolean]
  -d, --dir         Directory for dataset           [string] [default: "./data"]
  -f, --format      Format: text or json              [string] [default: "text"]

Not enough non-option arguments: got 0, need at least 1
  scraper list <url>         generate a list of pages from the sitemap URL
  scraper get <url>          download a recipe from the URL
  scraper batch <file>       get all recipes for a list of sitemaps
  scraper clean <file>       take jsonld and produce only the recipe json. Alter
                             natively, if file is .txt file listing jsonld files
                             , clean each individual file
  scraper transcribe <file>  take json and produce only the recipe text. Alterna
                             tively, if file is .txt file listing json files, cl
                             ean each individual file
  scraper extract <file>     take json and produce only the ingredients and quan
                             tities. Alternatively, if file is .txt file listing
                              json files, extract from each individual file

Options:
      --help        Show help                                          [boolean]
      --version     Show version number                                [boolean]
  -u, --user-agent  User-Agent for the scraper
                                 [string] [required] [default: "recipe-scraper"]
  -o, --out         Output file                                         [string]
  -a, --append      Append to file                                     [boolean]
  -q, --quiet       Do not print to stdout                             [boolean]
  -d, --dir         Directory for dataset           [string] [default: "./data"]
  -f, --format      Format: text or json              [string] [default: "text"]
```

## Example

The following sequence of commands will create a dataset from the sitemaps in `./data/sources.txt`
More details can be found in the [Dataset Creation](./data/README.md#creation) section.