import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { removeIndexFromArray } from '../lib/utils';

const RecipeForm = ({
  inventory,
  groceries,
  onAddToList,
  onDeleteFromList,
  toggleRecipeModal,
  initialRecipe,
}) => {
  const [activeTab, setActiveTab] = useState("groceries");
  const [ingredientToAdd, setIngredientToAdd] = useState("");

  const addIngredient = (e) => {
    e.preventDefault();
    onAddToList([ingredientToAdd], activeTab);
    setIngredientToAdd("");
  };

  const deleteIngredient = (index, tab) => {
    onDeleteFromList(index, activeTab);
  };

  const getList = (items) =>
    items.map((item, i) => (
      <li key={i} value={i}>
        <span className="Recipe__ingredients__status green"></span>
        {item}
        <span onClick={() => deleteIngredient(i)}> x</span>
      </li>
    ));

  const [recipeParams, setRecipeParams] = useState(initialRecipe);

  // TODO: add google vision here
  const importRecipe = () => {
    const sampleRecipe = {
      title: "Yummy Soup",
      ingredients: ["Onions", "Testing"],
      steps: ["Do this", "Then that"],
    }

    setRecipeParams(sampleRecipe);
    // setRecipeParams({
    //   title: sampleRecipe.title,
    //   ingredients: recipeParams.ingredients.concat(sampleRecipe.ingredients),
    //   steps: recipeParams.steps.concat(sampleRecipe.steps),
    // });
  }

  const onSubmit = (e) => {
    e.preventDefault()
    console.log(recipeParams);
  }

  const onRecipeChange = (e) => {
    const { id, value } = e.target;
    const key = id.split("_")[0];
    const index = id.split("_")[1];

    if (id === "title") {
      setRecipeParams({
        ...recipeParams,
        title: value,
      });
    } else if (["ingredients", "steps"].includes(key)) {
      let updatedArray = recipeParams[key];
      updatedArray[index] = value;

      setRecipeParams({
        ...recipeParams,
        [key]: updatedArray,
      });
    }
  };

  const removeItem = (key, index) => {
    setRecipeParams({
        ...recipeParams,
        [key]: removeIndexFromArray(recipeParams[key], index),
    });
  };

  const addToRecipe = (key) => {
    const list = recipeParams[key];

    if (!list || list.length == 0) {
      setRecipeParams({
        ...recipeParams,
        [key]: [""],
      });
    } else if (list[list.length - 1] != "") {
      setRecipeParams({
        ...recipeParams,
        [key]: list.concat([""]),
      });
    }
  };

  return (
    <div className="RecipeForm">
      <form onSubmit={onSubmit}>
        <div className="RecipeForm__section-header">
          <h3> </h3>
          <button onClick={() => toggleRecipeModal(false)}>✖️</button>
        </div>
        <h2 className="Pantry__title">Recipe</h2>
        <button onClick={() => importRecipe()}>Import</button>
        <div className="RecipeForm__section-header">
          <h3>Title</h3>
        </div>
        <input
          id="title"
          className="Navigation__input"
          type="text"
          placeholder="Title"
          value={recipeParams.title}
          onChange={onRecipeChange}
        />
        <div className="RecipeForm__section-header">
          <h3>Ingredients</h3>
          <button onClick={() => addToRecipe("ingredients")}>➕</button>
        </div>
        {recipeParams.ingredients.map((ingredient, i) => (
          <div className="RecipeForm__item">
            <input
              id={`ingredients_${i}`}
              className="RecipeForm__input"
              type="text"
              placeholder="Ingredient"
              value={ingredient}
              onChange={onRecipeChange}
            />
            <button onClick={() => removeItem("ingredients", i)}>
                <span role="img" aria-label="delete step">✖️</span>
            </button>
          </div>
        ))}
        <div className="RecipeForm__section-header">
          <h3>Steps</h3>
          <button onClick={() => addToRecipe("steps")}>➕</button>
        </div>
        {recipeParams.steps.map((step, i) => (
          <div className="RecipeForm__item">
            <input
              id={`steps_${i}`}
              className="RecipeForm__input"
              type="text"
              placeholder="Step"
              value={step}
              onChange={onRecipeChange}
            />
            <button onClick={() => removeItem("steps", i)}>
                <span role="img" aria-label="delete step">✖️</span>
            </button>
          </div>
        ))}
        <button
          className="Recipe__button Navigation__button-active mt-22"
          onClick={onSubmit}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

RecipeForm.propTypes = {
};

export default RecipeForm;