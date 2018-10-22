import {fromJS} from 'immutable';
import MAP_STYLE from './map-style-basic-v8.json';

// For more information on data-driven styles, see https://www.mapbox.com/help/gl-dds-ref/
export const dataLayer = fromJS({
  id: 'tsw_violations_style',
  source: 'tsw_violations',
  type: 'circle',
  interactive: true,
  paint: {
    'circle-color': [
      'match',
      ['get', 'SRC'],
      'DSD_PTS', 'blue',
      'TSW_SF', 'orange',
      '#000000'
    ]
  }
});

export const defaultMapStyle = fromJS(MAP_STYLE);
