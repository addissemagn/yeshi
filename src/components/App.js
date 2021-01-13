import React, { useState, useEffect } from 'react';
import _ from 'lodash';

import { api } from '../api';
import { getCookie, eraseCookie, validateLoginParams, getUser } from '../lib';

import Main from './Main';
import Login from './Login';


const App = () => {
  const [params, setParams] = useState({
      username: '',
      password: '',
  });
  const [paramsError, setParamsError] = useState("")
  const [token, setToken] = useState(getCookie("token") ? getCookie("token") : "");
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check the current token is valid
    const getUser = async () => {
      if (token) {
        const user = await api.getUser(token);

        if (user.message) {
          setParamsError("Session expired. Please login again.")
        } else {
          setUser(user);
          setLoggedIn(true);
        }
      }

      setLoading(false);
    };

    getUser();
  }, [token])

  const onLogin = async (e) => {
    e.preventDefault();
    const err = validateLoginParams(params);

    if (err) {
      setParamsError(err)
    } else {
      const auth = await api.login(params);

      if(auth.message) {
        setParamsError(auth.message)
      } else {
        if (auth.token) {
          document.cookie = `token=${auth.token};max-age=604800;`;
          setLoggedIn(true);
          window.location.reload();
        }
      }
    }
  };

  const onFieldChange = (e) => {
    const { id, value } = e.target;
    setParams({
      ...params,
      [id]: value,
    });
  };

  const onLogout = () => {
    eraseCookie("token");
    window.location.reload();
    return false;
  };

  if (!loading) {
    if (loggedIn) {
      return <Main user={user} onLogout={onLogout} />;
    } else {
      return (
        <Login
          params={params}
          paramsError={paramsError}
          onLogin={onLogin}
          onFieldChange={onFieldChange}
        />
      );
    }
  } else {
    // TODO: Add cute loading screen :)
    return (<div></div>)
  }
}

export default App;
