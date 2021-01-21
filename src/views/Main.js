import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import _ from "lodash";

import logo from "../assets/cooking.svg";

import api from "../api";
import { removeIndexFromArray, getCookie, validateRecipe } from "../lib";

import Recipe from "../components/Recipe";
import RecipeForm from "../components/RecipeForm";
import Navigation from "../components/Navigation";
import Pantry from "../components/Pantry";


const Main = ({ user, onLogout }) => {
  const mobileSize = window.matchMedia("(max-width: 600px)").matches;
  const [token, setToken] = useState(getCookie("token"));

  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState();
  const [cookbook, setCookbook] = useState({});

  const [inventory, setInventory] = useState([]);
  const [groceryList, setGroceryList] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const [initialRecipe, setInitialRecipe] = useState({
    title: "",
    ingredients: [""],
    steps: [""],
  });

  const [recipeParams, setRecipeParams] = useState(initialRecipe);
  const [recipeParamsErrors, setRecipeParamsErrors] = useState({
    title: '',
    ingredients: '',
    steps: '',
  })

  const [selectedRecipe, setSelectedRecipe] = useState({})
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);

  useEffect(() => {
    // TODO: Get all cookbooks user is subscribed to, right now only first
    const fetchCookbooks = async () => {
      if (user.cookbookIds && user.cookbookIds.length > 0) {
        const res = await api.getCookbookById(user.cookbookIds[0], token);
        setCookbook(res);
        // Initialize to first recipe
        setSelectedRecipeId(res.recipes && res.recipes.length > 0 && res.recipes[0].id || null);
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
      const selectedRecipe = cookbook.recipes.filter(
        (recipe) => recipe.id === selectedRecipeId
      );
      if (selectedRecipe.length > 0) {
        setSelectedRecipe(selectedRecipe[0]);
      }
    }
  }, [cookbook, selectedRecipeId]);

  // Searching recipes
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
      setModalOpen(false);
    }
  };

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

  const handleQueryChange = (e) => {
    const { value } = e.target;
    setQuery(value);
  };

  const onRecipeEdit = (recipe) => {
    console.log(
      `Edit recipe, recipeId: ${recipe.id}, cookbookId: ${cookbook.cookbookId}`
    );
    setInitialRecipe(recipe);
    setModalOpen(true);
  };

  // TODO: Add error handling
  const onRecipeDelete = async (id) => {
    const getIndexInRecipeList = (id) => {
      // FIXME: Likely a much more efficient way to do this (like storing the id with the index or fixing the endpoint's funcionality) but my brain is on the 1AM mode
      for (var i = 0; i < cookbook.recipes.length; i += 1) {
        if (cookbook.recipes[i].id == id) {
          return i;
        }
      }
    }

    const index = getIndexInRecipeList(id);
    const updatedCookbook = await api.deleteRecipeByIndex(cookbook.cookbookId, index, token);
    setCookbook(updatedCookbook);
    window.location.reload();
  };

  const onCreateRecipe = async (e, recipeParams) => {
    e.preventDefault()
    setRecipeParamsErrors({});

    const errs = validateRecipe(recipeParams);


    if(Object.keys(errs).length > 0) {
      setRecipeParamsErrors(errs);
    } else {
      const updatedCookbook = await api.addRecipeToCookbook(cookbook.cookbookId, recipeParams, token);
      setCookbook(updatedCookbook);
      setModalOpen(false);
      window.location.reload();
    }
  }

  const toggleMobileNav = () => {
    setShowMobileNav(!showMobileNav);
  };

  const onUploadImageToRecipe = async (files) => {
    console.log(files)
    if (files && files.length > 0) {
      const updatedCookbook = await api.uploadImagesToRecipe(
        cookbook.cookbookId,
        files,
        token
      );
      setCookbook(updatedCookbook)
      window.location.reload();
    }
  }

  const onRecipeImageUpload = async (image) => {
    setRecipeParamsErrors({});

    const recipe = await api.uploadRecipeImage(image, token)
    if (recipe){
      setRecipeParams({
        ...recipe,
        ...(!recipe.title && { title: "" }),
        ...(!recipe.ingredients && { ingredients: [] }),
        ...(!recipe.steps && { steps: [] }),
      });
    }
  }

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
            {(!mobileSize || (mobileSize && !showMobileNav)) && (
              <div className="container">
              {!modalOpen && (
              <Switch>
                <Route exact path="/">
                  {Object.keys(selectedRecipe).length > 0 ? (
                    <Recipe
                      recipe={selectedRecipe}
                      inventory={inventory}
                      groceryList={groceryList}
                      onRecipeEdit={onRecipeEdit}
                      onRecipeDelete={onRecipeDelete}
                      onAddToList={addIngredientsToList}
                      onUploadImageToRecipe={onUploadImageToRecipe}
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
              {modalOpen && (
                <RecipeForm
                  toggleRecipeModal={setModalOpen}
                  onSubmit={onCreateRecipe}
                  onRecipeImageUpload={onRecipeImageUpload}
                  recipeParams={recipeParams}
                  recipeParamsErrors={recipeParamsErrors}
                  setRecipeParams={setRecipeParams}
                />
              )}
              </div>
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
