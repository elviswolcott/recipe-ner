# Web Recipe Dataset

*A dataset of over 2,000 recipes across multiple cuisines.*

## Motivation

This dataset was built to enable machine learning research about Natural Language Processing (NLP) for recipes and cooking.
There are a number existing datasets for recipes and images, but there are none that are built for NLP.
The dataset contains versions of recipes with the entire JSON-LD response (which is available to search engines and crawlers) as well as versions with just the recipe entry and recipe text.
We also provide labeled versions for a potential Named Entity Recognition task.
The goal of providing the data in different formats is to not constrain our dataset to one section of the problem space.

## Download

We provide a zip of the latest revision of the dataset in the `Releases` tab of GitHub.
You can download and unzip the dataset to get started immediately.
If you would like to modify or expand the dataset, follow the [Creation](#creation) guide.

## Structure

### `jsonld/`

Each file in this directory is the raw JSON-LD metadata for a page.

### `json/`

Each file in this directory is the JSON-LD for a recipe with everything except the recipe section removed.

### `text/`

Each file in this directory is recipe as text for NLP.

### `labeled/`

Each file in this directory is SpaCy v2 JSON including entity labels. Although it is the SpaCy format, it is easy to convert or manipulate for the tool of your choice.

### `downloads.txt`

A list of every page with metadata in `jsonld`.

### `recipes.txt`

A list of every page with recipe data in `json`, `text` and `labeled`.

### `sources.txt`

A list of the sourcemaps that recipes were pulled from.

### `ingredients.{json,txt}`

Every ingredient that was identified with the initial rules based pass.

### `quantities.{json,txt}`

Every quantity that was identified with the initial rules based pass.

## Creation

This dataset was created using the scraper tool we developed.
It can be found in the `scraper` directory of this repository.

The `scraper` tool requires Node.js and NPM.
If you do not have Node.js and NPM installed follow the instructions to [install Node.js](../docs/install-nodejs.md)

<details>
  <summary>Why Node.js?</summary>
  
  Admittedly, it seems a bit illogical to introduce a second language when our actual machine learning work is being done in python.
  The driving factor was that we were more familiar with creating this type of tool using Node.js.
  We did not want to get rabbit-holed creating the tooling instead of focusing on building the dataset and training our model.

  If you are looking to modify the functionality of the scraper, the `batch` command should be sufficient for obtaining data, and from there you can process it as you please in Python.
  
  If you would like to learn more about the scraper, our series of blog posts discusses the development in more detail.
</details>

<br/>

Using this tool, we can create the dataset with just a few commands.

The best part is, you can easily add you favorite recipe website to the dataset without writing any code!

1. Install the scraper tool by cloning this repository or download and unzip the source code.

1. Install the scraper's dependencies.

    ```bash
    cd ./recipe-ner/scraper
    npm install
    ```

1. Create a directory for the dataset.
    You can call it whatever you want, we'll use `data`.
    If you choose a different directory make sure to use that instead of `data` for the rest of the commands!

    ```bash
    mkdir ./data
    ```

1. All we need to start is a list of *sitemaps*.
    Sitemaps are special files most websites have to help search engines and other programs find all the pages on a website.
    Create a file called `sources.txt` in the directory and add your list of sitemaps.

    <details>
      <summary>How to find a sitemap</summary>
      
      Different websites will put the sitemap in different places.
      A good starting point is to check for a `robots.txt` by going to `https://example.com/robots.txt`.
      Often, the `robots.txt` file will tell you where the sitemap is!

      If this doesn't work try checking for `sitemap.xml` or `sitemap_index.xml`.
      The SEO (search engine optimization) tool many websites use puts the sitemap at `https://example.com/sitemap_index.xml`.
      Some sitemaps will actually link to other sitemaps.
      If this is the case try to figure out which one has the recipes.
      For many of the websites we've tested this will be `post-sitemap.xml`.
    </details>

    <br>

    If you don't have any websites in mind, go ahead and use the list we generated this dataset from.

    ```txt
    https://www.noracooks.com/post-sitemap.xml
    https://thevietvegan.com/post-sitemap.xml
    https://veganheaven.org/post-sitemap.xml
    https://thekoreanvegan.com/post-sitemap.xml
    https://dorastable.com/post-sitemap.xml
    https://www.veganricha.com/post-sitemap2.xml
    https://www.veganricha.com/post-sitemap1.xml
    https://chejorge.com/sitemap-1.xml
    ```

1. Now, to download all of the recipes linked by the sitemap run the `batch` command.
    This command will get a list of all the pages on the site using the sitemap and then download the metadata for each page.
    
    Unfortunately, if a website does not provide the correct metadata the scraper will not be able to retrieve recipes.
    Luckily, most recipe sites care about showing up on search engines so they include the metadata.

    ```bash
    mkdir data/json data/jsonld data/text
    ./scraper batch data/sources.txt --dir ./data --user-agent recipe-scraper
    ```

    This is the long part.
    With just the 8 sitemaps we provide the download process takes ~25 minutes on a good connection.
    These 8 websites include over 3000 pages, 2200 of which include complete recipes!

1. At this point, `./data/jsonld` will be populated with metadata for the pages and `downloads.txt` will include all of the pages which were downloaded.
    Some of these pages won't have recipes.
    Common examples are personal updates or lists (e.g. 10 best vegan desserts).

    We can filter these out by checking for proper metadata using the `clean` command.

    ```bash
    ./scraper clean ./data/downloads.txt --dir ./data --out ./data/recipes.txt
    ```

1. The `clean` command gave us a list of all the recipes in `recipes.txt` and saved *just* the recipe metadata to `./data/json`.

    The JSON metadata isn't a great format for NLP.
    We can create a plain text version of the recipe using the `transcribe` command.
    This text version will only include the ingredients and instructions, not other useful information like cook time or author.
    One of the reasons we save the JSON first is that this data is still accessible.

    ```bash
    ./scraper transcribe ./data/recipes.txt
    ```

    Now, `./data/text` should be full of recipes!


1. We created this dataset to train a model for recognizing entities like ingredients, quantities, and processes in recipes.
    In order to label the data for training, we can combine manual correction and a rules based approach to annotate massive amounts of data.
    The rules based method needs a list of strings to look for, which we can generate by looking at the ingredients for each recipe.
    The list won't necessarily be comprehensive, but it's a great start.

    ```bash
    ./scraper extract ./data/recipes.txt --format json
    ```

If you are interested in the process of labeling the data, read our series of posts where we dive into the details.

## Attribution

This dataset contains recipes from a selection of wonderful vegan recipe blogs.
They cover a range of cuisines including Vietnamese, Korean, Mexican, Indian, and Taiwanese.

* [Nora Cooks](https://noracooks.com)
* [The Viet Vegan](https://thevietvegan.com)
* [Vegan Heaven](https://veganheaven.org)
* [The Korean Vegan](https://thekoreanvegan.com)
* [Dora's Table](https://dorastable.com)
* [Vegan Richa](https://veganricha.com)
* [Che Jorge](https://chejorge.com)