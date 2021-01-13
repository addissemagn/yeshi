import React from 'react';

import logo from '../assets/cooking.svg';

const Login = ({ params, paramsError, onFieldChange, onLogin }) => (
  <div className="Login">
    <form onSubmit={() => onLogin(params)}>
      <div className="Login__header">
        <img src={logo} height="60px" alt="Logo" />
        <h1>Yeshi</h1>
      </div>
      <h1 className="Login__title">Login</h1>
      {paramsError ? <p className="Login__error">{paramsError}</p> : ""}
      <input
        id="username"
        className="Navigation__input"
        type="text"
        placeholder="Username"
        value={params.username}
        onChange={onFieldChange}
      />
      <input
        id="password"
        className="Navigation__input"
        type="password"
        placeholder="Password"
        value={params.password}
        onChange={onFieldChange}
      />
      <button
        className="Recipe__button Navigation__button-active mt-22"
        onClick={onLogin}
      >
        Submit
      </button>
    </form>
  </div>
);

export default Login;
