const api = {
  login: async (params) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: "POST",
        body: JSON.stringify(params),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const auth = await res.json();
      return auth;
    } catch (err) {
      console.log(err);
    }
  },
  // Gets logged in user
  getUser: async (token) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/user`, {
        method: "GET",
        headers: {
          token: token,
        },
      });

      const user = await res.json();
      return user;
    } catch (err) {
      console.log(err);
    }
  },
  getCookbookById: async (id, token) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/cookbook/${id}`, {
        method: "GET",
        headers: {
          token: token,
        },
      });

      const cookbook = await res.json();
      return cookbook;
    } catch (err) {
      console.log(err);
    }
  },
  // Type = {"groceries", "inventory"}
  updateList: async (type, list, token) => {
    try {
      const params = {
        list: list
      }
      const res = await fetch(`${process.env.REACT_APP_API_URL}/list/${type}`, {
        method: "PATCH",
        body: JSON.stringify(params),
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });

      const updatedList = await res.json();
      return updatedList;
    } catch (err) {
      console.log(err);
    }
  },
  addRecipeToCookbook: async (cookbookId, params, token) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/cookbook/${cookbookId}`, {
        method: "POST",
        body: JSON.stringify({ recipe: params }),
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });

      const updatedCookbook = await res.json();
      return updatedCookbook;
    } catch (err) {
      console.log(err);
    }
  },
  deleteRecipeByIndex: async (cookbookId, recipeIndex, token) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/cookbook/${cookbookId}`, {
        method: "DELETE",
        body: JSON.stringify({ recipeIndex: recipeIndex }),
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });

      const updatedCookbook = await res.json();
      return updatedCookbook;
    } catch (err) {
      console.log(err);
    }
  },
  uploadRecipeImage: async (file, token) => {
    let formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/ocr/recipe`, {
        method: "POST",
        body: formData,
        headers: {
          token: token,
        },
      });

      const recipeDetected = await res.json();
      return recipeDetected;
    } catch (err) {
      console.log(err);
    }
  },
  uploadImagesToRecipe: async (cookbookId, files, token) => {
    let formData = new FormData();
    let imgKeys = Object.keys(files);
    console.log(files)

    for (var i = 0; i < imgKeys.length; i++) {
      formData.append("image", files[i]);
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/cookbook/${cookbookId}/upload`, {
        method: "POST",
        body: formData,
        headers: {
          token: token,
        },
      });

      const updatedCookbook = await res.json();
      return updatedCookbook;
    } catch (err) {
      console.log(err);
    }
  }
};

export default api;