import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import logo from '../assets/cooking.svg';

import {
  addRecipe,
  editRecipe,
  deleteRecipe
} from "../store/actions";

import data from '../mock/data.json';

import Recipe from './Recipe';
import Navigation from './Navigation';
import Pantry from './Pantry';

// const mapStateToProps = state => ({});

// const mapDispatchToProps = dispatch => ({
//   addRecipe: (recipe) => dispatch(addRecipe(recipe)),
//   editRecipe: (recipe) => dispatch(editRecipe(recipe)),
//   deleteRecipe: (recipeId) => dispatch(deleteRecipe(recipeId))
// });

// NOTE: funcational vs class components difference?
// NOTE: consider changing to TS
const App = () => {
  const [query, setQuery] = useState(); // search query for recipes

  // TODO: change the look of this, alternatively make models after switching to TS
  const cookbook = data.cookbooks["1"];
  const user = data.user;
  const { recipes } = cookbook;

  const [inventory, setInventory] = useState(user.inventory);
  const [groceryList, setGroceryList] = useState(user.groceryList)

  const [selectedRecipeId, setSelectedRecipeId] = useState("1");
  const [searchResults, setSearchResults] = useState(recipes);

  // TODO: add endpoint here and move to actions/index.js
  const addIngredientsToList = (ingredients, listName) => {
    const list = listName == "inventory" ? inventory : groceryList;

    const missingInList = _.differenceBy(ingredients, list, 0);
    if (missingInList.length > 0) {
      if(listName == "inventory") {
        setInventory(inventory.concat(missingInList));
      } else if (listName == "groceries") {
        setGroceryList(groceryList.concat(missingInList));
      }
    }
  }

  const deleteIngredientFromList = (index, listName) => {
    if(listName == "inventory") {
      setInventory(inventory.filter((val, i) => i != index));
    } else if (listName == "groceries") {
      setGroceryList(groceryList.filter((val, i) => i != index));
    }
  }

  const addIngredientsToGroceryList = (missingIngredients) => {
    // don't add duplicate ingredients
    const missingInGroceryList = _.differenceBy(missingIngredients, groceryList, 0);
    if (missingInGroceryList.length > 0) {
      setGroceryList(groceryList.concat(missingInGroceryList));
    }
  }

  useEffect(() => {
    const recipeToShow = recipes[0].id || null;
    setSelectedRecipeId(recipeToShow);
  }, []);

  useEffect(() => {
    if (query) {
      const filteredRecipes = recipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredRecipes);
    } else {
      setSearchResults(recipes);
    }
  }, [query]);

  const selectNewRecipe = (recipeId) => {
    if (recipeId) {
      setSelectedRecipeId(recipeId);
    }
  };

  let recipeToSelect;

  const handleQueryChange = (e) => {
    const { value } = e.target;
    setQuery(value);
  };

  if (selectedRecipeId) {
    const selectedRecipe = recipes.filter(
      (recipe) => recipe.id === selectedRecipeId
    );
    if (selectedRecipe.length > 0) {
      recipeToSelect = selectedRecipe[0];
    }
  }

  return (
    <Router>
      <div className="App">
        <aside className="sidebar">
          <div className="sidebar__navigation">
            <Link to="/">
              <img src={logo} height="60px" alt="Logo" />
            </Link>
            <Link to="/pantry">Pantry</Link>
          </div>
          <h1 className="sidebar__title">Mami's Cookbook</h1>
          <Navigation
            query={query}
            onQueryChange={handleQueryChange}
            recipes={searchResults}
            activeRecipe={selectedRecipeId}
            recipeToSelect={selectNewRecipe}
          />
          <div className="sidebar__footer">
            <p>{user.name}</p>
            <Link to="/pantry" className="right">Logout</Link>
          </div>
        </aside>
        <Switch>
          <Route exact path="/">
            {recipeToSelect ? (
              <Recipe
                recipe={recipeToSelect}
                inventory={inventory}
                groceryList={groceryList}
                onRecipeEdit={editRecipe}
                onRecipeDelete={deleteRecipe}
                onAddToList={addIngredientsToList}
              />
            ) : null}
          </Route>
          <Route exact path="/pantry">
            <Pantry
              inventory={inventory}
              groceries={groceryList}
              onAddToList={addIngredientsToList}
              onDeleteFromList={deleteIngredientFromList}
            />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(App)

export default App;
