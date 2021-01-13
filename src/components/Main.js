import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import _ from "lodash";

import logo from "../assets/cooking.svg";

import { api } from "../api";
import { removeIndexFromArray, getCookie } from "../lib";

import Recipe from "./Recipe";
import RecipeForm from "./RecipeForm";
import Navigation from "./Navigation";
import Pantry from "./Pantry";


const Main = ({ user, onLogout }) => {
  const mobileSize = window.matchMedia("(max-width: 600px)").matches;
  const [token, setToken] = useState(getCookie("token"));

  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState();
  const [cookbook, setCookbook] = useState({});

  const [inventory, setInventory] = useState([]);
  const [groceryList, setGroceryList] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRecipeId, setSelectedRecipeId] = useState("1");

  useEffect(() => {
    // TODO: Get all cookbooks user is subscribed to, right now only first
    const fetchCookbooks = async () => {
      if (user.cookbookIds && user.cookbookIds.length > 0) {
        const res = await api.getCookbookById(user.cookbookIds[0], token);
        setCookbook(res);
        setSearchResults(res.recipes);
      }

      setLoading(false);
    };

    if (Object.keys(user).length > 0) {
      fetchCookbooks();
      setInventory(user.inventory);
      setGroceryList(user.groceryList);
    }
  }, [user]);

  // After cookbook is initialized
  useEffect(() => {
    if (cookbook.recipes && cookbook.recipes.length > 0) {
      const recipeToShow = cookbook.recipes[0].id || null;
      setSelectedRecipeId(recipeToShow);
    }
  }, [cookbook]);

  // On recipe select change
  useEffect(() => {
    if (selectedRecipeId && cookbook.recipes) {
      const selectedRecipe = cookbook.recipes.filter(
        (recipe) => recipe.id === selectedRecipeId
      );
      if (selectedRecipe.length > 0) {
        recipeToSelect = selectedRecipe[0];
      }
      recipeToSelect = {
        id: "1",
        title: "Doro Wot",
        ingredients: ["Onion", "Spicy Stuff", "Garlic"],
        steps: ["Do this thing", "Then do that thing", "And then voila!"],
      };
    }
  }, [selectedRecipeId]);

  const [modalOpen, setModalOpen] = useState(false);

  const addIngredientsToList = async (ingredients, listName) => {
    const list = listName === "inventory" ? inventory : groceryList;

    const missingInList = _.difference(ingredients, list);
    const updatedList = list.concat(missingInList);

    if (missingInList.length > 0) {
      const res = await api.updateList(listName, updatedList, token);

      if (listName === "inventory") {
        setInventory(res.inventory);
      } else if (listName === "groceries") {
        setGroceryList(res.groceryList);
      }
    }
  };

  const deleteIngredientFromList = async (index, listName) => {
    const list = listName === "inventory" ? inventory : groceryList;
    const updatedList = removeIndexFromArray(list, index);
    const res = await api.updateList(listName, updatedList, token);

    if (listName === "inventory") {
      setInventory(res.inventory);
    } else if (listName === "groceries") {
      setGroceryList(res.groceryList);
    }
  };

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
  });

  const onRecipeEdit = (recipe) => {
    console.log(
      `Edit recipe, recipeId: ${recipe.id}, cookbookId: ${cookbook.cookbookId}`
    );
    setInitialRecipe(recipe);
    setModalOpen(true);
  };

  const onRecipeDelete = (id) => {
    console.log(
      `Delete recipe, recipeId: ${id}, cookbookId: ${cookbook.cookbookId}`
    );
  };

  const onCreateRecipe = async (e, recipeParams) => {
    e.preventDefault()

    const updatedCookbook = await api.addRecipeToCookbook(cookbook.cookbookId, recipeParams, token);
    setCookbook(updatedCookbook);
    setModalOpen(false);
  }

  const [showMobileNav, setShowMobileNav] = useState(false);

  const toggleMobileNav = () => {
    setShowMobileNav(!showMobileNav);
  };

  return (
    <div>
      {!loading && (
        <Router>
          <div className="App">
            <aside className="sidebar">
              <div className="sidebar__navigation">
                <Link to="/">
                  <img src={logo} height="60px" alt="Logo" />
                </Link>
                {!mobileSize ? (
                  <Link to="/pantry">Pantry</Link>
                ) : (
                  <p className="pointer" onClick={() => onLogout()}>
                    Logout
                  </p>
                )}
              </div>
              <h1 className="sidebar__title">{cookbook.title}</h1>
              <h3 className="sidebar__subtitle">Cookbook</h3>
              {!mobileSize && (
                <span>
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
                    <p className="pointer" onClick={() => onLogout()}>
                      Logout
                    </p>
                  </div>
                </span>
              )}
            </aside>
            {modalOpen && (
              <RecipeForm
                initialRecipe={initialRecipe}
                toggleRecipeModal={setModalOpen}
                onSubmit={onCreateRecipe}
              />
            )}
            {(!mobileSize || (mobileSize && !showMobileNav)) && (
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
            )}
            {mobileSize && (
              <span>
                {showMobileNav && (
                  <Navigation
                    query={query}
                    onQueryChange={handleQueryChange}
                    recipes={searchResults}
                    activeRecipe={selectedRecipeId}
                    recipeToSelect={selectNewRecipe}
                    toggleRecipeModal={setModalOpen}
                  />
                )}

                <div className="MobileMenu__footer">
                  {!showMobileNav ? (
                    <span
                      role="img"
                      aria-label="search"
                      onClick={() => toggleMobileNav()}
                    >
                      🔍 Recipies
                    </span>
                  ) : (
                    <span
                      role="img"
                      aria-label="close"
                      onClick={() => toggleMobileNav()}
                    >
                      ✖️ Close
                    </span>
                  )}
                  <span
                    role="img"
                    aria-label="pantry"
                    onClick={() => setShowMobileNav(false)}
                  >
                    <Link to="/pantry">Pantry</Link>
                  </span>
                </div>
              </span>
            )}
          </div>
        </Router>
      )}
    </div>
  );
};

export default Main;
