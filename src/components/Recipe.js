import React from 'react';
import PropTypes from 'prop-types';

const Ingredient = ({ ingredient, i, haveIngredient }) => (
  <li key={i}>
    <span
      className={
        haveIngredient
          ? "Recipe__ingredients__status green"
          : "Recipe__ingredients__status red"
      }
    ></span>
    {ingredient}
  </li>
);

const Step = ({ step, i }) => (<li key={i}>{step}</li>);

const Recipe = ({ recipe, inventory, onRecipeEdit, onRecipeDelete, onAddToList }) => {
  const { title, ingredients, steps } = recipe;

  const missingIngredients = [];

  const haveIngredient = (ingredient) => {
    if (inventory.includes(ingredient)) {
      return true;
    } else {
      missingIngredients.push(ingredient);
      return false;
    }
  }

  const editRecipe = () => onRecipeEdit(recipe);
  const deleteRecipe = () => onRecipeDelete(recipe.id);
  const addToGroceryList = () => onAddToList(missingIngredients, 'groceries');

  const ingredientsList = ingredients.map((ingredient, i) => (
    <Ingredient
      ingredient={ingredient}
      i={i}
      // TODO: make case insensitive
      haveIngredient={haveIngredient(ingredient)}
    />
  ));
  const stepsList = steps.map((step, i) => <Step step={step} i={i} />);

  return (
    <div className="Recipe">
      <h2 className="Recipe__title">{title}</h2>

      <h3 className="Recipe__sub-title">Ingredients</h3>
      <ul className="Recipe__ingredients">{ingredientsList}</ul>

      <h3 className="Recipe__sub-title">Preparation</h3>
      <ol className="Recipe__steps">{stepsList}</ol>

      <div className="Recipe__button-container">
        <button className="Recipe__button first" onClick={addToGroceryList}>
          Add to Grocery List
        </button>
        <button className="Recipe__button second" onClick={editRecipe}>
          /
        </button>
        <button className="Recipe__button third" onClick={deleteRecipe}>
          x
        </button>
      </div>
    </div>
  );
}

Recipe.propTypes = {
  recipe: PropTypes.object.isRequired
};

export default Recipe;
