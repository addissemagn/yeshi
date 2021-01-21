import React from 'react';
import PropTypes from 'prop-types';

import ImageUploadMultiple from './ImageUploadMultiple';

const Ingredient = ({ ingredient, i, haveIngredient }) => (
  <li key={i}>
    <span
      className={
        haveIngredient
          ? "Recipe__ingredients__status green"
          : "Recipe__ingredients__status red"
      }
    ></span>
    <span className="">{ingredient}</span>
  </li>
);

const Step = ({ step, i }) => (<li className="pointer highlight" key={i}>{step}</li>);

const Recipe = ({
  recipe,
  inventory,
  groceryList,
  onRecipeEdit,
  onRecipeDelete,
  onAddToList,
  onUploadImageToRecipe,
}) => {
  const missingInInventory = [];
  const missingInGroceryList = [];

  const haveIngredient = (ingredient) => {
    if (!groceryList.includes(ingredient) && !inventory.includes(ingredient)) {
      missingInGroceryList.push(ingredient);
    }

    if (inventory.includes(ingredient)) {
      return true;
    } else {
      missingInInventory.push(ingredient);
      return false;
    }
  };

  const editRecipe = () => onRecipeEdit(recipe);
  const deleteRecipe = () => onRecipeDelete(recipe.id);
  const addToGroceryList = () => onAddToList(missingInInventory, "groceries");

  const ingredientsList = recipe.ingredients && recipe.ingredients.map((ingredient, i) => (
    <Ingredient
      ingredient={ingredient}
      i={i}
      // TODO: make case insensitive
      haveIngredient={haveIngredient(ingredient)}
    />
  ));

  const stepsList = recipe.steps && recipe.steps.map((step, i) => <Step step={step} i={i} />);
  const notesList = recipe.notes && recipe.notes.map((note, i) => <Step step={note} i={i} />);
  const imagesList = recipe.images && recipe.images.map((image, i) => (
    <li key={i}>
      <img src={image.url} width="300px"/>
      <span className="Recipe__images">{image.caption}</span>
    </li>
  ));

  return (
    <div className="Recipe">
      <h2 className="Recipe__title">{recipe.title}</h2>

      <div className="Recipe__button-container">
        {missingInGroceryList.length > 0 ? (
          <button className="Recipe__button first" onClick={addToGroceryList}>
            Add to Grocery List
          </button>
        ) : (
          <button
            className="Recipe__button Recipe__button-success first"
            onClick={addToGroceryList}
          >
            In Grocery List{" "}
            <span role="img" aria-label="Check emoji">
              ✔️
            </span>
          </button>
        )}
        <button
          className="Recipe__button second"
          onClick={editRecipe}
        >
          <span role="img" aria-label="edit">
            🖋️
          </span>
        </button>
        <button className="Recipe__button third" onClick={deleteRecipe}>
          <span role="img" aria-label="delete">
            ✖️
          </span>
        </button>
      </div>

      { recipe.ingredients && (
        <span>
          <h3 className="Recipe__sub-title">Ingredients</h3>
          <ul className="Recipe__ingredients">{ingredientsList}</ul>
        </span>
      )}
      { recipe.steps && (
        <span>
          <h3 className="Recipe__sub-title">Preparation</h3>
          <ol className="Recipe__steps">{stepsList}</ol>
        </span>
      )}
      { recipe.notes && (
        <span>
          <h3 className="Recipe__sub-title">Notes</h3>
          <ol className="Recipe__steps">{notesList}</ol>
        </span>
      )}

      { recipe.images && (
        <span>
          <h3 className="Recipe__sub-title">Images</h3>
          <ol className="Recipe__images">{imagesList}</ol>
        </span>
      )}
      <ImageUploadMultiple onUpload={onUploadImageToRecipe}/>
    </div>
  );
};

Recipe.propTypes = {
  recipe: PropTypes.object.isRequired
};

export default Recipe;
