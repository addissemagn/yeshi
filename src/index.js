import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux'

import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'

import rootReducer from './store/reducers'

import './styles/index.css';

const store = createStore(
  rootReducer,
  applyMiddleware(thunk, logger)
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
