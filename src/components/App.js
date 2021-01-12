import React, { useState, useEffect } from 'react';
import _ from 'lodash';

import Main from './Main';
import Login from './Login';


const App = () => {
  const [loggedIn, setLoggedIn] = useState(true)

  const onLogin = (params) => {
    console.log(params);
    setLoggedIn(true);
  };

  const onLogout = () => {
    setLoggedIn(false);
  }

  if (loggedIn) {
    return (<Main onLogout={onLogout}/>)
  } else {
    return (<Login onLogin={onLogin}/>)
  }
}

export default App;
