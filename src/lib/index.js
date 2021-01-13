export const removeIndexFromArray = (arr, index) => arr.filter((val, i) => i !== index);

export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};

export const eraseCookie = (name) => {
    document.cookie = name+'=; Max-Age=-99999999;';
}

export const validateLoginParams = (obj) => {
  const { username, password } = obj;

  if (!username) {
    return "Username is required";
  } else if (!password) {
    return "Password is required";
  }

  return "";
};
