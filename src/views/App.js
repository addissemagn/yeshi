import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";
import _ from 'lodash';

import api from '../api';
import { getCookie, eraseCookie, validateParams, getUser } from '../lib';

import Main from './Main';
import Login from '../components/Login';
import SignUp from '../components/SignUp';


const App = () => {
  const history = useHistory();
  const [params, setParams] = useState({
      name: '',
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

        if (user && user.message) {
          setParamsError("Session expired. Please login again.")
        } else if (user) {
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
    const err = validateParams(params, "login");

    if (err) {
      setParamsError(err)
    } else {
      const auth = await api.login(params);

      if(!auth) {
        setParamsError("Internal server error")
      }
      else if (auth.message) {
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

  const onSignUp = async (e) => {
    e.preventDefault();
    const err = validateParams(params, "signup");

    if (err) {
      setParamsError(err)
    } else {
      const auth = await api.login(params);

      if(!auth) {
        setParamsError("Internal server error")
      }
      else if (auth.message) {
        setParamsError(auth.message)
      } else {
        if (auth.token) {
          setParamsError("Login to your new account")
          // document.cookie = `token=${auth.token};max-age=604800;`;
          // setLoggedIn(true);
          // window.location.reload();
          window.location.href = '/';
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
        <Router>
          <Switch>
            <Route exact path="/signup">
              <SignUp
                params={params}
                paramsError={paramsError}
                onSignUp={onSignUp}
                onFieldChange={onFieldChange}
                LoginLinkWrapper={({ children }) => <Link to="/">{children}</Link>}
              />
            </Route>
            <Route path="/">
              <Login
                params={params}
                paramsError={paramsError}
                onLogin={onLogin}
                onFieldChange={onFieldChange}
                SignUpLinkWrapper={({ children }) => <Link to="/signup">{children}</Link>}
              />
            </Route>
          </Switch>
        </Router>
      );
    }
  } else {
    // TODO: Add cute loading screen :)
    return (<div></div>)
  }
}

export default App;
