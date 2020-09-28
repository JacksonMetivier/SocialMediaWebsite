import React from 'react';
import ReactDOM from 'react-dom';
import App from './Components/Base/BaseContainer';
import * as serviceWorker from './serviceWorker';
import BaseContainer from './Components/Base/BaseContainer';
import { BrowserRouter } from 'react-router-dom';
import { StateMachineProvider } from 'little-state-machine'
import '../src/style.css'
import { createStore } from "little-state-machine"

createStore({
  yourDetails: {
      email: '',
      firstName: '',
      lastName: '',
      password1: '',
      password2: '',
      phone: '',
      whereFrom: '',
      dayOfBirth: '',
      monthOfBirth: '',
      yearOfBirth: '',
      aboutMe: ''
  }
})

ReactDOM.render(
  <StateMachineProvider>
    <BrowserRouter>
      <BaseContainer />
    </BrowserRouter>
  </StateMachineProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
