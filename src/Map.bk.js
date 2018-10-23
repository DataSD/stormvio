import React, { Component } from 'react';
import MapGL, {Marker, NavigationControl} from 'react-map-gl'
import Geocoder from 'react-map-gl-geocoder'
import Paper from '@material-ui/core/Paper';

//import logo from './logo.svg';
import 'mapbox-gl/dist/mapbox-gl.css';

import {defaultMapStyle, dataLayer} from './map-style.js';
import {fromJS} from 'immutable';
import {json as requestJson} from 'd3-request';

const MAPBOX_TOKEN = 'pk.eyJ1IjoicXVhbmRhcnkiLCJhIjoiY2pndmVrcHU5MHJ4cTJxcDgwcjJubnBucyJ9.wRn-2fAYIED8VQDqo0M1CQ';

const navStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  padding: '10px'
};


export default class Map extends Component {

  constructor(props) {
    super (props);

    this.state = {
      mapStyle: defaultMapStyle,
      mapData: this.props.mapData,
      viewport: {
        latitude: 32.7157,
        longitude: -117.1611,
        zoom: 12,
        bearing: 0,
        pitch: 0,
        width: 900,
        height: 500
      }
    };


  }




  componentDidMount() {
    window.addEventListener('resize', this._resize);
    this._resize();
  }

  componentDidUpdate(prevProps) {
    if (this.state.mapData != this.props.mapData) {
      this._loadData(this.props.mapData);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
  }


  _resize = () => {

    /*this.setState({
      viewport: {
        ...this.state.viewport,
        width: this.props.width || window.innerWidth,
        height: this.props.height || window.innerHeight - 400
      }
    });*/
  };

  _loadData = data => {

    //updatePercentiles(data, f => f.properties.income[this.state.year]);

    const mapStyle = defaultMapStyle
      // Add geojson source to map
      .setIn(['sources', 'tsw_violations'], fromJS({type: 'geojson', data}))
      // Add point layer to map
      .set('layers', defaultMapStyle.get('layers').push(dataLayer));

    this.setState({mapData: data, mapStyle});
  };

  _onViewportChange = viewport => this.setState({viewport});

  _onHover = event => {
    const {features, srcEvent: {offsetX, offsetY}} = event;
    const hoveredFeature = features && features.find(f => f.layer.id === 'tsw_violations_style');

    this.setState({hoveredFeature, x: offsetX, y: offsetY});
  };

  _onClick = event => {
    console.log(event);

  }

  render() {

    const {viewport, mapStyle} = this.state;

    return (

      <Paper>
        <MapGL
          {...viewport}
          ref={this.mapRef}
          mapStyle={mapStyle}
          onViewportChange={this._onViewportChange}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          onClick={this._onClick}
          onHover={this._onHover} className="main-map" >
            <div className="nav" style={navStyle}>
              <NavigationControl onViewportChange={this._updateViewport} />
            </div>
        </MapGL>
      </Paper>

    );
  }

}


