import React, { Component } from 'react';
import MapGL, {Marker, NavigationControl} from 'react-map-gl'
import Geocoder from 'react-map-gl-geocoder'

//import logo from './logo.svg';
import './App.css';
import 'mapbox-gl/dist/mapbox-gl.css';

import {defaultMapStyle, dataLayer} from './map-style.js';
import {updatePercentiles} from './utils';
import {fromJS} from 'immutable';
import {json as requestJson} from 'd3-request';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Container,
  Row,
  Col,
  Button } from 'reactstrap';

import Dashboard from './Dashboard.js'


const MAPBOX_TOKEN = 'pk.eyJ1IjoicXVhbmRhcnkiLCJhIjoiY2pndmVrcHU5MHJ4cTJxcDgwcjJubnBucyJ9.wRn-2fAYIED8VQDqo0M1CQ';

const navStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  padding: '10px'
};


export default class App extends Component {

  constructor(props) {
    super (props);
    this.toggle = this.toggle.bind(this);

    this.state = {
      mapStyle: defaultMapStyle,
      data: null,
      hoveredFeature: null,
      navbarOpen: false,
      viewport: {
        latitude: 32.7157,
        longitude: -117.1611,
        zoom: 12,
        bearing: 0,
        pitch: 0,
        width: 500,
        height: 500
      }
    };

    this.mapRef = React.createRef()

  }




  componentDidMount() {
    window.addEventListener('resize', this._resize);
    this._resize();

    requestJson('data/tsw_violations_merged.geojson', (error, response) => {
      if (!error) {
        this._loadData(response);
      }
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
  }

  toggle () {
    this.setState({ navbarOpen: !this.state.navbarOpen });
  }

  _resize = () => {
    console.log(window.innerWidth);
    let finalHeight = window.innerHeight - window.navbarHeight;
    this.setState({
      viewport: {
        ...this.state.viewport,
        width: this.props.width || window.innerWidth,
        height: this.props.height || window.innerHeight - 240
      }
    });
  };

  _loadData = data => {

    //updatePercentiles(data, f => f.properties.income[this.state.year]);

    const mapStyle = defaultMapStyle
      // Add geojson source to map
      .setIn(['sources', 'tsw_violations'], fromJS({type: 'geojson', data}))
      // Add point layer to map
      .set('layers', defaultMapStyle.get('layers').push(dataLayer));

    this.setState({data, mapStyle});
  };

  _onViewportChange = viewport => this.setState({viewport});

  _onHover = event => {
    const {features, srcEvent: {offsetX, offsetY}} = event;
    const hoveredFeature = features && features.find(f => f.layer.id === 'tsw_violations_style');

    this.setState({hoveredFeature, x: offsetX, y: offsetY});
  };

  _onClick = event => {
    console.log(event);

    //const {features, srcEvent: {offsetX, offsetY}} = event;
    //const clickedFeature = features && features.find(f => f.layer.id === 'data');
  }

  _renderTooltip() {
    const {hoveredFeature, year, x, y} = this.state;

    return hoveredFeature && (
      <div className="tooltip" style={{left: x, top: y}}>
        <div>State: {hoveredFeature.properties.name}</div>
        <div>Median Household Income: {hoveredFeature.properties.value}</div>
        <div>Percentile: {hoveredFeature.properties.percentile / 8 * 100}</div>
      </div>
    );
  }

  render() {

    const {viewport, mapStyle} = this.state;

    return (
      <div className="App">
        <Navbar color="inverse" light expand="md">
          <NavbarBrand href="/">StormVio</NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.navbarOpen} navbar>
              <Nav className="ml-auto" navbar>
                  <NavItem>
                      <NavLink href="/components/">Components</NavLink>
                  </NavItem>
                  <NavItem>
                        <NavLink href="https://github.com/reactstrap/reactstrap">Github</NavLink>
                  </NavItem>
              </Nav>
            </Collapse>
        </Navbar>
  <Dashboard/>



        <div className="map-container">
        <MapGL
          {...viewport}
          ref={this.mapRef}
          mapStyle={mapStyle}
          onViewportChange={this._onViewportChange}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          onClick={this._onClick}
          onHover={this._onHover} className="main-map" >

          {this._renderTooltip()}


        <Geocoder mapRef={this.mapRef} onViewportChange={this._onViewportChange} mapboxApiAccessToken={MAPBOX_TOKEN} />
        <div className="nav" style={navStyle}>
          <NavigationControl onViewportChange={this._updateViewport} />
        </div>

        </MapGL>
      </div>

        <div className="info-container">
          hello
        </div>

      </div>
    );
  }

}


