import React, { useState, useEffect } from 'react';
// import { connect } from 'react-redux';
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
import { removeIndexFromArray } from '../lib/utils';

import Recipe from './Recipe';
import RecipeForm from './RecipeForm';
import Navigation from './Navigation';
import Pantry from './Pantry';


// NOTE: funcational vs class components difference?
// NOTE: consider changing to TS
const Main = ({ onLogout}) => {
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(); // search query for recipes

  // TODO: change the look of this, alternatively make models after switching to TS
  // const [user, setUser] = useState({});
  // const [cookbook, setCookbook] = useState({});
  let user, cookbook;
  user = data.user;
  cookbook = data.cookbooks["1"]

  useEffect(() => {
    getUser();
    getCookbooks()
    setLoading(false);
  }, [])

  const getUser = async () => {
    console.log("GET /user")
    user = data.user;
  }

  // TODO: get multiple cookbooks, right now only one
  const getCookbooks = async () => {
    console.log("GET /cookbook/:id")
    cookbook = data.cookbooks["1"]
  }

  const [inventory, setInventory] = useState(user.inventory);
  const [groceryList, setGroceryList] = useState(user.groceryList)

  const [selectedRecipeId, setSelectedRecipeId] = useState("1");
  const [searchResults, setSearchResults] = useState(cookbook.recipes);

  const [modalOpen, setModalOpen] = useState(false);

  // TODO: add endpoints; move to actions/index.js
  const addIngredientsToList = (ingredients, listName) => {
    const list = listName === "inventory" ? inventory : groceryList;

    // BUG: Adding Test and Test2 doesn't work
    const missingInList = _.differenceBy(ingredients, list, 0);
    const updatedList = list.concat(missingInList);

    if (missingInList.length > 0) {
      if(listName === "inventory") {
        console.log("PATCH /list/inventory: ", updatedList)
        setInventory(updatedList);
      } else if (listName === "groceries") {
        console.log("PATCH /list/groceries: ", updatedList)
        setGroceryList(updatedList);
      }
    }
  }

  // TODO: add endpoints; move to actions/index.js
  const deleteIngredientFromList = (index, listName) => {
    const list = listName === "inventory" ? inventory : groceryList;
    const updatedList = removeIndexFromArray(list, index);

    if(listName === "inventory") {
      console.log("PATCH /list/inventory: ", updatedList)
      setInventory(updatedList);
    } else if (listName === "groceries") {
      console.log("PATCH /list/groceries: ", updatedList)
      setGroceryList(updatedList);
    }
  }

  useEffect(() => {
    const recipeToShow = cookbook.recipes[0].id || null;
    setSelectedRecipeId(recipeToShow);
  }, []);

  useEffect(() => {
    if (query) {
      const filteredRecipes = cookbook.recipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredRecipes);
    } else {
      setSearchResults(cookbook.recipes);
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

  const [initialRecipe, setInitialRecipe] = useState({
    title: "",
    ingredients: [""],
    steps: [""],
  })

  const onRecipeEdit = (recipe) => {
    console.log(`Edit recipe, recipeId: ${recipe.id}, cookbookId: ${cookbook.cookbookId}`);
    setInitialRecipe(recipe);
    setModalOpen(true);
  }

  const onRecipeDelete = (id) => {
    console.log(`Delete recipe, recipeId: ${id}, cookbookId: ${cookbook.cookbookId}`);
  }

  if (selectedRecipeId) {
    const selectedRecipe = cookbook.recipes.filter(
      (recipe) => recipe.id === selectedRecipeId
    );
    if (selectedRecipe.length > 0) {
      recipeToSelect = selectedRecipe[0];
    }
  }

  return (
    <container>
      {!loading && (
        <Router>
          <div className="App">
            <aside className="sidebar">
              <div className="sidebar__navigation">
                <Link to="/">
                  <img src={logo} height="60px" alt="Logo" />
                </Link>
                <Link to="/pantry">Pantry</Link>
              </div>
              <h1 className="sidebar__title">{cookbook.title}</h1>
              <h3 className="sidebar__subtitle">Cookbook</h3>
              <Navigation
                query={query}
                onQueryChange={handleQueryChange}
                recipes={searchResults}
                activeRecipe={selectedRecipeId}
                recipeToSelect={selectNewRecipe}
                toggleRecipeModal={setModalOpen}
              />
              <div className="sidebar__footer">
                <p>Hi, {user.name.split(" ")[0]}!</p>
                <p className="pointer" onClick={() => onLogout()}>Logout</p>
              </div>
            </aside>
            {modalOpen && (
              <RecipeForm
                initialRecipe={initialRecipe}
                toggleRecipeModal={setModalOpen}
              />
            )}
            <Switch>
              <Route exact path="/">
                {recipeToSelect ? (
                  <Recipe
                    recipe={recipeToSelect}
                    inventory={inventory}
                    groceryList={groceryList}
                    onRecipeEdit={onRecipeEdit}
                    onRecipeDelete={onRecipeDelete}
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
      )}
    </container>
  );
}

export default Main;
