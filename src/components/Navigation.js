import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

const Button = ({ id, text, onClick, isActive}) => (
  <button
    id={id}
    onClick={onClick}
    className={
      isActive
        ? "Navigation__button Navigation__button-active"
        : "Navigation__button"
    }
  >
    {text}
  </button>
);

const Navigation = ({
  query,
  onQueryChange,
  recipes,
  activeRecipe,
  recipeToSelect,
  toggleRecipeModal
}) => {
  const changeRecipe = (e) => {
    const recipeId = e.target.id;
    recipeToSelect(recipeId);
  };

  return (
    <div className="Navigation">
      <nav className="Navigation__nav">
        <input
          className="Navigation__input"
          type="text"
          placeholder="Search"
          value={query}
          onChange={onQueryChange}
        />
        <ul className="Navigation__list">
          {recipes.map((recipe) => (
            <Link key={recipe.id} to="/">
              <li key={recipe.id}>
                <Button
                  id={recipe.id}
                  onClick={changeRecipe}
                  isActive={recipe.id == activeRecipe}
                  text={recipe.title}
                />
              </li>
            </Link>
          ))}
          <li key="addButton">
            <button
              id="addButton"
              onClick={() => toggleRecipeModal(true)}
              className="Navigation__button Navigation__button-add"
            >
              ➕
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

Navigation.propTypes = {
  activeRecipe: PropTypes.string.isRequired,
  recipes: PropTypes.array.isRequired,
  recipeToSelect: PropTypes.func.isRequired
};

export default Navigation;
