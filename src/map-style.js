import {fromJS} from 'immutable';
import MAP_STYLE from './map-style-basic-v8.json';

// For more information on data-driven styles, see https://www.mapbox.com/help/gl-dds-ref/
/*export const dataLayer = fromJS({
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
});*/


export const clusterLayer = fromJS({
    id: "clusters",
    type: "circle",
    source: "tsw_violations",
    filter: ["has", "point_count"],
    paint: {
        // Use step expressions (https://www.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
        // with three steps to implement three types of circles:
        //   * Blue, 20px circles when point count is less than 100
        //   * Yellow, 30px circles when point count is between 100 and 750
        //   * Pink, 40px circles when point count is greater than or equal to 750
        "circle-color": [
            "step",
            ["get", "point_count"],
            "#51bbd6",
            2,
            "#f1f075",
            10,
            "#f28cb1"
        ],
        "circle-radius": [
            "step",
            ["get", "point_count"],
            10,
            2,
            20,
            10,
            30
        ]
    }
});



export const clusterCountLayer = fromJS({
    id: "cluster-count",
    type: "symbol",
    source: "tsw_violations",
    filter: ["has", "point_count"],
    layout: {
        "text-field": "{point_count_abbreviated}",
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 12
    }
});

export const unclusteredPointLayer = fromJS({
    id: "unclustered-point",
    type: "circle",
    source: "tsw_violations",
    filter: ["!", ["has", "point_count"]],
    paint: {
        "circle-radius": 7,
        //"circle-stroke-width": 1,
        //"circle-stroke-color": "#fff"
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
