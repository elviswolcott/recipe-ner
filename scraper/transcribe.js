// stringify the ingredients and instructions
// just enough for what we want our model to process
import { readFile, writeFile } from 'fs/promises'

const transcribe = async (file, options) => {
  const text = await readFile(file, 'utf-8');
  try {
    const json = JSON.parse(text);
    const ingredients = json.recipeIngredient;
    const steps = json.recipeInstructions;
    const recipe = `Ingredients:\n${ingredients.join('\n')}\n\nInstructions:\n${steps.filter(step => step["@type"] === "HowToStep").map(step => step.text).join('\n')}`
    if (options.out) {
      await writeFile(options.out, recipe, 'utf-8');
      return recipe;
    } else if (!options.quiet) {
      console.log(recipe);
    }
    return recipe;
  } catch (e) {
    console.error(e)
    console.error(file)
    return null
  }
}

export default transcribe