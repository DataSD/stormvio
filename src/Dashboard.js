import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Grid from '@material-ui/core/Grid';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import GpsFixed from '@material-ui/icons/GpsFixed';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { mainListItems, secondaryListItems } from './listItems';
import SimpleLineChart from './SimpleLineChart';
import ControlledExpansionPanel from './ControlledExpansionPanel';
import Paper from '@material-ui/core/Paper';
import {fromJS} from 'immutable';
import {json as requestJson} from 'd3-request';

import debounce from 'lodash/debounce';

import MapGL, {Marker, NavigationControl, FlyToInterpolator, LinearInterpolator} from 'react-map-gl'
import MatGeocoder from 'react-mui-mapbox-geocoder'

//import logo from './logo.svg';
import 'mapbox-gl/dist/mapbox-gl.css';

import {defaultMapStyle, dataLayer} from './map-style.js';



const drawerWidth = 240;


const navStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  padding: '10px'
};


const geocoderApiOptions = {
    country: 'us',
    proximity: {longitude: -117.1611, latitude: 32.7157},
    bbox: [-117.321899, 32.507488, -116.798203, 33.114231]
  }



const styles = theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  appBarSpacer: {
    height: '1vh'
  },
  topAppBarSpacer: {
    height: '7vh'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: '100vh',
    overflow: 'auto',
  },
  tableContainer: {
    height: '40vh',
    overflow: 'auto',
  },
  mapContainer: {
    width: '100%',
    height: '35vh',
  },
  h5: {
    marginBottom: theme.spacing.unit * 2,
  },
  locateButton: {
    textAlign: 'center',
    paddingTop: 8,
    paddingBottom: 8
  },
  geocoderInput: {
  }
});

const MAPBOX_TOKEN = 'pk.eyJ1IjoicXVhbmRhcnkiLCJhIjoiY2pndmVrcHU5MHJ4cTJxcDgwcjJubnBucyJ9.wRn-2fAYIED8VQDqo0M1CQ';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      mapStyle: defaultMapStyle,
      mapData: null,
      visibleViolations: null,
      viewport: {
        latitude: 32.7157,
        longitude: -117.1611,
        zoom: 12,
        bearing: 0,
        pitch: 0,
        width: window.innerWidth - 300,
        height: window.innerHeight - 400,
      }
    };

    this.mapRef = React.createRef();
    this.mapContainer = React.createRef();

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

  _resize = debounce(() => {
    console.log('re');

    console.log(this.mapContainer.current.clientWidth);
    console.log(this.mapContainer.current.clientHeight);
    console.log(this.mapContainer.current);

    this.setState({
      viewport: {
        ...this.state.viewport,
        //width: this.props.width || window.innerWidth - 300,
        //height: this.props.height || window.innerHeight,
        width: this.mapContainer.current.clientWidth,
        height: this.mapContainer.current.clientHeight
      }
    });
  }, 500);



  _loadData = data => {

    //updatePercentiles(data, f => f.properties.income[this.state.year]);

    const mapStyle = defaultMapStyle
      // Add geojson source to map
      .setIn(['sources', 'tsw_violations'], fromJS({type: 'geojson', data}))
      // Add point layer to map
      .set('layers', defaultMapStyle.get('layers').push(dataLayer));

    this.setState({mapData: data, mapStyle});
    this._getVisibleViolations();
  };

  _getVisibleViolations = debounce(() => {
    console.log('GVV');
    let map = this.mapRef.current.getMap()
    let bounds = map.getBounds()
    let p_bounds = [map.project(bounds['_sw']), map.project(bounds['_ne'])]
    // TODO -- slicing features down
    let visibleViolations = this.mapRef.current.queryRenderedFeatures(p_bounds, {layers: ['tsw_violations_style']}).slice(0, 10);
    this.setState({visibleViolations});
  }, 1000);

  _onViewportChange = viewport => {
    this._getVisibleViolations();
    this.setState({viewport});
  }

  _goToGeocoderResult = (result) => {
    // Go to result.
    console.log(result);

    this.setState({
      viewport: {
        ...this.state.viewport,
        //width: this.props.width || window.innerWidth - 300,
        //height: this.props.height || window.innerHeight,
        width: this.mapContainer.current.clientWidth,
        height: this.mapContainer.current.clientHeight,
        longitude: result.center[0],
        latitude: result.center[1],
        zoom: 17,
        transitionDuration:1000,
        transitionInterpolator: new FlyToInterpolator()
      }
    });
  }

  locateUser = () => {
    // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation
    navigator.geolocation.getCurrentPosition(position => {

      this.setState({
        viewport: {
          ...this.state.viewport,
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
          zoom: 17,
          transitionDuration:1000,
          transitionInterpolator: new FlyToInterpolator()
        }
      });
    });
  }




  handleDrawerOpen = () => {
    this.setState({ open: true });
    this._resize();
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
    this._resize();
  };

  render() {
    const { classes } = this.props;
    const {viewport, mapStyle, visibleViolations} = this.state;

    return (
      <React.Fragment>
        <CssBaseline />
        <div className={classes.root}>
          <AppBar
            position="absolute"
            className={classNames(classes.appBar, this.state.open && classes.appBarShift)}
          >
            <Toolbar disableGutters={!this.state.open} className={classes.toolbar}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(
                  classes.menuButton,
                  this.state.open && classes.menuButtonHidden,
                )}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                className={classes.title}
              >
                StormVIO
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer
            variant="permanent"
            classes={{
              paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
            }}
            open={this.state.open}
          >
            <div className={classes.toolbarIcon}>
              <IconButton onClick={this.handleDrawerClose}>
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <Divider />
            <List>{mainListItems}</List>
          </Drawer>
          <main className={classes.content}>
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <div className={classes.topAppBarSpacer} />
              </Grid>


              <Grid item xs={12} sm={3} md={2}>
                <Paper>
                <div className={classes.locateButton} >
                  <IconButton onClick={this.handleDrawerClose}>
                    <GpsFixed onClick={this.locateUser}/>
                  </IconButton>
                </div>
                </Paper>
              </Grid>


              <Grid item xs={12} sm={9} md={10}>
                <div className={classes.geocoderInput} >
                  <MatGeocoder
                    inputPlaceholder="Search Address"
                    accessToken={MAPBOX_TOKEN}
                    onSelect={result => this._goToGeocoderResult(result)}
                    showLoader={true}
                    {...geocoderApiOptions}
                  />
                </div>
              </Grid>

              <Grid item xs={12}>
                <div className={classes.appBarSpacer} />
              </Grid>


              <Grid item xs={12}>
                <Paper>
                  <div className={classes.mapContainer} ref={this.mapContainer}>
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
                  </div>
                </Paper>
              </Grid>



              <Grid item xs={12}> <div className={classes.appBarSpacer} /></Grid>
              <Grid item xs={12}>
                <Paper>
                  <div className={classes.tableContainer}>
                    <ControlledExpansionPanel mapData={visibleViolations}/>
                  </div>
                </Paper>
              </Grid>
          </Grid>
          </main>
        </div>
      </React.Fragment>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);
