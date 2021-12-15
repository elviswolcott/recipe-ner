// working with jsonld, get out the ingredients and quantities
import { readFile, writeFile } from 'fs/promises'

// for use as a command line script there should probably eventually be 
// extract_ingredients and extract_quantities for printing to stdout/saving to file
// for now we just have the minimum logic required to make it work.
const extract = async (file) => {
  const ingredients = [];
  const quantities = [];
  // this is a place it gets better the more it sees!
  let units = ['tsp', 'teaspoon', 'tablespoon', 'tbsp', 'cup', 'g', 'gram', 'oz', 'ounce'];
  // pluralize
  units = units.concat(units.map(u => `${u}s`))
  const text = await readFile(file, 'utf-8');
  try {
    // read the file as json
    const jsonld = JSON.parse(text);
    for (const recipeIngredient of jsonld.recipeIngredient) {
      // the point is not to be perfect! that's where manual annotation comes in
      const regexp = new RegExp(`([0-9 /]+ (?:${units.join('|')})) ([^\\(\\)\n]+)(?:\\(.+\\))?`, 'i');
      const match = recipeIngredient.match(regexp);
      // add to the list
      if (match) {
        const [_, quantity, ingredient] = match;
        ingredients.push(ingredient);
        quantities.push(quantity);
      }
    }
    // remove duplicates
    const uniqueIngredients = [...new Set(ingredients)];
    const uniqueQuantities = [...new Set(quantities)];
    return {
      quantities: uniqueQuantities.map(q => q.trim()),
      ingredients: uniqueIngredients.map(i => i.trim()),
    }
  } catch (e) {
    console.error(e);
    return {
      quantities: [],
      ingredients: [],
    };
  }
}

export default extract