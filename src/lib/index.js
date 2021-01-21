export const removeIndexFromArray = (arr, index) => arr.filter((val, i) => i !== index);

export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};

export const eraseCookie = (name) => {
    document.cookie = name+'=; Max-Age=-99999999;';
}

export const validateParams = (obj, type) => {
  const { username, password, name } = obj;

  if (type === "signup" && !name) {
    return "Name is required";
  } else if (!username) {
    return "Username is required";
  } else if (!password) {
    return "Password is required";
  }

  return "";
};

export const validateRecipe = (recipe) => {
  const errs = {};
  if (!recipe.title) {
    errs.title = "Required";
  }

  if (recipe.ingredients.length == 0) {
    errs.ingredients = "Minimum 1 ingredient";
  }

  if (recipe.steps.length == 0) {
    errs.steps = "Minimum 1 step";
  }

  return errs;
};
