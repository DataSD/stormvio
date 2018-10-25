import React, { Component } from 'react';

//import logo from './logo.svg';
import './App.css';

import {defaultMapStyle, dataLayer} from './map-style.js';
import {updatePercentiles} from './utils';
import {fromJS} from 'immutable';
import {json as requestJson} from 'd3-request';
import Dashboard from './Dashboard.js'




export default class App extends Component {

  render() {


    return (
  <Dashboard/>
    );
  }

}


