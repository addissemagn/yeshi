import React, { useState } from 'react';

import { removeIndexFromArray } from '../lib';
import ImageUpload from './ImageUpload';
import api from '../api';

const RecipeForm = ({
  toggleRecipeModal,
  onSubmit,
  onRecipeImageUpload,
  recipeParams,
  recipeParamsErrors,
  setRecipeParams,
}) => {
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

    if (!list || list.length === 0) {
      setRecipeParams({
        ...recipeParams,
        [key]: [""],
      });
    } else if (list[list.length - 1] !== "") {
      setRecipeParams({
        ...recipeParams,
        [key]: list.concat([""]),
      });
    }
  };

  return (
    <div className="RecipeForm">
      <form onSubmit={(e) => onSubmit(e, recipeParams)}>
        <div className="RecipeForm__section-header">
          <h3> </h3>
          <button onClick={() => toggleRecipeModal(false)}>
            <span role="img" aria-label="delete">
              ✖️
            </span>
          </button>
        </div>
        <h2 className="Pantry__title">Recipe</h2>
        <ImageUpload onUpload={onRecipeImageUpload} />
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
        {recipeParamsErrors.title ? (
          <p className="RecipeForm__error">{recipeParamsErrors.title}</p>
        ) : (
          ""
        )}
        <div className="RecipeForm__section-header">
          <h3>Ingredients</h3>
          <button
            onClick={(e) => {
              e.preventDefault();
              addToRecipe("ingredients");
            }}
          >
            <span role="img" aria-label="add">
              ➕
            </span>
          </button>
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
            <button
              onClick={(e) => {
                e.preventDefault();
                removeItem("ingredients", i);
              }}
            >
              <span role="img" aria-label="delete step">
                ✖️
              </span>
            </button>
          </div>
        ))}
        {recipeParamsErrors.ingredients && (
          <p className="RecipeForm__error">{recipeParamsErrors.ingredients}</p>
        )}
        <div className="RecipeForm__section-header">
          <h3>Steps</h3>
          <button
            onClick={(e) => {
              e.preventDefault();
              addToRecipe("steps");
            }}
          >
            <span role="img" aria-label="add step">
              ➕
            </span>
          </button>
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
            <button
              onClick={(e) => {
                e.preventDefault();
                removeItem("steps", i);
              }}
            >
              <span role="img" aria-label="delete step">
                ✖️
              </span>
            </button>
          </div>
        ))}
        {recipeParamsErrors.steps ? (
          <p className="RecipeForm__error">{recipeParamsErrors.steps}</p>
        ) : (
          ""
        )}
        <button
          className="Recipe__button Navigation__button-active mt-22"
          onClick={(e) => onSubmit(e, recipeParams)}
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
