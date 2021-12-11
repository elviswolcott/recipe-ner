/* get rid of everything except the ingredients and instructions
 * this is useful for our project, but not everything you would
 * potentially want to do with this dataset, so it is a separate
 * stage in the data preparation
 */

import { readFile, writeFile } from 'fs/promises'

// traverse the graph for a node that meets test function
const find = (node, test) => {
  if (test(node)) {
    return node;
  } else if (node["@graph"]) {
    return node["@graph"].find((child) => find(child, test)) || null;
  } else {
    return null;
  }
}

const clean = async (file, options) => {
  const text = await readFile(file, 'utf-8');
  try {
    const jsonLD = JSON.parse(text);
    // look for a node of type recipe
    const recipe = find(jsonLD, (node) => node["@type"] == "Recipe");
    // save only that node
    if (recipe && recipe.recipeIngredient && recipe.recipeInstructions) {
      const jsontext = JSON.stringify(recipe);
      if (options.out) {
        await writeFile(options.out, jsontext, 'utf-8');
        return file;
      } else if (!options.quiet) {
        console.log(jsontext);
      }
      return recipe;
    }
    return null;
  } catch (e) {
    console.error(e)
    console.error(file)
    return null
  }
}

export default clean