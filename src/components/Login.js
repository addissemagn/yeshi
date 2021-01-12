import React, { useState } from 'react';

import logo from '../assets/cooking.svg';

const Login = ({ onLogin }) => {
  const [params, setParams] = useState({
      username: '',
      password: '',
  });

  const [error, setError] = useState('');

  const onChange = (e) => {
    const { id, value } = e.target;
    setParams({
        ...params,
        [id]: value,
    })
  };

  return (
    <div className="Login">
      <form onSubmit={() => onLogin(params)}>
        <div className="Login__header">
            <img src={logo} height="60px" alt="Logo" />
            <h1>Yeshi</h1>
        </div>
        <h1 className="Login__title">Login</h1>
        {error ? <p className="Login__error">{error}</p> : ''}
        <input
          id="username"
          className="Navigation__input"
          type="text"
          placeholder="Username"
          value={params.username}
          onChange={onChange}
        />
        <input
          id="password"
          className="Navigation__input"
          type="password"
          placeholder="Password"
          value={params.password}
          onChange={onChange}
        />
        <button
          className="Recipe__button Navigation__button-active mt-22"
          onClick={() => onLogin(params)}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
